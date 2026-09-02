// Shared post content for the proofing calendar (index.html) and the
// admin notifications page (admin.html). Keeping this in one file means
// editing a caption or adding a new date only has to happen once.
//
// To add next month's posts: add more "YYYY-MM-DD" entries below, then
// update the LEADING_EMPTY / day-count loop near the top of index.html's
// <script> to match the new month.

var POSTS = {
  "2026-09-09": {
    title: "Welcome Back — first day of school",
    weekday: "Wednesday, September 9",
    platform: "Instagram (auto-crossposts to Facebook + Stories)",
    drafted: true,
    caption: "The backpacks are on, the name tags are up, and the halls are full again.\nWelcome back, Susquehanna Waldorf — we missed you.\nHere's to a year of story, song, and slow mornings.",
    hashtags: ["#SusquehannaWaldorf","#SWS","#WaldorfEducation","#UnhurriedChildhood","#LancasterCountyMoms","#MariettaPA"],
    visual: "Walk-in shots from drop-off — backpacks, first-day excitement, Liz's welcome table at the entry. Candid, warm natural light, no posed smiles (Voice Guide §04).",
    alt: "Children arriving for the first day of school, backpacks on, parents and teachers greeting them at the entrance."
  },
  "2026-09-11": {
    title: "Grade One Rose Ceremony",
    weekday: "Friday, September 11",
    platform: "Instagram (auto-crossposts to Facebook + Stories)",
    drafted: true,
    shell: true,
    caption: "With the start of the school year comes a beautiful Waldorf tradition: the Grade One Rose Ceremony. 🌹\nOur rising 1st graders are led by their Kindergarten teachers across a footbridge, and met on the other side by their new grades teachers — a moment held in real reverence by our school and parent community.\nAs they cross, each is handed a rose by their 8th-grade buddy for the year: a welcome into the grades. [Courtney's day-of detail goes here — a specific moment, a name if cleared.] That same pairing bookends the year — next spring, these 1st graders will hand a rose back to their buddies as they graduate 8th grade.\n⭐ Congratulations to our rising 1st graders!",
    hashtags: ["#SusquehannaWaldorf","#SWSCommunity","#WaldorfEducation","#WaldorfInspired","#HeadHeartHands","#LancasterCountyMoms"],
    visual: "Courtney's day-of photos — the footbridge crossing and the rose handoff between an 8th grader and an incoming 1st grader are traditionally the strongest images.",
    alt: "[Write once photos are in — describe the specific moment shown.]",
    note: "This is a shell: the bracketed lines get filled in once Courtney's day-of photos land (Launch Plan → “Getting ahead”)."
  },
  "2026-09-15": { title: "“Why Waldorf” post", weekday: "Tuesday, September 15", drafted: false },
  "2026-09-18": { title: "Classroom-moment post", weekday: "Friday, September 18", drafted: false },
  "2026-09-22": { title: "Michaelmas teaser (archive)", weekday: "Tuesday, September 22", drafted: false },
  "2026-09-25": { title: "Admissions-priority post", weekday: "Friday, September 25", drafted: false },
  "2026-09-30": { title: "Fresh Michaelmas post", weekday: "Wednesday, September 30", drafted: false }
};
