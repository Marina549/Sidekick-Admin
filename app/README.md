# Sidekick Admin

React + Vite + TypeScript build of the Claude Design prototype in `../project/Sidekick Admin.dc.html`.

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
```

- **State** lives in memory (`src/store.tsx`) and resets on reload. Seed data is in `src/data.ts`. Uploads are simulated with a progress timer.
- **Users:** click the avatar to switch between Priya Sethi (can submit) and Gary Spark (can submit and approve).
- **Design system:** `src/pds/` is the subset of the Pantry Design System CSS the prototype used (sutro / Albertsons blue theme). `src/components/pds.tsx` ports the PDS Button, Modal, Toast and ProgressBar markup.
- **Screens:** Home, Entity dashboard, New entity (Data & schema → Prompts & evals → Review & submit), Submitted for review, Edit entity, Review submission (approve / request changes).
