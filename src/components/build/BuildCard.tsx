import { Link } from 'react-router-dom'
import type { Build } from '../../types/build'
import { benchmarksForBuild } from '../../data'
import { gbs, toks } from '../../lib/format'
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

export function BuildCard({ build }: { build: Build }) {
  const decode = bestDecode(build.id)
  const collapse = build.stability?.collapse
  return (
    <Link
      to={`/builds/${build.id}`}
      className="group flex flex-col rounded-lg border border-line bg-surface p-5 transition-colors hover:border-copper-dim"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="eyebrow">{build.practitioner}</span>
        <Chip tone={collapse ? 'fault' : 'copper'}>{FABRIC_LABEL[build.topology.type] ?? build.topology.type}</Chip>
      </div>

      <h3 className="text-lg font-bold leading-tight tracking-tight text-text transition-colors group-hover:text-copper-bright">
        {build.name}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{build.summary}</p>

      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
        <Stat label="GPUs" value={`${build.gpu.count}× ${build.gpu.vramGB ?? ''}${build.gpu.vramGB ? 'G' : ''}`} />
        <Stat label="all-to-all" value={collapse ? 'collapse' : gbs(build.topology.allToAllGBs)} tone={collapse ? 'fault' : undefined} />
        <Stat label="best decode" value={decode ? toks(decode) : '—'} />
      </dl>

      {(build.pros?.[0] || build.cons?.[0]) && (
        <div className="mt-4 space-y-1.5 text-xs leading-snug">
          {build.pros?.[0] && (
            <p className="flex gap-2 text-muted">
              <span className="text-good">+</span>
              <span>{build.pros[0]}</span>
            </p>
          )}
          {build.cons?.[0] && (
            <p className="flex gap-2 text-muted">
              <span className="text-fault">−</span>
              <span>{build.cons[0]}</span>
            </p>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-line pt-3">
        <span className="data text-[11px] text-faint">{build.credit ?? 'rtx6kpro'}</span>
      </div>
    </Link>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'fault' }) {
  return (
    <div className="min-w-0">
      <dt className="data text-[9px] uppercase tracking-[0.14em] text-faint">{label}</dt>
      <dd className={`data mt-0.5 text-sm ${tone === 'fault' ? 'text-fault' : 'text-copper-bright'}`}>{value}</dd>
    </div>
  )
}
