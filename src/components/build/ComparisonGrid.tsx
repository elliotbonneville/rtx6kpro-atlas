import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { builds, benchmarksForBuild } from '../../data'
import { dash, gbs, toks, EM_DASH } from '../../lib/format'
import { Chip } from '../common/ui'

const FABRIC_LABEL: Record<string, string> = {
  'direct-attach': 'direct-attach',
  'flat-2-switch': 'flat 2-switch',
  '2-vs-per-chip': '2-VS / chip',
  'hierarchy-3-switch': '3-switch hierarchy',
  'flat-4-switch': '4-switch',
  'broadcom-dual-vs': 'broadcom dual-VS',
}

function bestDecode(buildId: string): number | null {
  const v = benchmarksForBuild(buildId)
    .filter((b) => b.metricType === 'single-stream-decode' && b.throughput != null)
    .map((b) => b.throughput as number)
  return v.length ? Math.max(...v) : null
}

// One flattened, sortable row per build. Nullable numerics stay null so the
// table renders them as an em dash and sorts them to the bottom.
interface Row {
  id: string
  name: string
  practitioner: string
  fabricType: string
  collapse: boolean
  gpuCount: number
  vramTotal: number | null
  allToAll: number | null
  p2p: number | null
  decode: number | null
}

function toRow(buildId: string): Row {
  const build = builds.find((b) => b.id === buildId)!
  const vramEach = build.gpu.vramGB
  return {
    id: build.id,
    name: build.name,
    practitioner: build.practitioner,
    fabricType: build.topology.type,
    collapse: build.stability?.collapse === true,
    gpuCount: build.gpu.count,
    vramTotal: vramEach != null ? vramEach * build.gpu.count : null,
    allToAll: build.performance?.allToAllGBs ?? build.topology.allToAllGBs ?? null,
    p2p: build.performance?.p2pGBs ?? null,
    decode: bestDecode(build.id),
  }
}

type SortKey = 'name' | 'gpuCount' | 'fabricType' | 'allToAll' | 'p2p' | 'decode'
type SortDir = 'asc' | 'desc'

interface ColumnDef {
  key: SortKey
  label: string
  align: 'left' | 'right'
  /** sort value; nulls always sink to the bottom regardless of direction */
  sortVal: (r: Row) => number | string | null
}

const COLUMNS: ColumnDef[] = [
  { key: 'name', label: 'Build', align: 'left', sortVal: (r) => r.name.toLowerCase() },
  { key: 'gpuCount', label: 'GPUs', align: 'right', sortVal: (r) => r.gpuCount },
  { key: 'fabricType', label: 'Fabric', align: 'left', sortVal: (r) => r.fabricType },
  { key: 'allToAll', label: 'All-to-all', align: 'right', sortVal: (r) => r.allToAll },
  { key: 'p2p', label: 'P2P', align: 'right', sortVal: (r) => r.p2p },
  { key: 'decode', label: 'Best decode', align: 'right', sortVal: (r) => r.decode },
]

const DEFAULT_DIR: Record<SortKey, SortDir> = {
  name: 'asc',
  fabricType: 'asc',
  gpuCount: 'desc',
  allToAll: 'desc',
  p2p: 'desc',
  decode: 'desc',
}

export function ComparisonGrid() {
  const [sortKey, setSortKey] = useState<SortKey>('decode')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const rows = useMemo(() => builds.map((b) => toRow(b.id)), [])

  const sorted = useMemo(() => {
    const col = COLUMNS.find((c) => c.key === sortKey)!
    const dir = sortDir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = col.sortVal(a)
      const bv = col.sortVal(b)
      // nulls/undefined always sink to the bottom, both directions
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
  }, [rows, sortKey, sortDir])

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(DEFAULT_DIR[key])
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[44rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            {COLUMNS.map((c) => {
              const active = c.key === sortKey
              return (
                <th
                  key={c.key}
                  aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className={`px-3 py-2 ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  } ${c.key === 'name' ? 'sticky left-0 z-10 bg-board' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => onSort(c.key)}
                    className={`eyebrow inline-flex items-center gap-1 transition-colors hover:text-copper-bright ${
                      c.align === 'right' ? 'flex-row-reverse' : ''
                    } ${active ? 'text-copper-bright' : 'text-faint'}`}
                  >
                    <span>{c.label}</span>
                    <span aria-hidden className="text-[0.65em] leading-none">
                      {active ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr
              key={r.id}
              className={`group border-b border-line/50 transition-colors last:border-0 hover:bg-surface ${
                r.collapse ? 'bg-fault/[0.06]' : ''
              }`}
            >
              {/* Build — emphasized, sticky first column */}
              <td className="sticky left-0 z-10 bg-board px-3 py-3 align-top group-hover:bg-surface">
                <Link to={`/builds/${r.id}`} className="block">
                  <span className="block font-bold leading-tight tracking-tight text-text transition-colors group-hover:text-copper-bright">
                    {r.name}
                  </span>
                  <span className="eyebrow mt-1 block normal-case tracking-[0.14em] text-faint">
                    {r.practitioner}
                  </span>
                </Link>
              </td>

              {/* GPUs — count + total VRAM */}
              <td className="px-3 py-3 text-right align-top">
                <span className="data tabular-nums text-text">{r.gpuCount}×</span>
                <span className="data mt-0.5 block text-xs tabular-nums text-faint">
                  {dash(r.vramTotal, (n) => `${n} GB`)}
                </span>
              </td>

              {/* Fabric */}
              <td className="px-3 py-3 align-top">
                <Chip tone={r.collapse ? 'fault' : 'copper'}>
                  {FABRIC_LABEL[r.fabricType] ?? r.fabricType}
                </Chip>
              </td>

              {/* All-to-all — 'collapse' in fault color when the build collapses */}
              <td className="px-3 py-3 text-right align-top">
                {r.collapse ? (
                  <span className="data tabular-nums text-fault">collapse</span>
                ) : (
                  <span className="data tabular-nums text-text">{gbs(r.allToAll)}</span>
                )}
              </td>

              {/* P2P */}
              <td className="px-3 py-3 text-right align-top">
                <span className="data tabular-nums text-text">{gbs(r.p2p)}</span>
              </td>

              {/* Best decode */}
              <td className="px-3 py-3 text-right align-top">
                <span className="data tabular-nums text-copper-bright">
                  {r.decode != null ? toks(r.decode) : EM_DASH}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
