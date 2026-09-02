// Serverless API for the proofing calendar's shared approval log.
// Storage: a single Vercel KV key holding { "<date>": { status, activity: [...] } }.
// No accounts, no cookies, no sessions — anyone who can reach this URL can
// read the log and post a decision. That's the intended trade-off for a
// no-login proofing tool; don't put anything sensitive in the comments.

const { kv } = require('@vercel/kv');

const KEY = 'sws_proofing_approvals';
const VALID_VERDICTS = new Set(['approved', 'changes_requested', 'revised']);

module.exports = async (req, res) => {
  // Same-origin in production; permissive CORS just makes local testing
  // (opening index.html directly, or a preview deployment) painless.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const data = (await kv.get(KEY)) || {};
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: 'Could not load the approval log.' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const date = typeof body.date === 'string' ? body.date : '';
      const verdict = typeof body.verdict === 'string' ? body.verdict : '';
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, 60) : '';
      const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, 500) : '';

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({ error: 'date must be YYYY-MM-DD.' });
        return;
      }
      if (!VALID_VERDICTS.has(verdict)) {
        res.status(400).json({ error: 'verdict must be approved, changes_requested, or revised.' });
        return;
      }
      if (!name) {
        res.status(400).json({ error: 'name is required.' });
        return;
      }

      const data = (await kv.get(KEY)) || {};
      const record = data[date] && Array.isArray(data[date].activity)
        ? data[date]
        : { status: 'pending', activity: [] };

      record.activity = record.activity.concat([{
        name,
        verdict,
        comment,
        at: new Date().toISOString(),
      }]);
      record.status =
        verdict === 'approved' ? 'approved' :
        verdict === 'changes_requested' ? 'changes_requested' :
        'pending';

      data[date] = record;
      await kv.set(KEY, data);
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: 'Could not save that decision — please try again.' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed.' });
};
