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

## Making changes later

Edit `index.html` to update the drafted posts (captions, hashtags, photo direction) for September, or to add October's calendar next — everything content-related lives in the `POSTS` object near the top of the `<script>` tag. Push the change to GitHub's `main` branch and Vercel redeploys automatically within a minute or two. You're welcome to paste the updated file back to Claude and ask for the next month's calendar to be added the same way this one was built.

## How the data works

- `api/approvals.js` is a serverless function. `GET` returns the whole approval log; `POST` appends one decision (name, verdict, optional comment) and returns the updated log.
- Everything lives under a single key in Vercel KV. It's last-write-wins — if two people click at the exact same moment, the later write stands. For a two- or three-person review team that's a non-issue.
- There's no authentication on the API. Anyone with the URL can read and write the log — that's the deliberate trade-off for "no login required." Don't put anything in the comment box you wouldn't want visible to anyone with the link.
- The reviewer's chosen name is remembered per-browser (via `localStorage`) so they don't have to re-pick it every visit; it isn't used for anything security-related.

## Cost

Vercel's free Hobby plan and the free tier of Vercel KV both comfortably cover a small internal tool like this with a handful of reviewers checking in a few times a week.
