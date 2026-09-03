// Serverless API for the proofing calendar's lightweight context markers --
// school events, capture days, admin/outreach days, and light-engagement
// days. Read-only for now: GET is open, same as api/posts.js, so the
// reviewer calendar can show them. There's no POST because there's no
// admin UI for editing these yet -- see markers.js for how to add or
// change them (edit the seed, redeploy).

const { kv } = require('@vercel/kv');
const MARKERS_SEED = require('../markers.js');

const KEY = 'sws_proofing_markers';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const data = (await kv.get(KEY)) || MARKERS_SEED;
      res.status(200).json(data);
    } catch (e) {
      // Same fallback pattern as api/posts.js -- never let a KV hiccup
      // blank out the calendar's context tags.
      res.status(200).json(MARKERS_SEED);
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed.' });
};
