// Job watcher: pulls a few open job-board feeds, filters by keyword profile,
// and pings a Telegram bot with anything new. Zero scraping of sites that
// forbid it (LinkedIn/Indeed) — only sources with a public API or RSS feed
// meant for this kind of use.
//
// Run manually:   node watch.mjs
// Dry run (no Telegram send, just logs what would fire):
//                 DRY_RUN=1 node watch.mjs

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { XMLParser } from "fast-xml-parser";

const DRY_RUN = process.env.DRY_RUN === "1";
const SEEN_PATH = new URL("./seen.json", import.meta.url);
const KEYWORDS_PATH = new URL("./keywords.json", import.meta.url);
const MAX_SEEN = 3000;
const MAX_NOTIFY_PER_RUN = 20;

// ---- sources ---------------------------------------------------------

async function fetchRemoteOK() {
  const res = await fetch("https://remoteok.com/api", {
    headers: { "User-Agent": "job-watcher (personal use)" },
  });
  if (!res.ok) throw new Error(`RemoteOK HTTP ${res.status}`);
  const data = await res.json();
  return data
    .filter((j) => j && j.id) // first element is a legal notice, has no id
    .map((j) => ({
      id: `remoteok:${j.id}`,
      title: j.position,
      company: j.company,
      url: j.url || j.apply_url,
      tags: j.tags || [],
      source: "RemoteOK",
    }));
}

async function fetchArbeitnow() {
  const res = await fetch("https://www.arbeitnow.com/api/job-board-api");
  if (!res.ok) throw new Error(`Arbeitnow HTTP ${res.status}`);
  const { data } = await res.json();
  return (data || []).map((j) => ({
    id: `arbeitnow:${j.slug}`,
    title: j.title,
    company: j.company_name,
    url: j.url,
    tags: [...(j.tags || []), ...(j.job_types || [])],
    source: "Arbeitnow",
  }));
}

// WordPress REST API (WP Job Manager plugin) — a real structured JSON
// endpoint, not HTML scraping. robots.txt allows it. Cloudflare blocks
// generic `curl/*` user agents on this host, so we identify honestly
// instead of spoofing a browser.
async function fetchVacancyBox() {
  const res = await fetch(
    "https://vacancybox.co.zw/wp-json/wp/v2/job-listings?per_page=50&orderby=date&order=desc",
    { headers: { "User-Agent": "job-watcher (personal use)" } }
  );
  if (!res.ok) throw new Error(`VacancyBox HTTP ${res.status}`);
  const data = await res.json();
  return data
    .filter((j) => j && j._filled !== 1)
    .map((j) => ({
      id: `vacancybox:${j.id}`,
      title: decodeHtmlEntities(j.title?.rendered),
      company: j._company_name || "",
      url: j.link,
      tags: [j._job_location].filter(Boolean),
      source: "VacancyBox",
    }));
}

