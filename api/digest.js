// Composes the daily email digest for Courtney and Liz: what's changed in
// the last 24 hours, and what's coming up in the next 7 days.
//
// This endpoint ALWAYS composes and returns the digest (subject/text/html)
// so it doubles as a live preview -- see it from the admin page any time
// with no side effects. It only actually SENDS when asked to (POST, or
// GET with ?send=1) AND authorized, either by:
//   - Vercel Cron's own request (matches CRON_SECRET, see vercel.json + README)
//   - the admin PIN, passed as { pin } in a POST body or ?pin= query param
//     (used by the "Send now" button on the admin page)
//
// Sending itself goes through Resend (https://resend.com) if RESEND_API_KEY
// is set. If it isn't set yet -- or DIGEST_RECIPIENTS isn't -- nothing is
// sent, but the composed digest still comes back in the response with a
// `note` explaining why, so this is safe to wire up piece by piece.

const { kv } = require('@vercel/kv');
const POSTS_SEED = require('../posts.js');

const POSTS_KEY = 'sws_proofing_posts';
const APPROVALS_KEY = 'sws_proofing_approvals';

const ADMIN_PIN = process.env.ADMIN_PIN || 'sws2026';
const CRON_SECRET = process.env.CRON_SECRET || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const DIGEST_FROM = process.env.DIGEST_FROM || 'SWS Content Proofing <onboarding@resend.dev>';
const SITE_URL = process.env.SITE_URL || '';
const DIGEST_RECIPIENTS = (process.env.DIGEST_RECIPIENTS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function statusLabelFor(post, approvalRecord) {
  if (!post || !post.drafted) return 'not drafted yet';
  const status = (approvalRecord && approvalRecord.status) || 'pending';
  if (status === 'approved') return 'approved';
  if (status === 'changes_requested') return 'changes requested';
  return 'awaiting review';
}

function buildDigest(posts, approvals) {
  const now = new Date();
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekOut = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

  const changes = [];
  Object.keys(approvals).forEach((date) => {
    const activity = (approvals[date] && approvals[date].activity) || [];
    activity.forEach((a) => {
      const at = new Date(a.at);
      if (at >= since && at <= now) {
        changes.push({
          date,
          title: (posts[date] && posts[date].title) || date,
          name: a.name,
          verdict: a.verdict,
          comment: a.comment,
          at: a.at,
        });
      }
    });
  });
  changes.sort((a, b) => new Date(b.at) - new Date(a.at));

  const upcoming = Object.keys(posts)
    .filter((date) => {
      const [y, m, d] = date.split('-').map(Number);
      const dd = new Date(y, m - 1, d);
      return dd >= startOfToday && dd <= weekOut;
    })
    .sort();

  return { changes, upcoming, generatedAt: now.toISOString() };
}

function renderText(posts, approvals, digest) {
  const lines = [];
  lines.push('SWS Content Proofing — Daily rundown');
  lines.push('');
  lines.push('CHANGES IN THE LAST 24 HOURS');
  if (!digest.changes.length) lines.push('  (none)');
  digest.changes.forEach((c) => {
    const verb = c.verdict === 'approved' ? 'approved' : c.verdict === 'revised' ? 'marked revised' : 'requested changes on';
    lines.push('  - ' + c.name + ' ' + verb + ' "' + c.title + '" (' + c.date + ')' + (c.comment ? ': ' + c.comment : ''));
  });
  lines.push('');
  lines.push('COMING UP IN THE NEXT 7 DAYS');
  if (!digest.upcoming.length) lines.push('  (nothing scheduled)');
  digest.upcoming.forEach((date) => {
    const p = posts[date] || {};
    const label = statusLabelFor(p, approvals[date]);
    lines.push('  - ' + fmtDate(date) + ': ' + (p.title || date) + ' — ' + label);
  });
  if (SITE_URL) {
    lines.push('');
    lines.push('Open the calendar: ' + SITE_URL);
  }
  return lines.join('\n');
}

function renderHtml(posts, approvals, digest) {
  const changeRows = digest.changes.length
    ? digest.changes
        .map((c) => {
          const verb = c.verdict === 'approved' ? 'approved' : c.verdict === 'revised' ? 'marked revised' : 'requested changes on';
          return (
            '<li style="margin-bottom:8px;">' +
            '<strong>' + escapeHtml(c.name) + '</strong> ' + verb + ' “' + escapeHtml(c.title) + '” (' + c.date + ')' +
            (c.comment ? ' — <em>' + escapeHtml(c.comment) + '</em>' : '') +
            '</li>'
          );
        })
        .join('')
    : '<li style="color:#726A59;">Nothing in the last 24 hours.</li>';

  const upcomingRows = digest.upcoming.length
    ? digest.upcoming
        .map((date) => {
          const p = posts[date] || {};
          const label = statusLabelFor(p, approvals[date]);
          return (
            '<li style="margin-bottom:8px;"><strong>' + escapeHtml(fmtDate(date)) + '</strong> — ' +
            escapeHtml(p.title || date) + ' <span style="color:#726A59;">(' + label + ')</span></li>'
          );
        })
        .join('')
    : '<li style="color:#726A59;">Nothing scheduled.</li>';

  const linkRow = SITE_URL
    ? '<p style="font-size:12px;color:#726A59;">Open the calendar: <a href="' + SITE_URL + '">' + SITE_URL + '</a></p>'
    : '';

  return (
    '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2A2620;">' +
    '<h2 style="font-family:Georgia,serif;margin-bottom:4px;">SWS Content Proofing</h2>' +
    '<p style="color:#726A59;margin-top:0;">Daily rundown</p>' +
    '<h3 style="margin-bottom:6px;">Changes in the last 24 hours</h3>' +
    '<ul style="padding-left:20px;margin-top:0;">' + changeRows + '</ul>' +
    '<h3 style="margin-bottom:6px;">Coming up in the next 7 days</h3>' +
    '<ul style="padding-left:20px;margin-top:0;">' + upcomingRows + '</ul>' +
    linkRow +
    '</div>'
  );
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  try {
    const posts = (await kv.get(POSTS_KEY)) || POSTS_SEED;
    const approvals = (await kv.get(APPROVALS_KEY)) || {};
    const digest = buildDigest(posts, approvals);
    const subject =
      'SWS Content Proofing — Daily rundown (' +
      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ')';
    const text = renderText(posts, approvals, digest);
    const html = renderHtml(posts, approvals, digest);

    const result = {
      subject,
      text,
      html,
      changeCount: digest.changes.length,
      upcomingCount: digest.upcoming.length,
      recipients: DIGEST_RECIPIENTS,
      sent: false,
    };

    const body = req.body || {};
    const query = req.query || {};
    const wantsSend = req.method === 'POST' || query.send === '1';

    if (wantsSend) {
      const authHeader = req.headers['authorization'] || '';
      const isCron = !!CRON_SECRET && authHeader === 'Bearer ' + CRON_SECRET;
      const pin = body.pin || query.pin || '';
      const isAdmin = !!pin && pin === ADMIN_PIN;

      if (!isCron && !isAdmin) {
        res.status(401).json({ error: 'Not authorized to send the digest.' });
        return;
      }

      if (!DIGEST_RECIPIENTS.length) {
        result.note = 'No DIGEST_RECIPIENTS configured yet — nothing was sent. Set that environment variable in Vercel (see README) to Courtney and Liz’s addresses, comma-separated.';
      } else if (!RESEND_API_KEY) {
        result.note = 'No email provider configured yet — nothing was sent. Set RESEND_API_KEY in Vercel (see README) to turn on sending. Here is what would have gone out.';
      } else {
        const sendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + RESEND_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ from: DIGEST_FROM, to: DIGEST_RECIPIENTS, subject, html, text }),
        });
        if (sendRes.ok) {
          result.sent = true;
        } else {
          const errText = await sendRes.text();
          result.note = 'Resend rejected the send: ' + errText;
        }
      }
    }

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: 'Could not build the digest.' });
  }
};
