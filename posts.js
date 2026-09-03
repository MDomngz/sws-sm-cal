// Starting content for the proofing calendar. This is only the SEED --
// once the app is deployed, the live content lives in Vercel KV (edited
// through the admin page) and this file is just what a brand-new
// deployment starts from and what api/posts.js falls back to if the
// database is ever unreachable.
//
// Used two ways:
//   - in the browser, as a plain global (POSTS_SEED) loaded via <script src="posts.js">
//   - in Node (api/posts.js, api/digest.js), via require('../posts.js')
//
// Weekday is computed from the date key at render time, not stored here.

var POSTS_SEED = {
  "2026-09-09": {
    title: "Welcome Back — first day of school",
    platform: "Instagram (auto-crossposts to Facebook + Stories)",
    drafted: true,
    caption: "The backpacks are on, the name tags are up, and the halls are full again.\nWelcome back, Susquehanna Waldorf — we missed you.\nHere's to a year of story, song, and slow mornings.",
    hashtags: ["#SusquehannaWaldorf","#SWS","#WaldorfEducation","#UnhurriedChildhood","#LancasterCountyMoms","#MariettaPA"],
    visual: "Walk-in shots from drop-off — backpacks, first-day excitement, Liz's welcome table at the entry. Candid, warm natural light, no posed smiles (Voice Guide §04).",
    alt: "Children arriving for the first day of school, backpacks on, parents and teachers greeting them at the entrance."
  },
  "2026-09-11": {
    title: "Grade One Rose Ceremony",
    platform: "Instagram (auto-crossposts to Facebook + Stories)",
    drafted: true,
    shell: true,
    caption: "With the start of the school year comes a beautiful Waldorf tradition: the Grade One Rose Ceremony. 🌹\nOur rising 1st graders are led by their Kindergarten teachers across a footbridge, and met on the other side by their new grades teachers — a moment held in real reverence by our school and parent community.\nAs they cross, each is handed a rose by their 8th-grade buddy for the year: a welcome into the grades. [Courtney's day-of detail goes here — a specific moment, a name if cleared.] That same pairing bookends the year — next spring, these 1st graders will hand a rose back to their buddies as they graduate 8th grade.\n⭐ Congratulations to our rising 1st graders!",
    hashtags: ["#SusquehannaWaldorf","#SWSCommunity","#WaldorfEducation","#WaldorfInspired","#HeadHeartHands","#LancasterCountyMoms"],
    visual: "Courtney's day-of photos — the footbridge crossing and the rose handoff between an 8th grader and an incoming 1st grader are traditionally the strongest images.",
    alt: "[Write once photos are in — describe the specific moment shown.]",
    note: "This is a shell: the bracketed lines get filled in once Courtney's day-of photos land (Launch Plan → “Getting ahead”)."
  },
  "2026-09-23": {
    title: "“Why Waldorf” — knitting before reading",
    platform: "Instagram (auto-crossposts to Facebook + Stories)",
    drafted: true,
    caption: "Why do Waldorf children learn to knit before they learn to read?\nIt isn’t a detour from academics — it’s preparation for them. Small, steady hands build the same focus, patience, and follow-through a child will need later for letters and long division.\nCome see what handwork looks like here.",
    hashtags: ["#SusquehannaWaldorf","#WaldorfEducation","#HeadHeartHands","#UnhurriedChildhood","#LancasterCountyMoms","#MariettaPA"],
    visual: "A child's hands mid-stitch, close and warm-lit, unposed — any available or archive handwork photo works, doesn't need to be new. Favor phone over camera, hands-only or over-the-shoulder angle.",
    alt: "A child's hands holding knitting needles and yarn, mid-stitch, in a warm classroom."
  },
  "2026-09-18": {
    title: "Classroom moment — from the Sept 16 visit",
    platform: "Instagram (auto-crossposts to Facebook + Stories)",
    drafted: true,
    shell: true,
    caption: "[Specific detail from the September 16 classroom visit goes here — a song, a verse, what the children were doing.]\nNothing rehearsed. Just the rhythm of an ordinary morning, and children who know exactly where they belong in it.\nThis is what a Tuesday looks like here.",
    hashtags: ["#SusquehannaWaldorf","#WaldorfEducation","#UnhurriedChildhood","#PlayBasedLearning","#LancasterCountyMoms","#MariettaPA"],
    visual: "Circle-time or handwork clip from the September 16 classroom visit — favor video, phone over camera, from-behind or hands-only angle to keep it candid. A simple, single clip outperforms an elaborate edit (Cait's top post, ~206K views, was exactly this kind of clip).",
    alt: "[Write once footage is in — describe the specific classroom moment shown.]",
    note: "This is a shell: fill in the bracketed opening line with the real detail from the Sept 16 visit, then remove the brackets."
  },
  "2026-09-22": {
    title: "Michaelmas teaser (archive)",
    platform: "Instagram (auto-crossposts to Facebook + Stories)",
    drafted: true,
    shell: true,
    caption: "Michaelmas is coming — the festival of courage, right as the season turns.\n[Archive photo detail goes here — a moment from a past year's celebration.]\nThe real thing lands next week.",
    hashtags: ["#SusquehannaWaldorf","#SWSCommunity","#Michaelmas","#WaldorfEducation","#HeadHeartHands","#LancasterCountyMoms"],
    visual: "A strong ARCHIVE photo or clip from a previous year's Michaelmas — courage/harvest imagery (procession, banners, community gathering), per the plan to tease with prior-year footage.",
    alt: "[Write once the archive image is chosen — describe the specific moment shown.]",
    note: "This is a shell using archive footage on purpose — keep it feeling-forward and anticipatory; save real specifics for the Sept 30 recap once this year's Michaelmas (Sept 29) actually happens."
  },
  "2026-09-25": {
    title: "Admissions priority — confirm with Liz",
    platform: "Instagram (auto-crossposts to Facebook + Stories)",
    drafted: true,
    shell: true,
    caption: "[Confirm with Liz: which program is this month's flagged enrollment priority — Stepping Stones, mixed-age kindergarten, or parent-child?]\nA morning here looks like [specific, concrete detail once the program is confirmed] — not a lesson plan, a childhood.\nCome see a morning for yourself. Link in bio to visit.",
    hashtags: ["#SusquehannaWaldorf","#SWS","#WaldorfEducation","#UnhurriedChildhood","#LancasterCountyMoms","#MariettaPA"],
    visual: "Candid photo of the flagged program in session — warm natural light, real children's faces if cleared, unposed. Should let a parent who hasn't chosen yet picture their own child in the room.",
    alt: "[Write once the specific program and photo are confirmed.]",
    note: "This is a shell — check with Liz for the current flagged priority before writing the specific line, then remove the brackets. Keep the CTA soft, never urgent."
  },
  "2026-09-30": {
    title: "Michaelmas — the real thing",
    platform: "Instagram (auto-crossposts to Facebook + Stories)",
    drafted: true,
    shell: true,
    caption: "Michaelmas came to Susquehanna Waldorf yesterday.\n[Specific detail from the actual celebration goes here — a moment, a name if cleared, what the children did.]\nThis is the kind of morning a whole year of childhood gets built around.",
    hashtags: ["#SusquehannaWaldorf","#SWSCommunity","#Michaelmas","#WaldorfEducation","#HeadHeartHands","#LancasterCountyMoms"],
    visual: "Fresh photo/video from the actual Sept 29 Michaelmas celebration — split photo/video coverage. A single strong image or simple clip will outperform an elaborate edit.",
    alt: "[Write once footage is in — describe the specific moment shown.]",
    note: "This is a shell — write the specific line once Sept 29's footage is in. Keep it distinct from the Sept 22 teaser (that one was anticipation/archive; this one is the real thing, fresh) — don't post before Sept 30, a week after the teaser, per the no-stacking rule."
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = POSTS_SEED;
}
