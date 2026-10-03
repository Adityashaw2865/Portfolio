# Aditya Kumar Shaw — Portfolio

Personal developer portfolio built with **React + Vite + Tailwind CSS + Framer Motion**.
Dark and light themes share one brand palette (midnight navy, gold, saffron, maroon).

## Run locally

```bash
npm install
npm run dev        # development server
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## Where to edit content

| What | File |
| --- | --- |
| Resume, GitHub, LinkedIn, LeetCode, email | `src/data/config.js` |
| Projects (featured / more, summaries, links) | `src/data/projects.js` |
| Skills and skill levels | `src/components/Skills.jsx` |
| Experience, Hackathons, Certifications | `src/components/Experience.jsx`, `Hackathons.jsx`, `Certifications.jsx` |
| Stats counters | `src/components/Stats.jsx` |
| Colours (dark + light) | top of `src/index.css` |

To mark a project as featured, set `featured: true` in `src/data/projects.js`.

## Live activity graphs

- **LeetCode heatmap** (`LeetCodeGraph.jsx`) reads the public submission calendar for `LEETCODE_USER` in `src/data/config.js`.
- **GitHub contributions graph** (`StockGraph.jsx`) reads the public contributions API.

Both load live data in the browser. They rely on free third-party APIs, so they can occasionally be slow or unavailable; a fallback message is shown in that case.

For design previews only, building with `VITE_DEMO=1` shows clearly labelled sample data instead of live data. A normal build never does.

## Deploy

Works on Vercel out of the box (`vercel.json` included). Framework preset: Vite, build command `npm run build`, output directory `dist`.
