// Lightweight, read-only calendar context -- capture days, school events,
// teacher/admin outreach, and light-engagement days pulled from the
// production schedule (Field Guide / monthly Launch Plan). Shown as small
// muted tags on the reviewer calendar alongside the posts, so Courtney and
// Liz can see why the posting rhythm looks the way it does that week --
// these aren't things they approve, just context.
//
// Unlike posts.js, there's no admin UI for these yet -- they're populated
// by editing this file (or the /api/markers seed) and redeploying. If
// Correne ends up wanting to add/edit these herself without a code push,
// that's a straightforward follow-up (mirror posts.js's KV + admin-form
// pattern).
//
// Same dual-mode pattern as posts.js / drive.js:
//   - browser global (MARKERS_SEED) via <script src="markers.js">
//   - Node, via require('../markers.js') in api/markers.js
//
// Each date maps to an array of { kind, label }. kind is one of:
//   "event"   -- a school event (Rose Ceremony, Michaelmas, first day)
//   "capture" -- a photo/video capture day
//   "admin"   -- outreach, drafting, prep, check-ins
//   "engage"  -- light social engagement (replies, Story shares)

var MARKERS_SEED = {
  "2026-09-08": [
    { kind: "event", label: "First day of school" },
    { kind: "capture", label: "Walk-ins, backpacks, drop-off" },
    { kind: "admin", label: "Draft & submit that afternoon" }
  ],
  "2026-09-09": [
    { kind: "event", label: "Rose Ceremony (Cait shoots, Courtney captures social)" }
  ],
  "2026-09-10": [
    { kind: "admin", label: "Teacher intro email sent" },
    { kind: "admin", label: "Rose Ceremony caption drafted & submitted" }
  ],
  "2026-09-12": [
    { kind: "engage", label: "Engage: replies, Story shares" }
  ],
  "2026-09-14": [
    { kind: "capture", label: "Read the bulletin / Heartbeat" },
    { kind: "admin", label: "Log first teacher replies" }
  ],
  "2026-09-16": [
    { kind: "capture", label: "First classroom visit" }
  ],
  "2026-09-17": [
    { kind: "admin", label: "Draft & submit that caption" }
  ],
  "2026-09-19": [
    { kind: "engage", label: "Engage: replies, Story shares" }
  ],
  "2026-09-21": [
    { kind: "capture", label: "Calendar-photo wander" },
    { kind: "capture", label: "Pull archive footage for Michaelmas" }
  ],
  "2026-09-23": [
    { kind: "capture", label: "Second classroom visit" },
    { kind: "admin", label: "Bi-weekly teacher check-in" }
  ],
  "2026-09-24": [
    { kind: "admin", label: "Draft caption; check Liz's priority flag" }
  ],
  "2026-09-26": [
    { kind: "engage", label: "Engage: replies, Story shares" }
  ],
  "2026-09-28": [
    { kind: "admin", label: "Confirm Michaelmas photo/video split" },
    { kind: "admin", label: "Pre-approve a caption where possible" }
  ],
  "2026-09-29": [
    { kind: "event", label: "Michaelmas" },
    { kind: "capture", label: "Split photo/video coverage" }
  ],
  "2026-09-30": [
    { kind: "admin", label: "First monthly report due Oct 1" }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MARKERS_SEED;
}
