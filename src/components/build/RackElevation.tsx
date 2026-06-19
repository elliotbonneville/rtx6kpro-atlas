import type { RackUnit } from '../../types/build'

const KIND_ACCENT: Record<RackUnit['kind'], string> = {
  compute: 'var(--color-copper)',
  gpu: 'var(--color-steel)',
  psu: 'var(--color-copper-dim)',
  pdu: 'var(--color-line-bright)',
  ups: 'var(--color-line-bright)',
  switch: 'var(--color-steel-dim)',
  blank: 'var(--color-line)',
}

export function RackElevation({ units }: { units: RackUnit[] }) {
  return (
    <div className="mx-auto max-w-md rounded-md border border-line-bright bg-ink p-2">
      <div className="flex flex-col gap-1.5">
        {units.map((u, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-sm border border-line bg-surface px-3 py-2.5"
            style={{ borderLeft: `3px solid ${KIND_ACCENT[u.kind]}` }}
          >
            <span className="data text-[10px] uppercase tracking-[0.14em] text-faint">{u.kind}</span>
            <span className="text-sm text-text">{u.label}</span>
          </div>
        ))}
      </div>
      <p className="data mt-2 px-1 text-center text-[10px] text-faint">front → rear airflow</p>
    </div>
  )
}
