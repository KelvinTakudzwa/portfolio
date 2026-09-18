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
];

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

  const { ids: seenIds, bootstrapped } = await loadSeen();
  const seenSet = new Set(seenIds);
  const allIds = allJobs.map((j) => j.id);

  if (!bootstrapped) {
    // First run: don't spam every currently-live listing. Seed the seen
    // set with everything we see right now and notify on nothing.
    console.log(
      `Bootstrap run: seeding ${allIds.length} listing IDs as already-seen, no notifications sent.`
    );
    await saveSeen(allIds, true);
    return;
  }

  const matched = allJobs.filter((j) => matches(j, keywords, excludeKeywords));
  const newMatches = matched.filter((j) => !seenSet.has(j.id));

  console.log(
    `${matched.length} listings matched the keyword profile, ${newMatches.length} are new.`
  );

  const toSend = newMatches.slice(0, MAX_NOTIFY_PER_RUN);
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
