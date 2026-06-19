import { useMemo, useState } from 'react'
import type { Topology, TopoEdge, NodeKind } from '../../types/build'
import { layoutTopology, type PlacedNode } from '../../lib/layout'
import { gbs, lane } from '../../lib/format'

const SIZE: Record<NodeKind, { w: number; h: number }> = {
  cpu: { w: 168, h: 46 },
  'root-complex': { w: 116, h: 34 },
  switch: { w: 124, h: 40 },
  'virtual-switch': { w: 80, h: 30 },
  gpu: { w: 88, h: 42 },
}

const EDGE_COLOR: Record<TopoEdge['role'], string> = {
  uplink: 'var(--color-copper-bright)',
  'inter-switch': 'var(--color-steel)',
  host: 'var(--color-copper-dim)',
  gpu: 'var(--color-copper)',
}

function strokeW(width: number): number {
  return width === 16 ? 2.6 : width === 8 ? 1.8 : 1.1
}

type Hover =
  | { kind: 'node'; node: PlacedNode }
  | { kind: 'edge'; edge: TopoEdge }
  | null

export function TopologyDiagram({ topology }: { topology: Topology }) {
  const [hover, setHover] = useState<Hover>(null)

  const view = useMemo(() => {
    // Container switches (those that parent virtual switches) are drawn as
    // boxes around their children rather than placed as nodes.
    const containerIds = new Set(
      topology.nodes
        .filter((n) => n.kind === 'virtual-switch' && n.parentId)
        .map((n) => n.parentId as string),
    )
    const placedNodes = topology.nodes.filter((n) => !containerIds.has(n.id))
    const layout = layoutTopology({ ...topology, nodes: placedNodes })

    const containers = [...containerIds].map((id) => {
      const meta = topology.nodes.find((n) => n.id === id)
      const kids = layout.nodes.filter((n) => n.parentId === id)
      const xs = kids.map((k) => k.x)
      const ys = kids.map((k) => k.y)
      const pad = 16
      const x0 = Math.min(...xs) - SIZE['virtual-switch'].w / 2 - pad
      const x1 = Math.max(...xs) + SIZE['virtual-switch'].w / 2 + pad
      const y0 = Math.min(...ys) - SIZE['virtual-switch'].h / 2 - pad - 14
      const y1 = Math.max(...ys) + SIZE['virtual-switch'].h / 2 + pad
      return { id, label: meta?.label ?? id, x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
    })

    return { layout, containers }
  }, [topology])

  const { layout, containers } = view
  const byId = layout.byId

  // Anchor each edge along the edge of the node nearest its target, so a CPU
  // fanning to several switches spreads cleanly along its underside instead of
  // all leaving from one point (which produced long sweeping curves).
  function anchor(n: PlacedNode, ox: number, oy: number) {
    const s = SIZE[n.kind]
    if (Math.abs(oy - n.y) < 1) {
      return { x: ox > n.x ? n.x + s.w / 2 : n.x - s.w / 2, y: n.y }
    }
    const x = Math.max(n.x - s.w / 2 + 10, Math.min(n.x + s.w / 2 - 10, ox))
    return { x, y: oy > n.y ? n.y + s.h / 2 : n.y - s.h / 2 }
  }

  function edgePath(e: TopoEdge): string {
    const a = byId[e.from]
    const b = byId[e.to]
    if (!a || !b) return ''
    const s = anchor(a, b.x, b.y)
    const t = anchor(b, a.x, a.y)
    if (Math.abs(a.y - b.y) < 1) {
      const mx = (s.x + t.x) / 2
      return `M ${s.x} ${s.y} C ${mx} ${s.y}, ${mx} ${t.y}, ${t.x} ${t.y}`
    }
    const my = (s.y + t.y) / 2
    return `M ${s.x} ${s.y} C ${s.x} ${my}, ${t.x} ${my}, ${t.x} ${t.y}`
  }

  const hoveredEdgeIds = new Set<string>()
  let hoverNodeId: string | null = null
  if (hover?.kind === 'edge') hoveredEdgeIds.add(hover.edge.id)
  if (hover?.kind === 'node') {
    hoverNodeId = hover.node.id
    for (const e of topology.edges) {
      if (e.from === hoverNodeId || e.to === hoverNodeId) hoveredEdgeIds.add(e.id)
    }
  }
  const anyHover = hover !== null

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${layout.width} ${layout.height + 8}`}
        className="w-full"
        style={{ maxHeight: '60vh' }}
        role="img"
        aria-label={`PCIe topology: ${topology.type}`}
      >
        {/* container switch boxes */}
        {containers.map((c) => (
          <g key={c.id}>
            <rect
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx={10}
              fill="color-mix(in srgb, var(--color-copper) 5%, transparent)"
              stroke="var(--color-copper-dim)"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <text
              x={c.x + 10}
              y={c.y + 14}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', fill: 'var(--color-copper)' }}
            >
              {c.label.toUpperCase()}
            </text>
          </g>
        ))}

        {/* edges */}
        {topology.edges.map((e) => {
          const d = edgePath(e)
          if (!d) return null
          const on = hoveredEdgeIds.has(e.id)
          const color = e.collapseProne ? 'var(--color-fault)' : EDGE_COLOR[e.role]
          return (
            <path
              key={e.id}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={strokeW(e.width) * (on ? 1.5 : 1)}
              strokeDasharray={e.gen === 4 ? '5 4' : undefined}
              opacity={anyHover && !on ? 0.18 : e.collapseProne ? 0.95 : 0.8}
              style={{ cursor: 'pointer', transition: 'opacity 120ms' }}
              onMouseEnter={() => setHover({ kind: 'edge', edge: e })}
              onMouseLeave={() => setHover(null)}
            />
          )
        })}

        {/* collapse fault glyphs */}
        {topology.edges
          .filter((e) => e.collapseProne)
          .map((e) => {
            const a = byId[e.from]
            const b = byId[e.to]
            if (!a || !b) return null
            const mx = (a.x + b.x) / 2
            const my = (a.y + b.y) / 2
            return (
              <text
                key={`f-${e.id}`}
                x={mx}
                y={my}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 13, fill: 'var(--color-fault)', pointerEvents: 'none' }}
              >
                ⚠
              </text>
            )
          })}

        {/* nodes */}
        {layout.nodes.map((n) => (
          <NodeShape
            key={n.id}
            node={n}
            dim={anyHover && hoverNodeId !== n.id && !hoveredEdgeIds.size}
            onEnter={() => setHover({ kind: 'node', node: n })}
            onLeave={() => setHover(null)}
          />
        ))}
      </svg>

      {/* instrument readout + legend */}
      <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3 sm:flex-row sm:items-center sm:justify-between">
        <Readout hover={hover} topology={topology} />
        <Legend />
      </div>
    </div>
  )
}

function NodeShape({
  node,
  dim,
  onEnter,
  onLeave,
}: {
  node: PlacedNode
  dim: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const s = SIZE[node.kind]
  const x = node.x - s.w / 2
  const y = node.y - s.h / 2
  const style = nodeStyle(node.kind)
  return (
    <g
      opacity={dim ? 0.3 : 1}
      style={{ cursor: 'default', transition: 'opacity 120ms' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <rect x={x} y={y} width={s.w} height={s.h} rx={style.rx} fill={style.fill} stroke={style.stroke} strokeWidth={style.sw} />
      {node.kind === 'gpu' && (
        <rect x={x + 4} y={y + 4} width={4} height={s.h - 8} rx={1} fill="var(--color-steel)" opacity={0.7} />
      )}
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: node.kind === 'cpu' ? 'var(--font-display)' : 'var(--font-mono)',
          fontWeight: node.kind === 'cpu' ? 700 : 500,
          fontSize: node.kind === 'cpu' ? 12.5 : node.kind === 'virtual-switch' ? 10 : 11,
          fill: style.text,
          pointerEvents: 'none',
        }}
      >
        {node.label}
      </text>
    </g>
  )
}

function nodeStyle(kind: NodeKind) {
  switch (kind) {
    case 'cpu':
      return { fill: 'var(--color-surface)', stroke: 'var(--color-copper)', sw: 1.5, rx: 6, text: 'var(--color-text)' }
    case 'root-complex':
      return { fill: 'var(--color-surface)', stroke: 'var(--color-line-bright)', sw: 1, rx: 5, text: 'var(--color-muted)' }
    case 'switch':
      return { fill: 'var(--color-surface-2)', stroke: 'var(--color-copper-bright)', sw: 1.5, rx: 6, text: 'var(--color-text)' }
    case 'virtual-switch':
      return { fill: 'var(--color-surface-2)', stroke: 'var(--color-copper)', sw: 1, rx: 5, text: 'var(--color-copper-bright)' }
    case 'gpu':
      return { fill: 'var(--color-surface-2)', stroke: 'var(--color-steel-dim)', sw: 1, rx: 4, text: 'var(--color-text)' }
  }
}

function Readout({ hover, topology }: { hover: Hover; topology: Topology }) {
  let text: string
  if (hover?.kind === 'edge') {
    const e = hover.edge
    const bits = [`${lane(e.width)} · Gen${e.gen}`, e.role]
    if (e.bandwidthGBs) bits.push(gbs(e.bandwidthGBs))
    if (e.note) bits.push(e.note)
    text = `${e.from} → ${e.to}  ·  ${bits.join('  ·  ')}`
  } else if (hover?.kind === 'node') {
    const n = hover.node
    const meta = n.meta ? Object.values(n.meta).join('  ·  ') : n.kind
    text = `${n.label}  ·  ${meta}`
  } else {
    text = `${topology.type}${topology.allToAllGBs ? `  ·  ${gbs(topology.allToAllGBs)} all-to-all` : '  ·  collapse-affected fabric'}`
  }
  return <p className="data text-xs leading-snug text-muted">{text}</p>
}

function Legend() {
  const items: { c: string; label: string }[] = [
    { c: 'var(--color-copper)', label: 'GPU link' },
    { c: 'var(--color-copper-bright)', label: 'uplink' },
    { c: 'var(--color-steel)', label: 'inter-switch' },
    { c: 'var(--color-fault)', label: 'collapse' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((i) => (
        <span key={i.label} className="data flex items-center gap-1.5 text-[10px] text-faint">
          <span className="inline-block h-[3px] w-4 rounded-full" style={{ background: i.c }} />
          {i.label}
        </span>
      ))}
    </div>
  )
}
