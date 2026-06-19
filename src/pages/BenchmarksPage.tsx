import { benchmarks } from '../data'
import { BenchmarkExplorer } from '../components/benchmark/BenchmarkExplorer'

export function BenchmarksPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Benchmarks</p>
        <h1 className="nameplate mt-3 text-3xl leading-[0.95] text-text sm:text-4xl">
          Every measured number
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          All {benchmarks.length} throughput figures collected for these RTX PRO 6000 Blackwell builds.
          Every number is community-reported — filter and sort to compare like with like, and follow each
          row's link back to the source it was measured in.
        </p>
      </header>

      <div className="mt-10">
        <BenchmarkExplorer />
      </div>
    </main>
  )
}
