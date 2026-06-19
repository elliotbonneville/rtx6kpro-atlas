#!/usr/bin/env node
// Mirror check against the source repo.
//
// The catalog tracks the community repo `local-inference-lab/rtx6kpro`. Its
// hardware pages are prose, not structured data, so builds are curated into
// typed records under src/data/builds/ — but this script keeps the catalog in
// sync with the repo by cross-referencing each build's sourceUrl against the
// repo's live file tree. It reports which documented configs are covered and
// which are new, so the catalog grows with the repo (the count is unbounded by
// design — nothing hard-codes it).
//
// Run: npm run sync

import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const REPO = 'local-inference-lab/rtx6kpro'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Reference / multi-build pages that aren't single-config build pages, so we
// don't flag them as "missing" builds.
const NON_BUILD_PAGES = new Set([
  'hardware/blackwell-power-limit-sweep.md',
  'hardware/nvme-raid-io-optimization.md',
  'hardware/pcie-bandwidth.md',
  'hardware/sm120-vs-sm100-architecture.md',
  'hardware/collapse-report.md',
  'hardware/topology.md',
  'hardware/gpu-configs.md', // documents several builds at once
  'hardware/wrx90-cpayne-8gpu-root-topology-comparison.md', // analysis, not a config
])

async function localSourcePaths() {
  const refs = new Set()
  for (const dir of ['src/data/builds', 'src/data']) {
    let files = []
    try {
      files = await readdir(join(ROOT, dir))
    } catch {
      continue
    }
    for (const f of files) {
      if (!f.endsWith('.ts')) continue
      const txt = await readFile(join(ROOT, dir, f), 'utf8')
      for (const m of txt.matchAll(
        /github\.com\/local-inference-lab\/rtx6kpro\/blob\/[^/]+\/([^\s'"`)]+)/g,
      )) {
        refs.add(m[1])
      }
    }
  }
  return refs
}

async function repoFiles() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/git/trees/master?recursive=1`,
    { headers: { 'User-Agent': 'blackwell-atlas-sync', Accept: 'application/vnd.github+json' } },
  )
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`)
  const json = await res.json()
  return json.tree.filter((t) => t.type === 'blob').map((t) => t.path)
}

try {
  const refs = await localSourcePaths()
  const files = await repoFiles()
  const hardware = files.filter((p) => p.startsWith('hardware/') && p.endsWith('.md')).sort()

  const covered = hardware.filter((p) => refs.has(p))
  const missing = hardware.filter((p) => !refs.has(p) && !NON_BUILD_PAGES.has(p))

  console.log(`\n  Mirror check — ${REPO}\n`)
  console.log(`  Covered config pages (${covered.length}):`)
  for (const p of covered) console.log(`    ✓ ${p}`)
  console.log(`\n  Not yet in the catalog (${missing.length}):`)
  if (missing.length === 0) console.log('    (none — the catalog mirrors the repo)')
  else for (const p of missing) console.log(`    + ${p}   ← add a build under src/data/builds/`)
  console.log(`\n  ${NON_BUILD_PAGES.size} reference/analysis pages skipped by design.\n`)
  process.exit(missing.length === 0 ? 0 : 1)
} catch (err) {
  console.error(`\n  Sync check failed: ${err.message}\n`)
  process.exit(2)
}
