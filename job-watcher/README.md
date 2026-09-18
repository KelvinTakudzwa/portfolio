# Job Watcher

A small, self-contained tool that checks a few open job-board feeds every
3 hours and pings a Telegram bot with new postings matching your keyword
profile. Runs entirely on GitHub Actions — nothing to host, nothing to pay
for.

It does **not** scrape LinkedIn, Indeed, or any site that forbids
scraping. It only reads sources with a public API or an RSS feed meant for
this kind of use:

- [RemoteOK](https://remoteok.com/api) (JSON API)
- [Arbeitnow](https://www.arbeitnow.com/api/job-board-api) (JSON API)
- [WeWorkRemotely](https://weworkremotely.com/categories/remote-programming-jobs.rss) (RSS)

For LinkedIn/Indeed specifically, set up their own native job alerts for
your search terms — they already do the watching reliably; this tool
covers what they don't.

## How it works

1. Every 3 hours, a GitHub Actions workflow (`.github/workflows/job-watcher.yml`)
   runs `watch.mjs`.
2. It fetches all three sources, filters titles against `keywords.json`,
   and compares against `seen.json` (committed back to the repo each run)
   to find what's actually new.
3. New matches get sent to your Telegram chat, one message per job (capped
   at 20 per run so a keyword that's too broad doesn't flood you).
4. The **first run ever** seeds `seen.json` with everything currently live
   and sends nothing — otherwise you'd get hit with hundreds of messages
   for jobs that have been posted for weeks.

Matching is **title-only** on purpose. These feeds' tag data (RemoteOK
especially) is unreliable — boosted listings get a generic tag spray
unrelated to the actual role — so tags would just add noise.

## One-time setup

**1. Create a Telegram bot**
Message [@BotFather](https://t.me/BotFather) on Telegram, send `/newbot`,
follow the prompts. You'll get a bot token like `123456:ABC-DEF...`.

**2. Get your chat ID**
Message your new bot anything (it won't reply yet), then visit:
`https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
Look for `"chat":{"id": ...}` in the response — that number is your chat ID.

**3. Add GitHub repo secrets**
In `github.com/KelvinTakudzwa/portfolio` → Settings → Secrets and variables
→ Actions → New repository secret:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

**4. Trigger it once manually**
Actions tab → Job Watcher → Run workflow. First run just bootstraps
(no messages). Run it again (or wait 3 hours) to see real notifications
start.

## Customizing

Edit `keywords.json` any time — no code changes needed, just commit.
`excludeKeywords` filters out titles containing those terms even if a
regular keyword also matches (useful for filtering out senior/staff-level
roles).

## Local testing

```bash
cd job-watcher
npm install
DRY_RUN=1 node watch.mjs   # logs what it would send, sends nothing
node watch.mjs             # real run, needs TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID in env
```
