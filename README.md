# Parthiv Paul — Portfolio

A personal portfolio for Parthiv Paul, CS Specialist at the University of Toronto, built as a single-page React application with enough interactive surface to serve as a project demonstration in its own right.

[![Live Site](https://img.shields.io/badge/Live%20Site-parthivpaul.me-E2A04E?style=flat-square)](https://www.parthivpaul.me/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## What It Is

Hiring managers rarely have time before forming a first impression. This portfolio compresses identity, technical depth, and personality into a single scrollable page, but replaces the typical static card layout with components that demonstrate engineering judgment in their own right: a physics-based custom cursor built on Canvas 2D, a text adventure engine that maps portfolio sections to explorable rooms, a live GitHub contribution graph that auto-selects the period of highest activity density, and a fully sandboxed demo of a Chrome extension running against a live AI backend.

The site has no server-side component. Every interactive element runs in the browser; three external APIs are called at runtime for live data.

---

## Live Site

Visit: **[https://www.parthivpaul.me/](https://www.parthivpaul.me/)**

---

## Features

- **Canvas cursor trail** — replaces the native cursor on hover-capable devices with a Canvas 2D particle trail running at 60 fps via `requestAnimationFrame`. Three states (default, hover, click) animate with lerp-interpolated radii. A 500 ms debounced `mouseleave` handler prevents Framer Motion DOM mutations from spuriously hiding the cursor mid-animation. When the Gist demo modal opens, a `data-demo-open` attribute on `document.body` signals the render loop to clear the canvas and restore the native cursor.

- **Live GitHub contribution graph** — fetches 365 days of contribution data from `github-contributions-api.deno.dev`, flattens the 2D week/day matrix, then runs `findBestRange` to auto-select whichever 30d/90d/1y window has the highest contribution-per-day density. Supports hover tooltips, animated range switching with `AnimatePresence`, and 5-level intensity scaling relative to the period's maximum count.

- **"Currently working on" hero line** — the `useLatestRepo` hook hits the GitHub REST API on mount, filters out forks, and renders the most recently pushed repository as a linked name inside the hero section. No manual updates required when new work ships.

- **Text adventure engine** — typing `explore` in the terminal launches a pure-JS adventure (`adventureEngine.js`) with 6 rooms (Lobby, Workshop, Library, Forge, Tavern, Tower), each mapping to a real portfolio section. Commands include `look`, `go`, `interact`, `take`, `inventory`, `map`, `help`, and `exit`. Collecting all 5 artifacts unlocks a congratulations screen with the code `HIRE_ME_2026`.

- **Gist interactive demo** — the Gist project card opens a full-screen modal hosting a sandboxed Chrome extension simulation. Visitors select text in a sample article, click "Gist it!", and receive a streamed Gemini AI explanation via SSE through the FastAPI backend at `gist-vc8m.onrender.com`. Supports multi-turn follow-up chat, area capture (drag a rectangle over content), AutoGist (scroll-triggered passive extraction on a 2 s debounce), a Synapse knowledge graph view, and a spaced-repetition Recall queue.

- **Scroll-driven timeline** — the experience/education timeline uses Framer Motion's `useScroll` + `useTransform` to animate an accent-colored line that draws itself downward as the section scrolls into view. Cards reveal with `clipPath` transitions expanding outward from each timeline node.

- **Terminal contact section** — a functional terminal emulator with command history (arrow key navigation), a typewriter boot sequence triggered once on scroll entry via `useInView`, and clickable quick-action buttons below the terminal. Standard commands expose contact links and programmatically trigger a resume download.

- **Technology filter** — the projects section derives a deduplicated tag list from all project entries and renders animated filter pills. Selecting a tag highlights matching tech stacks inline while filtering the project list with staggered Framer Motion transitions.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| UI framework | React 19 | Concurrent rendering and the hooks API; no SSR, routing, or API routes needed, so Next.js overhead is unwarranted |
| Build tool | Vite 7 | Sub-300 ms HMR in dev via native ES modules; lean production bundle with no framework runtime |
| Animation | Framer Motion 12 | `useScroll`/`useTransform` for scroll-tied transforms; `AnimatePresence` for unmount transitions; `layoutId` for shared-element filter pill animations |
| Styling | Tailwind CSS 4 | CSS-first `@theme` block replaces the JS config; semantic color tokens (`accent`, `surface`, `text-dim`) applied as utility classes throughout |
| Canvas cursor | Custom (Canvas 2D + RAF) | No library; direct render loop gives full control over particle lifetime (400 ms), ripple physics, and state-aware ring animation without dependency overhead |
| Icons | react-icons 5 + lucide-react | `react-icons` covers the Si* tech-stack SVGs; `lucide-react` covers UI chrome at a consistent 1.75 stroke weight |
| GitHub data | REST (unauthenticated) | Public profile endpoints sufficient for repos and the contributions proxy; no server-side secret required |
| Gist demo backend | FastAPI + Gemini AI | Separate service; the portfolio consumes `/api/v1/simplify` (SSE) and `/library` (save + fetch); all AI logic lives server-side |
| Type definitions | JSX (no TypeScript) | Current choice; see Known Limitations |

---

## Architecture

Single-page application with no client-side routing and no server-side component. All sections render in fixed scroll order from one `App.jsx` root.

```
Browser (Vite SPA)
  │
  ├── api.github.com                    → hero "currently working on" (useLatestRepo)
  ├── github-contributions-api.deno.dev → 365-day contribution matrix (GitHubGraph)
  └── gist-vc8m.onrender.com            → Gist demo SSE stream + library save/fetch
```

`CursorTrail` mounts once at the application root and communicates with the Gist demo via a `data-demo-open` attribute on `document.body` rather than a prop or context — the canvas toggle requires no React re-render.

`adventureEngine.js` is a pure-function module with zero React imports. `processCommand(state, input)` clones state immutably and returns a new state object plus a typed output-line array. This makes the game logic independently testable without mounting any component.

The Gist demo (`src/components/GistDemo/`) is a self-contained feature bundle: an orchestrator (`index.jsx`) manages a five-state machine (`IDLE`, `LOADING`, `STREAMING`, `DONE`, `ERROR`), coordinates SSE reads via the `ReadableStream` API, and passes data down to stateless view components.

---

## How It Works

**Page load:** Vite serves the compiled bundle. `Hero` immediately calls `useLatestRepo`, which fetches `api.github.com/users/parthiv-2006/repos?sort=pushed&per_page=5`, skips forks, and renders the first result. In parallel, `GitHubGraph` fetches the full 365-day matrix from the contributions proxy, then calls `findBestRange`, which computes contribution density (`total / days`) for each of the three ranges and returns the index of the highest.

**Scroll behavior:** `useActiveSection` runs an `IntersectionObserver` across all section elements; the active section id drives both the Navbar underline and the `ScrollProgress` bar. The Timeline registers its container with Framer Motion's `useScroll`, mapping the `[0, 1]` scroll progress to `scaleY` on the amber line via `useTransform`.

**Terminal and adventure:** On scroll entry, `useInView` fires once and starts a 25 ms interval that types the welcome string character by character. On `explore`, `createGameState()` returns a plain initial state object; each subsequent command passes through `processCommand`, which returns a new state plus display lines that the terminal component appends to its `lines` array. No persistence; all state lives in React's local state.

**Gist demo flow:** Clicking the Gist card triggers `AnimatePresence` to mount the full-screen modal. `GistDemoWrapper` pings `${BACKEND}/library` on mount to wake the Render free-tier dyno. A `selectionchange` listener inside the sandboxed article tracks the selection's `getBoundingClientRect()` relative to the viewport container div. "Gist it!" posts `{ selected_text, complexity_level, page_context }` to `/api/v1/simplify`, then reads the `ReadableStream` response body line-by-line, splitting on `\n`, parsing `data:` prefixed JSON payloads, accumulating `chunk` fields into a `full` string, and calling `setPopoverStreamText(full)` on each token. The `[DONE]` sentinel closes the loop. Follow-up messages pass the complete `messages` array with an empty `selected_text` field, signaling the backend to treat the request as a conversation continuation.

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
git clone https://github.com/parthiv-2006/portfolio.git
cd portfolio
npm install
```

### Running Locally

```bash
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

### Configuration

No environment variables are required to run the portfolio. The Gist demo reads one optional key from `localStorage`:

| Key | Description |
|-----|-------------|
| `gist_demo_api_key` | Optional Gemini API key for the Gist demo; if absent, the backend uses its own key |
| `gist_demo_theme` | Persisted theme preference for the Gist demo (`dark`, `light`, `system`) |
| `gist_demo_autoGist` | Persisted AutoGist toggle state (`"true"` or `"false"`) |

---

## Project Structure

```
portfolio/
├── public/
│   ├── headshot.png                 ← headshot used in About section
│   ├── newresume.pdf                ← resume served for direct download
│   └── projects/                   ← project preview images (anima, macromatch, uofthacks)
├── src/
│   ├── main.jsx                     ← React root, mounts App into #root
│   ├── index.css                    ← Tailwind v4 @theme tokens + global base styles
│   ├── App.jsx                      ← top-level layout: sections in scroll order, footer
│   ├── adventureEngine.js           ← pure-function text adventure (no React dependency)
│   ├── hooks/
│   │   ├── useActiveSection.js      ← IntersectionObserver-based active section tracker
│   │   └── useLatestRepo.js         ← fetches most recently pushed non-fork repo
│   └── components/
│       ├── Hero.jsx                 ← animated name, time-of-day greeting, latest repo line
│       ├── About.jsx                ← headshot, bio paragraphs, fun facts, GitHubGraph
│       ├── SkillsGrid.jsx           ← 4-category skill cards, core vs secondary distinction
│       ├── Projects.jsx             ← filterable project list, modals, Gist demo entry point
│       ├── Timeline.jsx             ← scroll-driven experience and education timeline
│       ├── Terminal.jsx             ← terminal emulator + adventure mode shell
│       ├── Navbar.jsx               ← sticky nav with active section highlight
│       ├── GitHubGraph.jsx          ← live contribution heatmap with 30d/90d/1y toggle
│       ├── CursorTrail.jsx          ← Canvas 2D cursor (particles, comet tail, ripple, ring)
│       ├── ScrollProgress.jsx       ← scroll position indicator
│       ├── SectionDivider.jsx       ← section separators (line, code, dots variants)
│       ├── SectionHeading.jsx       ← consistent label + title component
│       └── GistDemo/
│           ├── index.jsx            ← orchestrator: selection, SSE fetch, 5-state machine
│           ├── GistDashboard.jsx    ← 5-tab dashboard (Overview, Library, Synapse, Recall, Settings)
│           ├── GistFloatingPopover.jsx  ← anchored explanation popover with chat input
│           ├── GistSynapseView.jsx  ← knowledge graph visualization
│           ├── GistRecallView.jsx   ← spaced-repetition review queue
│           ├── GistLibraryView.jsx  ← searchable saved gists list
│           ├── GistHomeView.jsx     ← overview with streak and recall due badge
│           ├── GistSettingsView.jsx ← theme, API key, AutoGist settings
│           ├── GistCaptureOverlay.jsx   ← drag-to-select area capture overlay
│           ├── GistPopup.jsx        ← extension toolbar popup
│           ├── GistAutoGistWidget.jsx   ← scroll-triggered ambient takeaway widget
│           ├── GistCard.jsx         ← library item card
│           └── gist-tokens.css      ← scoped CSS design tokens for the Gist demo
└── package.json
```

---

## Known Limitations

- **No TypeScript** — the codebase is JSX throughout. The Gist demo state machine (`IDLE | LOADING | STREAMING | DONE | ERROR`) and the adventure engine's `Room` and `GameState` shapes span multiple files with no type contracts; prop interface mismatches surface only at runtime.
- **Gist backend cold-starts on Render's free tier** — the FastAPI server hibernates after 15 minutes of inactivity. The portfolio pings `/library` on demo mount, but the first "Gist it!" request can still take 10-20 seconds if the dyno has not finished starting.
- **GitHub API rate limit without authentication** — both `useLatestRepo` and `GitHubGraph` make unauthenticated requests. Visitors sharing an IP (corporate NAT, university networks) can exhaust GitHub's 60 requests/hour unauthenticated limit, causing both components to silently fail with no user-facing error state.
- **Canvas cursor is desktop-only** — the trail skips rendering on touch-primary devices (`hover: none` media query) and when `prefers-reduced-motion` is set. Those visitors see the default browser cursor with no alternative personality.
- **Adventure game state is not persisted** — closing the terminal or refreshing resets all collected artifacts and visited rooms. The state shape (`currentRoom`, `inventory`, `visited`, `itemsFound`) is already `JSON.stringify`-friendly with a `Set`-to-`Array` conversion; a `localStorage` checkpoint would cost under 20 lines.
- **Framer Motion loads eagerly** — the library is not code-split. On a cold 3G connection, the `framer-motion` bundle (roughly 150 KB parsed) blocks interactivity for sections visible immediately on load.

---

## What I Would Build Next

1. **TypeScript migration** — convert all `src/` files to `.tsx`/`.ts`. The Gist demo state machine and the adventure engine's `Room`/`GameState` types are the highest-priority candidates; their implicit shapes already span 10+ files and are the most likely source of silent runtime bugs as the project grows.

2. **Lazy-load the Gist demo bundle** — `GistDashboard`, `GistSynapseView`, and related modules add significant parse weight but are never needed until a visitor opens the project card. A `React.lazy()` boundary on `GistDemoWrapper` defers that cost entirely and trims the initial bundle by an estimated 40-60 KB.

3. **Adventure game persistence** — serializing `gameState` to `localStorage` on each command lets returning visitors continue where they left off. The implementation is straightforward because `processCommand` already returns plain-object state; the only conversion needed is `Set` to `Array` for `visited`.

4. **Accessibility pass on the terminal and cursor** — `cursor: none !important` strips all native focus indicators for keyboard-only navigation. Every interactive element needs an explicit `focus-visible` outline, and the terminal output area needs an `aria-live="polite"` region so screen readers can announce output lines as they appear.

5. **Wire in project preview images** — `public/projects/` already contains preview images for Anima, MacroMatch, and UofTHacks. Rendering them as lazy-loaded thumbnails inside each project card would break up the text density in the projects section and give each entry a distinct visual identity.

---

## License

MIT
