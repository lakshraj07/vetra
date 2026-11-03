# Vetra — translational engine (platform UI)

Static site, no build step.

    cd vetra-platform
    python3 -m http.server 8080      # or any static server
    open http://localhost:8080

Files
- index.html          app shell, screens, agent orchestration, theme (light default, Dark toggle)
- assets/charts.js    every figure drawn from data as inline SVG (CSS-variable themed)
- assets/umapmod.js   interactive single-patient UMAP (canvas)
- assets/flow.js      editable four-gate engine diagram
- assets/3dmol.js     3Dmol.js (vendored)
- assets/*_pdb.txt    ESM3 human / dog FAP backbones (dog superposed on human)
- assets/umap.json    UMAP points + colours

Notes
- Live hypothesis generation for non-osteosarcoma diseases uses the claude.ai artifact
  `sample` capability; served locally it falls back to a "not available in this view" message.
- Fonts load from Google Fonts; everything else is local.
- Run state (completed run, dog IC50, theme) persists in localStorage; Reset clears it.
