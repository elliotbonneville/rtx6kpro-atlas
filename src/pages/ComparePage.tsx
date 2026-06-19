import { builds } from '../data'
import { ComparisonGrid } from '../components/build/ComparisonGrid'

export function ComparePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Compare</p>
        <h1 className="nameplate mt-3 text-3xl leading-[0.95] text-text sm:text-4xl">
          Weigh them side by side
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          All {builds.length} builds on one bench — fabric, all-to-all and P2P bandwidth, and best
          measured decode. Sort any column to find where the trade-offs land.
        </p>
      </header>

      <div className="mt-10">
        <ComparisonGrid />
      </div>
    </main>
  )
}
