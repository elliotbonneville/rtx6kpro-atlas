import type { ReactNode } from 'react'

export function Panel({
  label,
  meta,
  children,
}: {
  label: string
  meta?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="py-7">
      <header className="mb-5 flex items-baseline gap-4">
        <h2 className="eyebrow shrink-0">{label}</h2>
        <span className="trace-rule min-w-6 flex-1" />
        {meta && <span className="data shrink-0 text-xs text-faint">{meta}</span>}
      </header>
      {children}
    </section>
  )
}

export function SpecGrid({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="data text-[10px] uppercase tracking-[0.16em] text-faint">{it.label}</dt>
          <dd className="data mt-1 truncate text-sm text-text" title={typeof it.value === 'string' ? it.value : undefined}>
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function Chip({ children, tone = 'line' }: { children: ReactNode; tone?: 'line' | 'copper' | 'steel' | 'fault' }) {
  const tones: Record<string, string> = {
    line: 'border-line text-muted',
    copper: 'border-copper-dim text-copper-bright',
    steel: 'border-steel-dim text-steel',
    fault: 'border-fault/50 text-fault',
  }
  return (
    <span className={`data inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function SourceLink({ href, children }: { href: string; children?: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="data inline-flex items-center gap-1 text-xs text-copper transition-colors hover:text-copper-bright"
    >
      {children ?? 'source'}
      <span aria-hidden>↗</span>
    </a>
  )
}

export function CreditBadge({ credit, sourceUrl }: { credit?: string | null; sourceUrl?: string | null }) {
  if (!credit && !sourceUrl) return null
  return (
    <span className="data inline-flex items-center gap-2 text-xs text-faint">
      {credit && <span>{credit}</span>}
      {sourceUrl && <SourceLink href={sourceUrl} />}
    </span>
  )
}

export interface Column<R> {
  key: keyof R & string
  label: string
  align?: 'left' | 'right'
  mono?: boolean
  render?: (row: R) => ReactNode
}

export function DataTable<R>({ columns, rows }: { columns: Column<R>[]; rows: R[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`data px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-faint ${
                  c.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line/50 last:border-0">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-3 py-2.5 align-top ${c.align === 'right' ? 'text-right' : 'text-left'} ${
                    c.mono ? 'data text-text' : 'text-muted'
                  }`}
                >
                  {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
