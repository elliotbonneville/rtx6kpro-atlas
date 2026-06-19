import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { benchmarks } from '../../data'
import type { Benchmark } from '../../types/benchmark'
import { Chip, SourceLink } from '../common/ui'
import { toks, ctx, dash } from '../../lib/format'

// ── A facet is one filterable column. Selections are multi-select within a
// facet (OR) and AND across facets, matching how you'd actually narrow a board
// of community numbers: "show me llama.cpp single-stream runs on 8 cards".
type FacetKey = 'model' | 'engine' | 'metricType' | 'gpuCount'

const FACETS: { key: FacetKey; label: string }[] = [
  { key: 'model', label: 'Model' },
  { key: 'engine', label: 'Engine' },
  { key: 'metricType', label: 'Metric' },
  { key: 'gpuCount', label: 'GPUs' },
]

// Distinct facet values, presented in first-seen order so the data drives the
// control set — no hardcoded enum lists to drift out of sync with the records.
function distinct(key: FacetKey): string[] {
  const seen: string[] = []
  for (const b of benchmarks) {
    const v = String(b[key])
    if (!seen.includes(v)) seen.push(v)
  }
  return seen
}

// ── Sorting. Every column is sortable; figures sort numerically (nulls sink),
// text sorts case-insensitively.
type SortKey = 'model' | 'quant' | 'engine' | 'hardware' | 'config' | 'metric' | 'throughput'
type SortDir = 'asc' | 'desc'

function configString(b: Benchmark): string {
  const parts: string[] = []
  if (b.parallelism) parts.push(b.parallelism)
  if (b.mtp) parts.push('MTP')
  return parts.join(' · ')
}

function metricString(b: Benchmark): string {
  return b.contextTokens != null ? `${b.metricType} @ ${ctx(b.contextTokens)}` : b.metricType
}

function sortValue(b: Benchmark, key: SortKey): string | number | null | undefined {
  switch (key) {
    case 'model':
      return b.model
    case 'quant':
      return b.quant
    case 'engine':
      return b.engine
    case 'hardware':
      return b.hardware
    case 'config':
      return configString(b)
    case 'metric':
      return metricString(b)
    case 'throughput':
      return b.throughput
  }
}

function compare(a: Benchmark, b: Benchmark, key: SortKey, dir: SortDir): number {
  const av = sortValue(a, key)
  const bv = sortValue(b, key)
  // Nulls always sink to the bottom regardless of direction.
  const aNull = av === null || av === undefined || av === ''
  const bNull = bv === null || bv === undefined || bv === ''
  if (aNull && bNull) return 0
  if (aNull) return 1
  if (bNull) return -1
  let cmp: number
  if (typeof av === 'number' && typeof bv === 'number') {
    cmp = av - bv
  } else {
    cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' })
  }
  return dir === 'asc' ? cmp : -cmp
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`data inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] transition-colors ${
        active
          ? 'border-copper-dim bg-copper/10 text-copper-bright'
          : 'border-line text-muted hover:border-line-bright hover:text-text'
      }`}
    >
      {children}
    </button>
  )
}

const COLUMNS: { key: SortKey; label: string; align?: 'right' }[] = [
  { key: 'model', label: 'Model' },
  { key: 'quant', label: 'Quant' },
  { key: 'engine', label: 'Engine' },
  { key: 'hardware', label: 'Hardware' },
  { key: 'config', label: 'Config' },
  { key: 'metric', label: 'Metric' },
  { key: 'throughput', label: 'Throughput', align: 'right' },
]

