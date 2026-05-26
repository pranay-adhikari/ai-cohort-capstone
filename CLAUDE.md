# CLAUDE.md

## What this project is
A browser-based study session tracker that lets students start a timer, tag it with a subject, write a quick note, and rate their energy when done. Sessions are saved locally and visualized through a session log, daily goal progress bar, weekly subject bar chart, and a GitHub-style activity heatmap — making study habits visible and honest over time.

## Tech stack
Vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies except Chart.js loaded from CDN. Chosen because the project ships as a single folder you can open in any browser without setup. The UI should look and feel modern — clean typography, smooth transitions, thoughtful spacing, and a design that wouldn't look out of place as a real product.

## Conventions
- Keep functions small and focused — one function does one thing.
- Use `const` and `let`, never `var`.
- All data reads and writes go through two functions: `loadSessions()` and `saveSession()` — nothing else touches localStorage directly.
- CSS uses custom properties (variables) for all colors and spacing.
- Prioritize visual polish: use CSS transitions, hover states, and a cohesive color system.
- File structure stays flat: `index.html`, `app.js`, `styles.css`, nothing else.

## Do not
- Do not add new libraries or CDN scripts without asking first — but asking is fine if a feature genuinely needs it (e.g. a heatmap library, a date utility).
- Do not use frameworks (no React, Vue, etc.).
- Do not use global mutable state — pass data through function arguments.
- Do not modify the data schema in localStorage without migrating existing data.
- Do not add files beyond the three listed above without a good reason.
- Do not sacrifice visual quality for simplicity — if something looks rough, fix it.