import { useMemo, useState } from 'react'
import { builds } from '../data'
import { BuildCard } from '../components/build/BuildCard'
import type { TopologyType } from '../types/build'

// Human labels for the fabric facet. Mirrors the BuildCard mapping so the
// catalog and the cards speak the same language.
const FABRIC_LABEL: Record<TopologyType, string> = {
  'direct-attach': 'direct-attach',
  'flat-2-switch': 'flat 2-switch',
  '2-vs-per-chip': '2-VS / chip',
  'hierarchy-3-switch': '3-switch hierarchy',
  'flat-4-switch': '4-switch',
  'broadcom-dual-vs': 'broadcom dual-VS',
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`data rounded-full border px-3 py-1 text-[11px] transition-colors ${
        active
          ? 'border-copper-dim bg-surface text-copper-bright'
          : 'border-line text-muted hover:border-line-bright hover:text-text'
      }`}
    >
      {children}
    </button>
  )
}

export function CatalogPage() {
  const [activeFabrics, setActiveFabrics] = useState<Set<TopologyType>>(new Set())
  const [activeCounts, setActiveCounts] = useState<Set<number>>(new Set())

  // Facet options derived from the data, in catalog presentation order.
  const fabricOptions = useMemo(() => {
    const seen = new Set<TopologyType>()
    const ordered: TopologyType[] = []
    for (const b of builds) {
      if (!seen.has(b.topology.type)) {
        seen.add(b.topology.type)
        ordered.push(b.topology.type)
      }
    }
    return ordered
  }, [])

  const countOptions = useMemo(
    () => Array.from(new Set(builds.map((b) => b.gpu.count))).sort((a, b) => a - b),
    [],
  )

  const toggleFabric = (t: TopologyType) =>
    setActiveFabrics((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })

  const toggleCount = (c: number) =>
    setActiveCounts((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })

  const clearAll = () => {
    setActiveFabrics(new Set())
    setActiveCounts(new Set())
  }

  // Multi-select within a facet is OR; across facets is AND.
  const filtered = useMemo(
    () =>
      builds.filter((b) => {
        const fabricOk = activeFabrics.size === 0 || activeFabrics.has(b.topology.type)
        const countOk = activeCounts.size === 0 || activeCounts.has(b.gpu.count)
        return fabricOk && countOk
      }),
    [activeFabrics, activeCounts],
  )

  const hasFilters = activeFabrics.size > 0 || activeCounts.size > 0

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

      <section className="mt-10" aria-label="Filter builds">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="data text-[10px] uppercase tracking-[0.16em] text-faint">Fabric</span>
          {fabricOptions.map((t) => (
            <FilterChip key={t} active={activeFabrics.has(t)} onClick={() => toggleFabric(t)}>
              {FABRIC_LABEL[t] ?? t}
            </FilterChip>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="data text-[10px] uppercase tracking-[0.16em] text-faint">GPUs</span>
          {countOptions.map((c) => (
            <FilterChip key={c} active={activeCounts.has(c)} onClick={() => toggleCount(c)}>
              {c}×
            </FilterChip>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="data text-xs text-faint">
            {filtered.length} {filtered.length === 1 ? 'build' : 'builds'}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="data text-xs text-copper transition-colors hover:text-copper-bright"
            >
              clear filters
            </button>
          )}
        </div>
      </section>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BuildCard key={b.id} build={b} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-line bg-surface p-10 text-center">
          <p className="data text-sm text-muted">No builds match these filters.</p>
          <button
            type="button"
            onClick={clearAll}
            className="data mt-3 text-xs text-copper transition-colors hover:text-copper-bright"
          >
            clear filters
          </button>
        </div>
      )}
    </main>
  )
}