export function BenchmarkExplorer() {
  // Active selections per facet, stored as sets of stringified values.
  const [filters, setFilters] = useState<Record<FacetKey, string[]>>({
    model: [],
    engine: [],
    metricType: [],
    gpuCount: [],
  })
  const [sortKey, setSortKey] = useState<SortKey>('throughput')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const facetValues = useMemo<Record<FacetKey, string[]>>(
    () => ({
      model: distinct('model'),
      engine: distinct('engine'),
      metricType: distinct('metricType'),
      gpuCount: distinct('gpuCount'),
    }),
    [],
  )

  function toggle(key: FacetKey, value: string) {
    setFilters((prev) => {
      const cur = prev[key]
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
      return { ...prev, [key]: next }
    })
  }

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      // Figures default to high-first; text defaults to A→Z.
      setSortDir(key === 'throughput' ? 'desc' : 'asc')
    }
  }

  const rows = useMemo(() => {
    const filtered = benchmarks.filter((b) =>
      FACETS.every(({ key }) => {
        const active = filters[key]
        return active.length === 0 || active.includes(String(b[key]))
      }),
    )
    return [...filtered].sort((a, b) => compare(a, b, sortKey, sortDir))
  }, [filters, sortKey, sortDir])

  const activeCount = FACETS.reduce((n, { key }) => n + filters[key].length, 0)

  function clearAll() {
    setFilters({ model: [], engine: [], metricType: [], gpuCount: [] })
  }

  return (
    <div>
      {/* ── Filter controls ──────────────────────────────────────────── */}
      <div className="space-y-4 rounded-lg border border-line bg-surface/40 p-5">
        {FACETS.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <span className="eyebrow shrink-0 pt-1 sm:w-20">{label}</span>
            <div className="flex flex-wrap gap-1.5">
              {facetValues[key].map((value) => (
                <FilterChip
                  key={value}
                  active={filters[key].includes(value)}
                  onClick={() => toggle(key, value)}
                >
                  {key === 'gpuCount' ? `${value}×` : value}
                </FilterChip>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Result count + clear ─────────────────────────────────────── */}
      <div className="mt-4 flex items-baseline justify-between">
        <p className="data text-xs text-faint">
          <span className="text-copper">{rows.length}</span> of {benchmarks.length}{' '}
          {benchmarks.length === 1 ? 'result' : 'results'}
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="data text-xs text-muted transition-colors hover:text-copper-bright"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              {COLUMNS.map((c) => {
                const isActive = sortKey === c.key
                return (
                  <th
                    key={c.key}
                    aria-sort={isActive ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    className={`px-3 py-2 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className={`data inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors hover:text-copper-bright ${
                        isActive ? 'text-copper' : 'text-faint'
                      } ${c.align === 'right' ? 'flex-row-reverse' : ''}`}
                    >
                      {c.label}
                      <span aria-hidden className="text-[9px]">
                        {isActive ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </button>
                  </th>
                )
              })}
              <th className="px-3 py-2 text-right">
                <span className="data text-[10px] font-medium uppercase tracking-[0.14em] text-faint">
                  Source
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr
                key={b.id}
                className="border-b border-line/50 transition-colors last:border-0 hover:bg-surface/50"
              >
                {/* Model (+ size) */}
                <td className="px-3 py-2.5 align-top">
                  <span className="text-text">{b.model}</span>
                  {b.modelSizeB != null && (
                    <span className="data ml-1.5 text-xs text-faint">{b.modelSizeB}B</span>
                  )}
                </td>
                {/* Quant */}
                <td className="px-3 py-2.5 align-top">
                  <Chip tone="copper">{b.quant}</Chip>
                </td>
                {/* Engine */}
                <td className="data px-3 py-2.5 align-top text-muted">{b.engine}</td>
                {/* Hardware */}
                <td className="data px-3 py-2.5 align-top text-muted">{dash(b.hardware)}</td>
                {/* Config */}
                <td className="data px-3 py-2.5 align-top text-muted">{dash(configString(b))}</td>
                {/* Metric */}
                <td className="data px-3 py-2.5 align-top text-muted">{metricString(b)}</td>
                {/* Throughput */}
                <td className="data px-3 py-2.5 text-right align-top tabular-nums text-text">
                  {toks(b.throughput)}
                </td>
                {/* Source */}
                <td className="px-3 py-2.5 text-right align-top">
                  {b.sourceUrl ? <SourceLink href={b.sourceUrl} /> : <span className="text-faint">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="data mt-6 text-center text-sm text-faint">
          No benchmarks match these filters.
        </p>
      )}
    </div>
  )
}
