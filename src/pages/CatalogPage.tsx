import { builds } from '../data'
import { BuildCard } from '../components/build/BuildCard'

export function CatalogPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-12">
      <header className="max-w-2xl">
        <p className="eyebrow">The catalog</p>
        <h1 className="nameplate mt-3 text-3xl leading-[0.95] text-text sm:text-4xl">Every build, as a peer</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {builds.length} RTX PRO 6000 Blackwell inference builds — direct-attach, switched, and the cautionary
          ones — shown with equal prominence. Each carries its specs, trade-offs, benchmarks, and a visualized PCIe
          fabric so you can weigh them against each other.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {builds.map((b) => (
          <BuildCard key={b.id} build={b} />
        ))}
      </div>
    </main>
  )
}
