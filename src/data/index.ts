import type { Build } from '../types/build'
import type { Benchmark } from '../types/benchmark'
import { ours } from './builds/ours'
import { luke8x } from './builds/luke-8x'
import { festrDualTurin } from './builds/festr-dual-turin'
import { orangezed8x } from './builds/orangezed-8x'
import { grimulkan8x } from './builds/grimulkan-8x'
import { wrx90Flat2Switch } from './builds/wrx90-flat-2switch'
import { wrx9016gpu } from './builds/wrx90-16gpu'
import { asrockrackTurin16gpu } from './builds/asrockrack-turin-16gpu'
import { esc8000Broadcom } from './builds/esc8000-broadcom'
import { benchmarks } from './benchmarks'

// Order is presentation order in the catalog — peers, no ranking implied.
export const builds: Build[] = [
  luke8x,
  festrDualTurin,
  ours,
  wrx90Flat2Switch,
  orangezed8x,
  grimulkan8x,
  wrx9016gpu,
  asrockrackTurin16gpu,
  esc8000Broadcom,
]

// The landing build. A default selection, NOT a privileged architecture —
// every build renders through the same template.
export const defaultBuildId = ours.id

export const buildsById: Record<string, Build> = Object.fromEntries(
  builds.map((b) => [b.id, b]),
)

export function benchmarksForBuild(buildId: string): Benchmark[] {
  return benchmarks.filter((b) => b.buildId === buildId)
}

// ── Attribution is structural: a community record cannot ship without a
// source. The maintainer's own build is the only one allowed a null sourceUrl.
const MAINTAINER = 'sincerely'
for (const b of builds) {
  if (!b.sourceUrl && b.practitioner !== MAINTAINER) {
    throw new Error(`Build "${b.id}" is missing a sourceUrl (required for community builds).`)
  }
}
for (const bm of benchmarks) {
  if (!bm.sourceUrl) {
    throw new Error(`Benchmark "${bm.id}" is missing a sourceUrl.`)
  }
  if (!buildsById[bm.buildId]) {
    throw new Error(`Benchmark "${bm.id}" references unknown build "${bm.buildId}".`)
  }
}

export { benchmarks }