async function fetchVacancyMail() {
  const res = await fetch("https://vacancymail.co.zw/feed/", {
    headers: { "User-Agent": "job-watcher (personal use)" },
  });
  if (!res.ok) throw new Error(`VacancyMail HTTP ${res.status}`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item || [];
  const list = Array.isArray(items) ? items : [items];
  return list
    .filter((it) => it && it.title)
    .map((it) => ({
      id: `vacancymail:${it.guid?.["#text"] || it.guid || it.link}`,
      // Titles come as "Job Title - Expiry Date: 2026-09-30"; strip the
      // suffix for a clean title (also lets it dedupe against the same
      // posting cross-listed on VacancyBox, which has no such suffix).
      title: String(it.title).replace(/\s*-\s*Expiry Date:.*$/i, "").trim(),
      company: "",
      url: it.link,
      tags: [],
      source: "VacancyMail",
    }));
}

// Adzuna: a real developer job-search API (free signup, not a scraping
// target) covering many national job markets in one place. We hit its
// "it-jobs" category per country, sorted newest-first, then let our own
// title matching (below) do the real precision filtering — same approach
// as every other source. Needs ADZUNA_APP_ID / ADZUNA_APP_KEY (free at
// developer.adzuna.com) as env vars / GitHub Actions secrets.
const ADZUNA_COUNTRIES = [
  { code: "au", label: "AU" },
  { code: "ca", label: "CA" },
  { code: "de", label: "DE" },
  { code: "pl", label: "PL" },
  { code: "za", label: "ZA" },
];

async function fetchAdzunaCountry(code, label, appId, appKey) {
  const url = new URL(`https://api.adzuna.com/v1/api/jobs/${code}/search/1`);
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("results_per_page", "50");
  url.searchParams.set("category", "it-jobs");
  url.searchParams.set("sort_by", "date");
  url.searchParams.set("content-type", "application/json");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Adzuna ${label} HTTP ${res.status}`);
  const data = await res.json();
  return (data.results || []).map((j) => ({
    id: `adzuna:${code}:${j.id}`,
    title: j.title,
    company: j.company?.display_name || "",
    url: j.redirect_url,
    tags: [j.location?.display_name, label].filter(Boolean),
    source: `Adzuna ${label}`,
  }));
}

async function fetchAdzuna() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    throw new Error(
      "Missing ADZUNA_APP_ID / ADZUNA_APP_KEY env vars (set as GitHub Actions secrets)."
    );
  }
  const results = await Promise.allSettled(
    ADZUNA_COUNTRIES.map((c) => fetchAdzunaCountry(c.code, c.label, appId, appKey))
  );
  const jobs = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      jobs.push(...r.value);
    } else {
      console.error(
        `Adzuna ${ADZUNA_COUNTRIES[i].label} failed:`,
        r.reason?.message || r.reason
      );
    }
  });
  return jobs;
}

async function fetchWeWorkRemotely() {
  const res = await fetch(
    "https://weworkremotely.com/categories/remote-programming-jobs.rss"
  );
  if (!res.ok) throw new Error(`WeWorkRemotely HTTP ${res.status}`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item || [];
  const list = Array.isArray(items) ? items : [items];
  return list
    .filter((it) => it && it.title)
    .map((it) => ({
      id: `wwr:${it.guid?.["#text"] || it.guid || it.link}`,
      title: String(it.title),
      company: String(it.title).split(":")[0] || "",
      url: it.link,
      tags: [it.category].filter(Boolean).map(String),
      source: "WeWorkRemotely",
    }));
}

const SOURCES = [
  { name: "RemoteOK", fn: fetchRemoteOK },
  { name: "Arbeitnow", fn: fetchArbeitnow },
  { name: "WeWorkRemotely", fn: fetchWeWorkRemotely },
  { name: "VacancyBox", fn: fetchVacancyBox },
  { name: "VacancyMail", fn: fetchVacancyMail },
  { name: "Adzuna", fn: fetchAdzuna },
];

// Zimbabwe is the priority market, not one equally-weighted source among
// nine others — used both to dedupe cross-posted Zim listings below and
// to give Zim matches an uncapped, guaranteed slot in main()'s notify step.
const ZIM_SOURCES = new Set(["VacancyBox", "VacancyMail"]);

function normalizeTitle(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/[-–—,.()/:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeCrossPosted(jobs) {
  const seenTitles = new Set();
  const out = [];
  for (const job of jobs) {
    if (!ZIM_SOURCES.has(job.source)) {
      out.push(job);
      continue;
    }
    const key = normalizeTitle(job.title);
    if (seenTitles.has(key)) continue;
    seenTitles.add(key);
    out.push(job);
  }
  return out;
}

function decodeHtmlEntities(s) {
  return String(s || "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// ---- matching ----------------------------------------------------------

function loadKeywords() {
  return readFile(KEYWORDS_PATH, "utf-8").then(JSON.parse);
}

// Match on title only. Tags from these feeds (RemoteOK especially) are
// unreliable — boosted/sponsored listings get a generic tag spray
// ("exec, design, marketing, sales...") unrelated to the actual role,
// which turns tag-based matching into noise. Titles are what a human
// filter would actually read.
function matches(job, keywords, excludeKeywords) {
  const haystack = (job.title || "").toLowerCase();
  if (excludeKeywords.some((k) => haystack.includes(k.toLowerCase()))) {
    return false;
  }
  return keywords.some((k) => haystack.includes(k.toLowerCase()));
}

// Fair-share ordering across sources: first job from each source in turn,
// then second from each, etc. Used so the per-run notification cap doesn't
// get monopolized by whichever source happens to have the most listings.
function interleaveBySource(jobs) {
  const bySource = new Map();
  for (const job of jobs) {
    if (!bySource.has(job.source)) bySource.set(job.source, []);
    bySource.get(job.source).push(job);
  }
  const queues = [...bySource.values()];
  const out = [];
  while (out.length < jobs.length) {
    let pushedAny = false;
    for (const q of queues) {
      if (q.length) {
        out.push(q.shift());
        pushedAny = true;
      }
    }
    if (!pushedAny) break;
  }
  return out;
}

// ---- seen-set persistence ------------------------------------------------

async function loadSeen() {
  if (!existsSync(SEEN_PATH)) return { ids: [], bootstrapped: false };
  const raw = await readFile(SEEN_PATH, "utf-8").catch(() => "{}");
  try {
    const parsed = JSON.parse(raw);
    return { ids: parsed.ids || [], bootstrapped: !!parsed.bootstrapped };
  } catch {
    return { ids: [], bootstrapped: false };
  }
}

async function saveSeen(ids, bootstrapped) {
  const trimmed = ids.slice(-MAX_SEEN);
  await writeFile(
    SEEN_PATH,
    JSON.stringify({ bootstrapped, updatedAt: new Date().toISOString(), ids: trimmed }, null, 2) + "\n"
  );
}

// ---- telegram ------------------------------------------------------------

async function sendTelegram(text) {
  if (DRY_RUN) {
    console.log("[DRY_RUN] would send:\n" + text + "\n---");
    return;
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error(
      "Missing TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID env vars (set as GitHub Actions secrets)."
    );
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram send failed: ${res.status} ${body}`);
  }
}

