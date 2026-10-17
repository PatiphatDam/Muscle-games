# Muscle Games

2D practice games for the lecture **Muscular Tissues I**, built with React, HTML5 and CSS3. Responsive on phones (≥360px), tablets and desktops.

| Game | Learning objective | What you do |
|---|---|---|
| **Balloon Pop** | OL1 – functions and properties of muscle tissue | Shoot darts at the balloon that matches each clue. Gold, ice and bomb balloons, ATP power-up. |
| **Group Sort** | OL2 – skeletal vs cardiac vs smooth muscle | Memory Match (picture ↔ name) or Conveyor Sort into three bins. |
| **Diameter** | OL3 – organization from whole muscle to molecules | Six-stage adventure: zoom dive, sarcomere jigsaw, connective tissue, contraction steps, picture jigsaw, DMD/MG clinic. |

**▶ Play online:** https://patiphatdam.github.io/Muscle-games/

All games include combos, a countdown timer, 1–3 stars, achievements, sound (mutable), a mascot (Myo) and a review screen of missed questions.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 — a demo "host site" with a **Games** menu.

| Script | Output |
|---|---|
| `npm run dev` | Dev server with the demo host site |
| `npm run build` | Production build of the demo host site → `dist/` |
| `npm run build:share` | One self-contained HTML file → `dist-artifact/` |
| `npm run build:pages` | Static site for GitHub Pages → `dist-pages/` (deployed automatically on every push to `main`) |

## Add the games to your React site

The whole module lives in [`src/muscle-games/`](src/muscle-games/). Copy it into your project and add one route:

```jsx
import { MuscleGames } from './muscle-games';

<Route path="/games/*" element={<MuscleGames onGameFinish={saveRun} />} />
```

Requires React 18+ and react-router-dom 6.7+. Full guide (Thai): [INTEGRATION.md](INTEGRATION.md).

## Project layout

```
src/
├── muscle-games/   ← the reusable games module (copy this)
├── App.jsx         ← demo host site showing the integration
├── main.jsx        ← demo entry (BrowserRouter)
└── artifact.jsx    ← single-page entry used by build:share
```
