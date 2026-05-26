# BUILD_LOG.md

## Task 1 — Scaffold the repo and write CLAUDE.md
- Brief: Create the project folder structure (index.html, app.js, styles.css, CLAUDE.md)
  with a blank but valid starting point before any feature code is written.
- What Claude proposed: A CLAUDE.md covering project purpose, vanilla JS stack, coding
  conventions, and hard restrictions on dependencies and frameworks, with explicit
  permission to ask before adding libraries when a feature needs it.
- What I changed before approving: Added the UI polish expectation ("modern, clean,
  wouldn't look out of place as a real product") and softened the dependency rule from
  "never add libraries" to "ask first — asking is fine."
- Verification: Opened index.html in the browser, confirmed blank page with no console
  errors. Opened CLAUDE.md and confirmed it reads clearly enough to hand to a stranger.
- One thing I learned: Writing CLAUDE.md before any code forces you to make decisions
  you'd otherwise defer, like exactly which files are allowed to exist, which prevents
  scope creep later.

## Task 2 — Build the timer UI
- Brief: Add a start/stop button and live timer display to the page.
- What Claude proposed: DM Mono font for the clock display, purple accent color,
  status label that switches between ready/running/paused, stop button turns red,
  logo text set to "study."
- What I changed before approving: Changed the logo from "study." to "flow." to
  better reflect the focus/deep work angle of the app, as it represents the phenomenon of "flow state." 
- Verification: Clicked start, confirmed timer counts up with no console errors.
  Clicked stop, confirmed it freezes. Reset returns to 00:00:00.
- One thing I learned: Small naming decisions like the logo actually shape how the
  whole app feels. "flow." reads more like a product than "study." does.

## Task 3 — Subject tagging and session notes
- Brief: Add a subject dropdown and notes field that appear when the timer starts.
- What Claude proposed: Animated fade-in panel with a select dropdown, inline
  "add new subject" input that appears on demand, and a textarea for notes.
- What I changed before approving: Changed the dropdown placeholder from
  "Select subject" to "— pick one —", which is a small thing but it reads less like a
  generic HTML form.
- Verification: Ran getSessionMeta() in console after filling both fields,
  confirmed correct values returned. Reset clears everything cleanly.
- One thing I learned: CSS transitions only work on elements that are already rendered, so
  you can't animate display:none to visible, meaning using opacity + pointer-events together
  is the standard workaround for showing/hiding UI smoothly.

## Task 4 — Mood rating and session save
- Brief: Show a 1-5 energy rating prompt when the timer stops; save the
  completed session to localStorage on selection.
- What Claude proposed: Five numbered buttons that highlight on click, auto-save
  the session with all metadata, show a toast confirmation, then auto-reset.
- What I changed before approving: Changed the mood hint text from "Select a
  rating to save" to "Pick a rating to save the session" — reads more natural.
- Verification: Completed a session, opened DevTools localStorage, confirmed the
  object had all six fields with correct values. Refreshed, data persisted.
- One thing I learned: localStorage only stores strings, so JSON.stringify and
  JSON.parse are required on every read and write, as skipping either one silently
  breaks everything in a confusing way.

## Task 5 — Session log list
- Brief: Render all saved sessions below the timer as a scrollable list,
  newest first, persisting across page refreshes.
- What Claude proposed: Card-based list with subject, duration, notes, timestamp,
  and an energy badge styled as "e/4" in a purple pill.
- What I changed before approving: Changed the energy badge from "e/4" to "4/5"
  so it reads as a rating out of 5, not a cryptic label. Also updated the
  timestamp to include the date ("May 25 · 3:42 PM") since time alone is useless
  when you have sessions from multiple days.
- Verification: Logged two sessions, confirmed both appeared instantly. Refreshed
  the page, confirmed both survived. Cleared localStorage in DevTools and confirmed
  the "no sessions yet" empty state showed correctly.
- One thing I learned: Reversing the array with .slice().reverse() before
  rendering is important because .reverse() mutates the original array in place,
  which would silently corrupt the data order if you called it directly on the
  loaded sessions.
  
## Task 6 — Daily goal progress bar
- Brief: A progress bar below the header fills based on today's total study
  time toward a 2-hour daily goal.
- What Claude proposed: A thin 3px track bar with a smooth animated fill,
  labels showing time spent and the goal, turns green when complete.
- What I changed before approving: Changed the bar transition from linear easing
  to cubic (0.4, 0, 0.2, 1). The ease out curve feels more intentional
  than a flat mechanical slide.
- Verification: Completed a session, confirmed the bar animated and the spent
  label updated correctly. Ran getTodayMs() in the console to confirm it
  filters to today only. Checked that the bar caps at 100% and does not overflow.
- One thing I learned: Math.min(100, pct) is a one liner safety net that
  prevents the bar from overflowing its container if someone logs more than
  the goal, which would otherwise break the layout silently.

## Task 7 — Weekly bar chart by subject
- Brief: Render total minutes per subject for the last 7 days as a stacked
  bar chart using Chart.js.
- What Claude proposed: Stacked bar chart with a custom color palette, a
  hand-built HTML legend above the chart, and monospace axis labels to match
  the app's existing type system.
- What I changed before approving: 
- Verification: Logged sessions under two subjects, confirmed both appeared
  as separate colored segments stacked on the correct day. Hovered bars to
  confirm tooltips showed subject name and minutes.
- One thing I learned: Chart.js cannot read CSS variables for colors, so you
  have to hardcode hex values for anything that touches the canvas. Keeping a
  SUBJECT_COLORS array as the single source of truth for both the chart and
  the HTML legend is the cleanest way to keep them in sync.

## Task 7 — Weekly bar chart by subject
- Brief: Render total minutes per subject for the last 7 days as a stacked
  bar chart using Chart.js.
- What Claude proposed: Stacked bar chart with a custom color palette, a
  hand-built HTML legend above the chart, and monospace axis labels to match
  the app's existing type system.
- What I changed before approving: Nothing before approving, but caught a bug
  after: short sessions under a minute were rounding to zero with Math.round(),
  making bars appear equal height regardless of actual duration. Fixed by
  switching to toFixed(2) to preserve decimal minutes.
- Verification: Logged 1 min of Math and 20 sec of History, confirmed bars were
  proportional to actual time rather than equal height. Hovered bars to confirm
  tooltips showed correct decimal values.
- One thing I learned: Chart.js cannot read CSS variables for colors since it
  renders to a canvas element, which sits outside the normal DOM styling system.
  Hardcoding hex values and keeping a single SUBJECT_COLORS array as the source
  of truth for both the chart and the HTML legend is the cleanest way to keep
  them in sync.

