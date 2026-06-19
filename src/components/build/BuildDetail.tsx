import type { Build } from '../../types/build'
import type { Benchmark } from '../../types/benchmark'
import { benchmarksForBuild } from '../../data'
import { dash, gbs, usd, watts, toks, ctx } from '../../lib/format'
import { Panel, SpecGrid, Chip, CreditBadge, SourceLink, DataTable, type Column } from '../common/ui'
import { TopologyDiagram } from '../topology/TopologyDiagram'
import { ValidationLadder } from './ValidationLadder'
import { RackElevation } from './RackElevation'

export function BuildDetail({ build }: { build: Build }) {
  const bms = benchmarksForBuild(build.id)
  const t = build.topology
  const collapse = build.stability?.collapse

  return (
    <article className="mx-auto max-w-6xl px-5 pb-24">
      {/* ── hero: identity + the fabric artifact ── */}
      <header className="pt-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="eyebrow">{build.practitioner}</span>
          <Chip tone="copper">{build.gpu.count}× {build.gpu.model.replace('RTX PRO 6000 Blackwell ', '')}</Chip>
          {collapse && <Chip tone="fault">collapse-affected</Chip>}
        </div>
        <h1 className="nameplate mt-4 text-3xl leading-[0.95] text-text sm:text-5xl">{build.name}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{build.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip>{build.gpu.count * (build.gpu.vramGB ?? 0)} GB VRAM</Chip>
          <Chip>{build.cpu.sockets === 1 ? 'single-socket' : `${build.cpu.sockets}-socket`}</Chip>
          <Chip tone={collapse ? 'fault' : 'steel'}>{collapse ? 'posted-write collapse' : `${gbs(t.allToAllGBs)} all-to-all`}</Chip>
        </div>
        <p className="data mt-4 text-xs text-faint">
          Source:{' '}
          {build.sourceUrl ? (
            <SourceLink href={build.sourceUrl}>{build.sourceUrl.split('/').pop()}</SourceLink>
          ) : (
            'self-reported build notes'
          )}
          {build.credit ? <span> · {build.credit}</span> : null}
        </p>
      </header>

      <Panel label="PCIe Fabric" meta={t.type}>
        <TopologyDiagram topology={t} />
        {t.notes && t.notes.length > 0 && (
          <ul className="mt-5 space-y-1.5">
            {t.notes.map((n, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <span className="mt-2 h-px w-3 shrink-0 bg-copper-dim" aria-hidden />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel label="Specs">
        <SpecGrid
          items={[
            { label: 'GPU', value: build.gpu.model },
            { label: 'Count', value: `${build.gpu.count}×` },
            { label: 'VRAM / card', value: build.gpu.vramGB ? `${build.gpu.vramGB} GB` : '—' },
            { label: 'Power limit', value: watts(build.gpu.powerLimitW) },
            { label: 'CPU', value: dash(build.cpu.model) },
            { label: 'Sockets', value: String(build.cpu.sockets) },
            { label: 'Motherboard', value: dash(build.motherboard) },
            { label: 'Fabric', value: t.type },
            { label: 'All-to-all', value: gbs(t.allToAllGBs) },
            { label: 'P2P', value: gbs(build.performance?.p2pGBs) },
            { label: 'Latency', value: dash(build.performance?.latencyUs, (n) => `${n} µs`) },
            { label: 'Engines', value: dash(build.software?.engines?.join(', ')) },
          ]}
        />
      </Panel>

      {(build.pros?.length || build.cons?.length) && (
        <Panel label="For & Against">
          <div className="grid gap-8 sm:grid-cols-2">
            <ProCon items={build.pros} sign="+" tone="text-good" heading="For" />
            <ProCon items={build.cons} sign="−" tone="text-fault" heading="Against" />
          </div>
        </Panel>
      )}

      {bms.length > 0 && (
        <Panel label="Benchmarks" meta={`${bms.length} measured`}>
          <DataTable<Benchmark> columns={benchmarkColumns} rows={bms} />
        </Panel>
      )}

      {build.servingConfig && (
        <Panel label="Serving">
          <p className="data text-sm text-muted">
            <span className="text-copper-bright">{build.servingConfig.engine}</span>
            {build.servingConfig.flags ? `  ·  ${build.servingConfig.flags}` : ''}
          </p>
          {build.servingConfig.headline && (
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              {build.servingConfig.headline.map((h) => (
                <div key={h.metric} className="rounded-md border border-line bg-surface p-4">
                  <dt className="text-xs text-faint">{h.metric}</dt>
                  <dd className="data mt-1 text-xl text-copper-bright">{h.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {build.servingConfig.notes && <p className="mt-3 text-sm text-muted">{build.servingConfig.notes}</p>}
        </Panel>
      )}

      {build.validationLadder && (
        <Panel label="Bring-up validation" meta="each rung gates the next">
          <ValidationLadder rungs={build.validationLadder} />
        </Panel>
      )}

      {build.bom && (
        <Panel
          label="Bill of materials"
          meta={build.costRollup?.fullUSD ? `${usd(build.costRollup.fullUSD)} all-in` : undefined}
        >
          <DataTable
            columns={[
              { key: 'component', label: 'Component' },
              { key: 'qty', label: 'Qty', align: 'right', mono: true, render: (r) => `${r.qty}×` },
              { key: 'unitCost', label: 'Unit', align: 'right', mono: true, render: (r) => usd(r.unitCost) },
              { key: 'status', label: 'Status', render: (r) => <Chip>{r.status ?? '—'}</Chip> },
            ]}
            rows={build.bom}
          />
        </Panel>
      )}

      {build.cableSchedule && (
        <Panel label="Cable schedule">
          <DataTable
            columns={[
              { key: 'kind', label: 'Link', render: (r) => <Chip tone="copper">{r.kind}</Chip> },
              { key: 'from', label: 'From', mono: true },
              { key: 'to', label: 'To', mono: true },
              { key: 'spec', label: 'Spec' },
            ]}
            rows={build.cableSchedule}
          />
        </Panel>
      )}

      {build.biosChecklist && (
        <Panel label="BIOS / enumeration" meta="the real bring-up wall">
          <ul className="space-y-2.5">
            {build.biosChecklist.map((c, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-[3px] border border-copper-dim" aria-hidden />
                <span className="text-sm text-text">
                  {c.label}
                  {c.detail && <span className="text-faint"> — {c.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {build.rackElevation && (
        <Panel label="Rack elevation">
          <RackElevation units={build.rackElevation} />
        </Panel>
      )}

      {build.cooling && (
        <Panel label="Cooling">
          <ol className="space-y-3">
            {build.cooling.stages.map((s, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-3">
                <span className="data text-xs text-copper">{s.trigger}</span>
                <span className="text-faint" aria-hidden>→</span>
                <span className="text-sm text-text">{s.action}</span>
              </li>
            ))}
          </ol>
          {build.cooling.notes && <p className="mt-3 text-sm text-muted">{build.cooling.notes}</p>}
        </Panel>
      )}

      {build.riskRegister && (
        <Panel label="Risks">
          <DataTable
            columns={[
              { key: 'risk', label: 'Risk' },
              { key: 'likelihood', label: 'Likelihood', render: (r) => <Chip tone={r.likelihood === 'high' ? 'fault' : 'line'}>{r.likelihood}</Chip> },
              { key: 'impact', label: 'Impact', render: (r) => <Chip tone={r.impact === 'high' ? 'fault' : 'line'}>{r.impact}</Chip> },
              { key: 'mitigation', label: 'Mitigation' },
            ]}
            rows={build.riskRegister}
          />
        </Panel>
      )}

      {build.notes && build.notes.length > 0 && (
        <Panel label="Notes">
          <ul className="space-y-2">
            {build.notes.map((n, i) => (
              <li key={i} className="text-sm leading-relaxed text-muted">
                {n}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <CreditBadge credit={build.credit} sourceUrl={build.sourceUrl} />
        <span className="data text-[11px] text-faint">
          {build.credit?.toLowerCase().includes('self-reported') ? 'self-reported' : 'community-reported · rtx6kpro'}
        </span>
      </footer>
    </article>
  )
}

function ProCon({
  items,
  sign,
  tone,
  heading,
}: {
  items?: string[]
  sign: string
  tone: string
  heading: string
}) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <h3 className="eyebrow mb-3">{heading}</h3>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-text">
            <span className={`data shrink-0 ${tone}`}>{sign}</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const benchmarkColumns: Column<Benchmark>[] = [
  { key: 'model', label: 'Model', mono: true },
  { key: 'quant', label: 'Quant', render: (r) => <Chip>{r.quant}</Chip> },
  { key: 'engine', label: 'Engine' },
  { key: 'parallelism', label: 'Config', mono: true, render: (r) => `${r.parallelism ?? '—'}${r.mtp ? ' · MTP' : ''}` },
  { key: 'metricType', label: 'Metric', render: (r) => `${r.metricType}${r.contextTokens != null ? ` @ ${ctx(r.contextTokens)}` : ''}` },
  { key: 'throughput', label: 'Throughput', align: 'right', mono: true, render: (r) => toks(r.throughput) },
  { key: 'sourceUrl', label: 'Src', render: (r) => (r.sourceUrl ? <a href={r.sourceUrl} target="_blank" rel="noreferrer" className="text-copper hover:text-copper-bright">↗</a> : '—') },
]
