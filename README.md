# Blackwell Build Atlas

A peer catalog of **RTX PRO 6000 Blackwell** local-inference builds — specs, pros/cons, notes, benchmarks, and a visualized PCIe topology for each. Every build is shown with equal prominence so you can browse and weigh them against each other.

There is no "reference" build: each entry uses the same template and data shape. The signature feature is a hand-rolled, data-driven **SVG topology visualizer** that renders any build's PCIe fabric (CPU → switches → virtual-switch partitions → GPUs) and makes fabric differences legible at a glance — flat 162 GB/s vs 2-VS 254 GB/s vs the Broadcom posted-write collapse.

## Data provenance & attribution

Build and benchmark data is drawn from the community **[`local-inference-lab/rtx6kpro`](https://github.com/local-inference-lab/rtx6kpro)** repo (itself synthesized from a practitioner Discord) and from self-reported build notes. Every record carries a `sourceUrl` and a practitioner `credit` — attribution is a structural requirement of the data model, enforced at build time. Credit to luke, Festr, orangezed, Grimulkan, and the other practitioners whose measurements this catalogs.

## Develop

```bash
flox activate          # nodejs via Flox (.flox/)
npm install
npm run dev            # Vite dev server
```

Preview remotely (mobile/Tailscale) with the `serve` workflow.

## Build & deploy

```bash
npm run build          # tsc -b && vite build -> dist/
npm run preview
```

Deploy is via `.github/workflows/deploy.yml` (rsync `dist/` to a server), **not yet wired** — the public host/domain is undecided. To enable, set the repo secrets and drop the `if: false` guard.

## Adding a build

Add a typed module under `src/data/builds/`, conforming to the `Build` type in `src/types/build.ts`, then register it in `src/data/index.ts`. Community records must include `sourceUrl` + `credit`. Express the PCIe fabric as topology nodes/edges so the visualizer renders it automatically — no per-build drawing code.

## Mirroring the repo

The catalog tracks the `local-inference-lab/rtx6kpro` repo as it grows — nothing hard-codes the build count; it's derived from the data and unbounded by design. To check the catalog against the live repo:

```bash
npm run sync
```

This cross-references each build's `sourceUrl` against the repo's current file tree and reports which documented configs are covered and which are new (candidates to add under `src/data/builds/`). Reference and analysis pages are skipped. The repo's hardware pages are prose rather than structured data, so new builds are still curated into typed records — the sync check is what surfaces drift.
