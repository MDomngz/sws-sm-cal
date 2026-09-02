// Serverless API for the proofing calendar's post content -- captions,
// hashtags, photo direction, alt text.
//
// GET is open to anyone with the link, same as the rest of this tool --
// Courtney and Liz's reviewer calendar reads from here.
//
// POST adds or edits a single post (keyed by date) and requires the admin
// PIN. The PIN screen in admin.html is a friendly gate; THIS check is what
// actually protects writes, since this endpoint (unlike api/approvals.js)
// can change what reviewers see, not just log a decision about it.

const { kv } = require('@vercel/kv');
const POSTS_SEED = require('../posts.js');

const KEY = 'sws_proofing_posts';
const ADMIN_PIN = process.env.ADMIN_PIN || 'sws2026';

function isValidDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const data = (await kv.get(KEY)) || POSTS_SEED;
      res.status(200).json(data);
    } catch (e) {
      // Never let a database hiccup take down the reviewer calendar --
      // fall back to the seed content instead of a hard error.
      res.status(200).json(POSTS_SEED);
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};

      if (body.pin !== ADMIN_PIN) {
        res.status(401).json({ error: 'Incorrect admin PIN.' });
        return;
      }

      const date = typeof body.date === 'string' ? body.date : '';
      if (!isValidDate(date)) {
        res.status(400).json({ error: 'date must be YYYY-MM-DD.' });
        return;
      }

      const title = (typeof body.title === 'string' ? body.title : '').trim().slice(0, 200);
      if (!title) {
        res.status(400).json({ error: 'title is required.' });
        return;
      }

      const caption = typeof body.caption === 'string' ? body.caption.trim() : '';
      const hashtags = Array.isArray(body.hashtags)
        ? body.hashtags.map((t) => String(t).trim()).filter(Boolean).slice(0, 30)
        : [];

      const post = {
        title,
        platform: (typeof body.platform === 'string' ? body.platform : '').trim().slice(0, 200),
        caption,
        hashtags,
        visual: (typeof body.visual === 'string' ? body.visual : '').trim().slice(0, 2000),
        alt: (typeof body.alt === 'string' ? body.alt : '').trim().slice(0, 500),
        note: (typeof body.note === 'string' ? body.note : '').trim().slice(0, 500),
        shell: !!body.shell,
        // A post counts as "drafted" (visible as reviewable, not just a
        // placeholder title on the calendar) once it has a caption.
        drafted: !!caption,
      };

      const data = (await kv.get(KEY)) || Object.assign({}, POSTS_SEED);
      data[date] = post;
      await kv.set(KEY, data);
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: 'Could not save that post — please try again.' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed.' });
};