function formatJob(job) {
  const tagLine = job.tags?.length ? `\n<i>${job.tags.slice(0, 6).join(", ")}</i>` : "";
  return (
    `🟢 <b>${escapeHtml(job.title)}</b>\n` +
    `${escapeHtml(job.company || "")} · ${job.source}${tagLine}\n` +
    `${job.url}`
  );
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---- main ------------------------------------------------------------

async function main() {
  const { keywords, excludeKeywords } = await loadKeywords();

  const results = await Promise.allSettled(SOURCES.map((s) => s.fn()));
  const allJobs = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      allJobs.push(...r.value);
      console.log(`${SOURCES[i].name}: ${r.value.length} listings fetched`);
    } else {
      console.error(`${SOURCES[i].name} failed:`, r.reason?.message || r.reason);
    }
  });

  if (allJobs.length === 0) {
    console.error("No jobs fetched from any source this run. Exiting without changes.");
    return;
  }

  const dedupedJobs = dedupeCrossPosted(allJobs);
  if (dedupedJobs.length !== allJobs.length) {
    console.log(
      `Dropped ${allJobs.length - dedupedJobs.length} cross-posted duplicate(s) (VacancyBox/VacancyMail overlap).`
    );
  }

  const { ids: seenIds, bootstrapped } = await loadSeen();
  const seenSet = new Set(seenIds);
  const allIds = dedupedJobs.map((j) => j.id);

  if (!bootstrapped) {
    // First run (or a new source added to an already-bootstrapped file):
    // don't spam every currently-live listing. Seed the seen set with
    // everything we see right now and notify on nothing. Merge rather
    // than replace, so this never discards already-accumulated history
    // from sources that aren't part of this particular run's fetch.
    const merged = Array.from(new Set([...seenIds, ...allIds]));
    console.log(
      `Bootstrap run: seeding ${merged.length} listing IDs as already-seen (${allIds.length} from this run, ${seenIds.length} carried over), no notifications sent.`
    );
    await saveSeen(merged, true);
    return;
  }

  // Zimbabwe is the home market: notify on every new posting there
  // regardless of keyword, since local postings (sales, admin,
  // apprenticeships...) rarely match the tech-specific keyword profile
  // built for the international sources but are still wanted.
  const matched = dedupedJobs.filter(
    (j) => ZIM_SOURCES.has(j.source) || matches(j, keywords, excludeKeywords)
  );
  const newMatches = matched.filter((j) => !seenSet.has(j.id));

  console.log(
    `${matched.length} listings matched the keyword profile, ${newMatches.length} are new.`
  );

  // Zimbabwe jobs are the priority, not an equal-weighted source among
  // nine others: send every new Zim match uncapped, then fill whatever
  // cap room is left with a fair round-robin across the international
  // sources (RemoteOK/Arbeitnow/WeWorkRemotely/Adzuna-per-country) so none
  // of those crowds out the rest on a busy run.
  const zimMatches = newMatches.filter((j) => ZIM_SOURCES.has(j.source));
  const otherMatches = newMatches.filter((j) => !ZIM_SOURCES.has(j.source));
  const otherSlots = Math.max(0, MAX_NOTIFY_PER_RUN - zimMatches.length);
  const toSend = [...zimMatches, ...interleaveBySource(otherMatches).slice(0, otherSlots)];
  for (const job of toSend) {
    await sendTelegram(formatJob(job));
  }
  if (newMatches.length > toSend.length) {
    await sendTelegram(
      `…and ${newMatches.length - toSend.length} more new matches this run. Consider tightening keywords.json.`
    );
  }

  const mergedIds = Array.from(new Set([...seenIds, ...allIds]));
  await saveSeen(mergedIds, true);
}

main().catch((err) => {
  console.error("job-watcher failed:", err);
  process.exitCode = 1;
});
