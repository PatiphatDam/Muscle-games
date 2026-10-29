# Muscle Games — adding the games to the main site (React)

A module of 3 games (Balloon Pop · Group Sort · Diameter) for the *Muscular Tissues I* lecture.
Built with React + HTML5 + CSS3; responsive on phones (≥360px), tablets and desktops.

Everything lives in one folder: **`src/muscle-games/`**

---

## 1. What the main site needs

| Package | Version |
|---|---|
| `react`, `react-dom` | 18 or later |
| `react-router-dom` | 6.7 or later (uses nested `<Routes>`) |

Works in both **Vite** and **Create React App** projects. No other libraries are needed.

```bash
npm install react-router-dom@6
```

## 2. Install (3 steps)

**① Copy the folder** `src/muscle-games/` into the main site's `src/`.

**② Add a route** in the file that holds the main site's `<Routes>` (the path must end in `/*`).

```jsx
import { MuscleGames } from './muscle-games';

<Routes>
  {/* ...the site's existing routes... */}
  <Route path="/games/*" element={<MuscleGames onGameFinish={saveRun} />} />
</Routes>
```

**③ Add a menu link**, e.g. `<Link to="/games">Games</Link>`. That's it.

> All links inside the games are relative, so you can mount them at `/learning/muscle/games/*` without changing any game code.
> The games use the main site's router — don't wrap them in another `<BrowserRouter>`.

Resulting URLs:

| URL | Page |
|---|---|
| `/games` | Games hub (game cards) |
| `/games/balloon-pop` | Balloon Pop (OL1) |
| `/games/group-sort` | Group Sort (OL2) |
| `/games/diameter` | Diameter (OL3) |

## 3. Props

| Prop | Type | Meaning |
|---|---|---|
| `onGameFinish` | `(run) => void \| Promise` | Called every time a run ends; use it to save the score to the database (GAME-7) |
| `className` | `string` | Extra class on the `.mg-root` wrapper |

The `run` object:

```js
{
  runId: '3f0c…',                // id of this play-through; may be sent again (e.g. Diameter resumed after leaving), so upsert by runId
  gameId: 'group-sort',          // 'balloon-pop' | 'group-sort' | 'diameter'
  mode: 'memory',                // group-sort only: 'memory' | 'conveyor'; null for the other games
  scoreKey: 'group-sort:memory',
  score: 413,
  stars: 3,                      // 0–3
  completed: true,               // false = the player left (← Games / ↻) before the end with some progress (Diameter); the score so far is saved
  isNewBest: true,               // best in this browser session?
  achievements: ['mem_fast', 'stars3'],
  newAchievements: ['stars3'],
  mistakes: [{ prompt, yours, answer, why }],   // missed questions (useful for learning analytics)
  summary: '18/18 pairs · 0 wrong · time bonus +170',
  finishedAt: '2026-10-17T09:30:00.000Z'
}
```

Example: saving to an API

```jsx
async function saveRun(run) {
  await fetch('/api/game-runs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(run),
  });
}
```

If `onGameFinish` throws (or returns a rejected Promise) the game keeps working; the error is logged to the console.

## 4. Keeping CSS separate from the main site

- Every class starts with `mg-` and every CSS rule is scoped under `.mg-root`.
- No rules touch the main site's `body`, `html`, `h1` or `button`.
- The module loads **no fonts itself** — the host provides them, using the main site's own fonts: **Nunito Sans** (text), **Playfair Display** (headings), **Inter** (fallback), and for the cover titles **Cinzel Decorative** (Balloon Pop) and **Bungee** (Conveyor Sort). All are self-hosted `@fontsource` packages: the standalone pages import `src/fonts.css`; the main site already loads Inter, Nunito Sans and Playfair in `index.css` and imports the two cover fonts in `MuscleGamesPage.tsx`. Never `@import` Google Fonts inside the module — the main site's Content Security Policy blocks them and the lazy-loaded games CSS then fails ("Unable to preload CSS"). Missing families fall back to system fonts.
- The demo app (`src/demo-host.css`) adds deliberately clashing styles (a red upper-case `h1`, an orange `.btn`) and they don't leak into the games.
- Dark mode follows the device setting, or the host's `<html data-theme="light|dark">`.

Change the theme colours by overriding the CSS variables on `.mg-root`, for example:

```css
.mg-root { --sea-600: #0e7490; --sea-700: #155e75; }
```

## 5. Editing content / questions

| Game | File |
|---|---|
| Balloon Pop — clues and choices | `games/BalloonPop.jsx` (`CLUES`, `PROPERTIES`, `FUNCTIONS`) |
| Group Sort — conveyor cards / picture pairs | `games/sort/data.js` |
| Diameter — all 6 stages | `games/diameter/levels.js` |
| Game names, OL, play time, achievements, star thresholds | `games/meta.js` |

## 6. Behaviour to know about

- **Diameter** remembers cleared stages in `sessionStorage`: press ← Games, come back, and it resumes at the next stage (press ↻ to start over).
- **Best scores and badges** are kept in that tab's `sessionStorage` only (gone when the tab closes). Save permanently through `onGameFinish`.
- **Sound** is generated with Web Audio (no audio files). Players can mute with the 🔊 button; the setting is kept in `localStorage`.
- **Drag and drop** uses Pointer Events, so it works with mouse and touch, plus a "tap a piece → tap a slot" mode for players who can't drag or use a keyboard.
- **Buttons / tap targets** are ≥ 44px and respect `prefers-reduced-motion`.
- **Responsive**: the hub shows 1 column on phones, 2 on tablets and 3 at ≥1024px.
- Every game is always open; there is no Pretest lock.
- Supported browsers: current Chrome, Edge, Safari and Firefox (iOS Safari 15+).

## 7. Running the demo app in this project

```bash
npm install
npm run dev
```

Open `http://localhost:5173` → Games menu (`src/App.jsx` shows how to plug the module into a host site).
When a run ends, its `run` object is logged to the console.

## 8. File layout

```
src/muscle-games/
├── index.js              ← import from here
├── MuscleGames.jsx       ← main component (Routes + providers + error boundary)
├── styles.css            ← all CSS (prefix mg-)
├── GamesHub.jsx          ← games hub
├── covers.jsx, art.jsx   ← cover scenes and illustrations (SVG)
├── scores.jsx, config.js
├── components/           ← GamePage (game frame / results), Hud (timer, combo, stars)
├── fx/                   ← sound, confetti, the Armin mascot, drag and drop, jigsaw
└── games/                ← BalloonPop, GroupSort (+sort/), diameter/, meta.js
```
