# SWS Content Proofing

A no-login proofing calendar for Susquehanna Waldorf School's social media drafts. Anyone with the link opens the calendar, clicks a day, and approves the post or requests changes — decisions save instantly for everyone. Correne has a separate admin page to add and edit posts, resolve change requests, and preview/send a daily email rundown to Courtney and Liz.

This is a static site (`index.html` for reviewers, `admin.html` for Correne) plus a few small serverless functions in `api/` that read and write shared data in a free Vercel KV database. No framework, no build step, no accounts for Courtney or Liz.

## Deploy it (about 10 minutes, no coding)

**1. Put this folder on GitHub.**
- Go to [github.com](https://github.com) and sign in (or create a free account).
- Click **New repository**, name it something like `sws-content-proofing`, keep it Private or Public (either works), and create it.
- On the new repo's page, click **uploading an existing file** and drag in every file from this folder — `index.html`, `admin.html`, `posts.js`, `drive.js`, `package.json`, `.gitignore`, `vercel.json`, `README.md`, and the `api` folder with `approvals.js`, `posts.js`, and `digest.js` inside it. Commit the upload.

**2. Import it into Vercel.**
- Go to [vercel.com](https://vercel.com) and sign in with your GitHub account (this also connects the two).
- Click **Add New… → Project**, pick the repo, and click **Deploy**. No settings to change — Vercel detects the static pages and the `api` folder automatically.
- When it finishes, you'll get a live URL like `sws-content-proofing.vercel.app`. Opening it now will show the calendar, but Approve / Request Changes won't save yet — that's step 3.

**3. Add the shared database.**
- In your new Vercel project, open the **Storage** tab.
- Click **Create Database**, choose the **KV** option (built on Upstash Redis — the free tier is more than enough for this), give it a name, and create it.
- When it asks which project to connect it to, choose this one. Vercel adds the required settings automatically — you don't need to copy any keys by hand.
- Go to the **Deployments** tab, open the latest deployment's **⋯** menu, and choose **Redeploy** so the app picks up the new database connection.

**4. Share the links.**
- Reviewer calendar: your `.vercel.app` URL (or a custom domain, set up under Vercel's **Domains** tab — e.g. `proofing.susquehannawaldorf.org`). Send this to Courtney and Liz. No invite, no account, no password.
- Admin page: the same URL plus `/admin.html`. Send this to Correne only — see below.

## Admin page (for Correne)

`admin.html` is a second page, not linked from the reviewer calendar. From it, Correne can:

- **See what's changed** — a "since your last visit" banner at the top, plus a full activity feed, so she doesn't have to reread everything each time. That tracking lives in her browser only (`localStorage`); it starts over if she switches devices or clears browser data.
- **Add new posts** — the "+ Add new post" button opens a form: date, title, platform, caption, hashtags, photo direction, alt text, and an optional note. Leaving the caption blank saves it as a placeholder (shows as "not drafted yet" on the calendar) — handy for blocking out a date before the post is written.
- **Edit any existing post** — click **Edit** on any post in the "Manage posts" list. Changes appear on the reviewer calendar immediately.
- **Resolve change requests** — a post with pending changes shows a red outline and a **✓ Mark resolved** button for a quick clear, or click **Edit** to see the actual note Courtney or Liz left, make the fix, and save with "Also mark resolved" checked (on by default) to clear the flag in one step.

She "logs in" with a short PIN (defaults to `sws2026`). This is a light deterrent, not real security — read [How the data works](#how-the-data-works) below — but it does actually gate writes, unlike the reviewer calendar's open API:

**To change the PIN, update it in *two* places** so they stay in sync:
1. `admin.html` — find `var ADMIN_PIN = 'sws2026';` near the top of the `<script>` tag, change the value.
2. Vercel → your project → **Settings → Environment Variables** → add or edit `ADMIN_PIN` to the *same* value, then redeploy.

If you only change #1, the server (api/posts.js, api/digest.js) still accepts the old default — anyone who knows it could still push edits or trigger a send. Setting #2 is what actually enforces it.

## Adding images (Google Drive links)

Every post can carry up to 6 image links, shown as a thumbnail grid reviewers can click through to the full image on Drive.

**To add them:** in the admin page's Add/Edit form, paste up to 6 Google Drive links into "Image links," one per line (or comma-separated). Each file needs its Drive sharing set to **"Anyone with the link can view"** — otherwise the thumbnail won't load and it falls back to a plain "Open image" link instead (safe either way, just less convenient). This works with the standard link Drive gives you from its Share button, in any of its usual shapes (`.../file/d/.../view`, `.../open?id=...`, `.../uc?id=...`).

**How it works:** `drive.js` (a small shared helper, loaded by both `index.html` and `admin.html`) picks the file ID out of whatever link shape you pasted and builds a thumbnail URL from it. That thumbnail endpoint is an unofficial one Google doesn't formally document, but it's what most small tools use for exactly this and has been stable in practice — if it ever stops working for a given link, reviewers still get a working "Open image" link, they just lose the inline preview.

## Importing content from Claude

The admin page has an "Import from Claude" section for exactly this: draft with Claude, then bring the result in without retyping it into the form.

1. Click **Copy prompt for Claude** — it copies a ready-made prompt that already lists which calendar dates still need a caption, links the Field Guide and Voice Guide so Claude matches the school's voice, and specifies the exact JSON shape to reply in.
2. Paste that into a Claude conversation (claude.ai, or this same assistant). Claude replies with a JSON code block — one entry per date.
3. Paste Claude's reply into the box on the admin page and click **Preview import**. Each entry is shown as **New** (a date not yet on the calendar), **Will update existing post** (a date that already has content — reviewing this list before confirming is what stops an accidental overwrite), or **Skipped** (missing a title or a malformed date, with the reason shown).
4. Click **Import N posts** to save them all. They show up in "Manage posts" and on the reviewer calendar right away.

The same flow handles revisions — ask Claude to revise a specific date (mention what Courtney or Liz asked to change), paste the reply back in, and it'll show as an update to that existing post rather than a duplicate.

## Daily email digest (for Courtney and Liz)

Every morning, an email can go out to Courtney and Liz summarizing what changed in the last 24 hours and what's coming up in the next 7 days. The content logic is built and ready; **sending is off until you configure an email provider** — until then, it's a safe no-op that just tells you nothing was sent.

**Preview it anytime:** open the admin page and scroll to "Daily email digest" — it shows exactly what the email would say, live, with no side effects. There's also a **Send this now** button to trigger a real send on demand (once configured), for testing or to send an extra rundown outside the daily schedule.

**Turn on sending, via [Resend](https://resend.com) (a free transactional email service):**
1. Sign up at resend.com (free tier: 100 emails/day, 3,000/month — plenty for this).
2. To send to real inboxes like Courtney's and Liz's (not just your own), verify a sending domain under **Domains** in Resend — this means adding a couple of DNS records, so you may need whoever manages the school's website/DNS. (Resend's default `onboarding@resend.dev` sender only delivers to the email address on the Resend account itself, not to arbitrary recipients — fine for testing, not for the real digest.)
3. Create an API key in Resend, then in Vercel → **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` — the key from Resend.
   - `DIGEST_RECIPIENTS` — `courtney@example.org,liz@example.org` (comma-separated, no spaces).
   - `DIGEST_FROM` — e.g. `SWS Content Proofing <proofing@susquehannawaldorf.org>` (must be on the domain you verified in step 2).
   - `SITE_URL` — your calendar's URL (e.g. `https://proofing.susquehannawaldorf.org`), just so the email can link back to it. Optional.
4. Redeploy so the new environment variables take effect.

If your school actually runs its email on Google Workspace/Gmail rather than wanting a separate service like Resend, that's also doable (sending through that existing mailbox instead) — just ask Claude to wire that path in instead; it's a different `api/digest.js` sending step, everything else here stays the same.

**The schedule:** `vercel.json` runs the digest automatically once a day. It's currently set to `0 12 * * *` (12:00 UTC — 8am Eastern during EDT, 7am during EST). To change the time, edit the `schedule` field in `vercel.json` (standard cron syntax, always in UTC) and push. Vercel's free Hobby plan supports one daily cron job, which is exactly what this uses.

**Optional extra protection:** set a `CRON_SECRET` environment variable in Vercel (any random string) — Vercel automatically sends it when triggering the cron job, and `api/digest.js` checks it, so nobody else can trigger a real send just by guessing the URL. The admin page's "Send this now" button doesn't need this; it authenticates with the admin PIN instead.

## Making changes later

Ordinary edits (fixing a typo, adjusting a caption) are easiest through the **admin page** — no code, no git, no redeploy needed, and changes show up on the reviewer calendar within a minute (it re-checks post content every 60 seconds).

If you'd rather edit the starting content directly in code — or you're setting this up fresh — post content lives in `posts.js`, used as the seed for a brand-new deployment and as the fallback both `index.html` and `admin.html` (and the API) use if the database is ever unreachable. Editing `posts.js` after the site has real data in it won't change what reviewers see, though, since the live data by then lives in Vercel KV — use the admin page for anything that should actually take effect. Paste updated files back to Claude any time you want help with a bigger change.

## How the data works

- **`api/approvals.js`** — the decision log. `GET` returns it; `POST` appends one decision (name, verdict, optional comment). No authentication — anyone with the calendar link can read and write it, which is the deliberate trade-off for "no login required" for Courtney and Liz. Don't put anything in the comment box you wouldn't want visible to anyone with the link.
- **`api/posts.js`** — the post content (captions, hashtags, etc). `GET` is open, same as above (reviewers need to read it). `POST` (add/edit a post) requires the admin PIN, checked on the server — this is real enforcement, not just the PIN screen's UX gate.
- **`api/digest.js`** — composes the daily email and, when authorized (Vercel Cron's secret, or the admin PIN), sends it via Resend.
- Everything lives under a few keys in Vercel KV. It's last-write-wins — if two people edit at the exact same moment, the later write stands. For a small review team that's a non-issue.
- The reviewer's chosen name, and Correne's PIN entry, are both remembered per-browser (via `localStorage`) so nobody has to re-enter them every visit.

## Cost

Vercel's free Hobby plan, the free tier of Vercel KV, and Resend's free tier all comfortably cover a small internal tool like this with a handful of reviewers checking in a few times a week and one email a day.
