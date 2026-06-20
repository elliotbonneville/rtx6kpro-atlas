import type { Build } from '../types/build'
import type { Benchmark } from '../types/benchmark'
import { luke8x } from './builds/luke-8x'
import { festrDualTurin } from './builds/festr-dual-turin'
import { orangezed8x } from './builds/orangezed-8x'
import { grimulkan8x } from './builds/grimulkan-8x'
import { wrx90Flat2Switch } from './builds/wrx90-flat-2switch'
import { wrx9016gpu } from './builds/wrx90-16gpu'
import { asrockrackTurin16gpu } from './builds/asrockrack-turin-16gpu'
import { cpayne2vs } from './builds/cpayne-2vs'
import { cpayneHierarchy } from './builds/cpayne-hierarchy'
import { esc8000Broadcom } from './builds/esc8000-broadcom'
import { benchmarks } from './benchmarks'

// Order is presentation order in the catalog — peers, no ranking implied.
export const builds: Build[] = [
  luke8x,
  festrDualTurin,
  cpayne2vs,
  cpayneHierarchy,
  wrx90Flat2Switch,
  orangezed8x,
  grimulkan8x,
  wrx9016gpu,
  asrockrackTurin16gpu,
  esc8000Broadcom,
]

// Fallback build id when the URL has none. Just the first in the list.
export const defaultBuildId = builds[0].id

export const buildsById: Record<string, Build> = Object.fromEntries(
  builds.map((b) => [b.id, b]),
)

export function benchmarksForBuild(buildId: string): Benchmark[] {
  return benchmarks.filter((b) => b.buildId === buildId)
}

// ── Attribution is structural: every build links a source so any figure can be
// traced back. A build without a sourceUrl fails the build.
for (const b of builds) {
  if (!b.sourceUrl) {
    throw new Error(`Build "${b.id}" is missing a sourceUrl.`)
  }
}
for (const bm of benchmarks) {
  if (!bm.sourceUrl) {
    throw new Error(`Benchmark "${bm.id}" is missing a sourceUrl.`)
  }
  if (bm.buildId && !buildsById[bm.buildId]) {
    throw new Error(`Benchmark "${bm.id}" references unknown build "${bm.buildId}".`)
  }
}

export { benchmarks }
