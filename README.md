# SWS Content Proofing

A no-login proofing calendar for Susquehanna Waldorf School's social media drafts. Anyone with the link opens a September calendar, clicks a day, and approves the post or requests changes — decisions save instantly for everyone.

This is a static page (`index.html`) plus one small serverless function (`api/approvals.js`) that reads and writes a shared list of decisions in a free Vercel KV database. No framework, no build step, no accounts for Courtney or Liz.

## Deploy it (about 10 minutes, no coding)

**1. Put this folder on GitHub.**
- Go to [github.com](https://github.com) and sign in (or create a free account).
- Click **New repository**, name it something like `sws-content-proofing`, keep it Private or Public (either works), and create it.
- On the new repo's page, click **uploading an existing file** and drag in every file from this folder (`index.html`, `package.json`, `.gitignore`, `README.md`, and the `api` folder with `approvals.js` inside it). Commit the upload.

**2. Import it into Vercel.**
- Go to [vercel.com](https://vercel.com) and sign in with your GitHub account (this also connects the two).
- Click **Add New… → Project**, pick the `sws-content-proofing` repo, and click **Deploy**. No settings to change — Vercel detects the static page and the `api` folder automatically.
- When it finishes, you'll get a live URL like `sws-content-proofing.vercel.app`. Opening it now will show the calendar, but Approve / Request Changes won't save yet — that's step 3.

**3. Add the shared database.**
- In your new Vercel project, open the **Storage** tab.
- Click **Create Database**, choose the **KV** option (built on Upstash Redis — the free tier is more than enough for this), give it a name, and create it.
- When it asks which project to connect it to, choose this one. Vercel adds the required settings automatically — you don't need to copy any keys by hand.
- Go to the **Deployments** tab, open the latest deployment's **⋯** menu, and choose **Redeploy** so the app picks up the new database connection.

**4. Share the link.**
- Open your `.vercel.app` URL (or set up a custom domain in Vercel's **Domains** tab if you'd rather send Courtney and Liz something like `proofing.susquehannawaldorf.org`).
- That's it — send them the link. No invite, no account, no password.

## Admin notifications (for Correne)

`admin.html` is a second page, not linked from the reviewer calendar, that shows Correne everything Courtney and Liz have approved or flagged — newest first, with a "since your last visit" banner at the top so she doesn't have to reread the whole log each time.

- Share the direct link with her (e.g. `your-site.vercel.app/admin.html`) — it's deliberately not linked from `index.html`, so reviewers won't stumble onto it.
- She "logs in" with a short PIN (defaults to `sws2026` — **change this before sharing the link**, see below). This is a light deterrent, not real security: the page reads from the same unauthenticated API as the calendar, same trade-off described below. It just keeps the admin view from being one click away from the reviewer link.
- Once she's in, her browser remembers both the PIN and "the last time she checked." Each visit, anything logged since then is called out at the top and tagged **New** in the full activity list below. That tracking lives in her browser only (`localStorage`) — it's not emailed or texted anywhere, so if she checks from a different device or clears her browser data, it starts over.
- Every item links to **Open in calendar →**, which jumps straight to that day's dialog on the main page.

**To change the PIN:** open `admin.html`, find the line `var ADMIN_PIN = 'sws2026';` near the top of the `<script>` tag, change the value, and push the change (see below).

## Making changes later

Post content (captions, hashtags, photo direction) now lives in one shared file, `posts.js`, used by both `index.html` and `admin.html` — edit it there so the two pages never drift apart. To add October's calendar, add more `"YYYY-MM-DD"` entries to the `POSTS` object in `posts.js`, then update the day-count loop near the top of `index.html`'s `<script>` tag to match the new month. Push the change to GitHub's `main` branch and Vercel redeploys automatically within a minute or two. You're welcome to paste the updated files back to Claude and ask for the next month's calendar to be added the same way this one was built.

## How the data works

- `api/approvals.js` is a serverless function. `GET` returns the whole approval log; `POST` appends one decision (name, verdict, optional comment) and returns the updated log.
- Everything lives under a single key in Vercel KV. It's last-write-wins — if two people click at the exact same moment, the later write stands. For a two- or three-person review team that's a non-issue.
- There's no authentication on the API. Anyone with the URL can read and write the log — that's the deliberate trade-off for "no login required." Don't put anything in the comment box you wouldn't want visible to anyone with the link.
- The reviewer's chosen name is remembered per-browser (via `localStorage`) so they don't have to re-pick it every visit; it isn't used for anything security-related.

## Cost

Vercel's free Hobby plan and the free tier of Vercel KV both comfortably cover a small internal tool like this with a handful of reviewers checking in a few times a week.
