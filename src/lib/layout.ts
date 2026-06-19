// Deterministic tiered layout for the topology visualizer. No graph library:
// rank nodes by kind (cpu -> root-complex -> switch -> virtual-switch -> gpu),
// compress empty tiers, order each row by the barycenter of its upstream
// neighbours to reduce edge crossings. Handles direct-attach (no switch tier),
// flat/2-VS (switch +/- virtual-switch tiers), and hierarchies (the root switch
// floats half a rank above its leaves). Returns node centres in a unit space;
// the renderer derives container boxes for switches that own virtual switches.

import type { Topology, TopoNode } from '../types/build'

export interface PlacedNode extends TopoNode {
  x: number
  y: number
  row: number
}

export interface TopoLayout {
  nodes: PlacedNode[]
  byId: Record<string, PlacedNode>
  width: number
  height: number
  colW: number
  rowH: number
}

const KIND_RANK: Record<TopoNode['kind'], number> = {
  cpu: 0,
  'root-complex': 1,
  switch: 2,
  'virtual-switch': 3,
  gpu: 4,
}

const COL_W = 130
const ROW_H = 120
const PAD = 70

function effectiveRank(node: TopoNode, topo: Topology): number {
  let r = KIND_RANK[node.kind]
  if (topo.rootSwitchId && node.id === topo.rootSwitchId) r -= 0.5 // float root above leaves
  return r
}

export function layoutTopology(topo: Topology): TopoLayout {
  const { nodes, edges } = topo
  const idSet = new Set(nodes.map((n) => n.id))

  // adjacency: edges (undirected) + parentId containment, restricted to placed nodes
  const neighbours = new Map<string, Set<string>>()
  const add = (a: string, b: string) => {
    if (!neighbours.has(a)) neighbours.set(a, new Set())
    neighbours.get(a)!.add(b)
  }
  for (const e of edges) {
    if (!idSet.has(e.from) || !idSet.has(e.to)) continue
    add(e.from, e.to)
    add(e.to, e.from)
  }
  for (const n of nodes) {
    if (n.parentId && idSet.has(n.parentId)) {
      add(n.id, n.parentId)
      add(n.parentId, n.id)
    }
  }

  const rank = new Map<string, number>()
  for (const n of nodes) rank.set(n.id, effectiveRank(n, topo))

  // compress distinct ranks into consecutive row indices
  const distinct = [...new Set([...rank.values()])].sort((a, b) => a - b)
  const rowOf = new Map<string, number>()
  for (const n of nodes) rowOf.set(n.id, distinct.indexOf(rank.get(n.id)!))

  const rows: PlacedNode[][] = distinct.map(() => [])
  for (const n of nodes) {
    const row = rowOf.get(n.id)!
    rows[row].push({ ...n, x: 0, y: row * ROW_H + PAD, row })
  }

  // order each row top-down by barycenter of upstream (lower-rank) neighbours
  const xIndex = new Map<string, number>() // ordering index within row
  rows.forEach((rowNodes, ri) => {
    if (ri === 0) {
      rowNodes.forEach((n, i) => xIndex.set(n.id, i))
    } else {
      const score = (n: PlacedNode): number => {
        const ups = [...(neighbours.get(n.id) ?? [])].filter(
          (m) => (rank.get(m) ?? 0) < rank.get(n.id)!,
        )
        if (ups.length === 0) return xIndex.get(n.id) ?? 0
        return ups.reduce((s, m) => s + (xIndex.get(m) ?? 0), 0) / ups.length
      }
      rowNodes.sort((a, b) => score(a) - score(b))
      rowNodes.forEach((n, i) => xIndex.set(n.id, i))
    }
  })

  const maxCount = Math.max(...rows.map((r) => r.length), 1)
  const width = maxCount * COL_W + PAD * 2

  const placed: PlacedNode[] = []
  rows.forEach((rowNodes) => {
    const count = rowNodes.length
    rowNodes.forEach((n, i) => {
      // centre each row across the full width
      n.x = PAD + ((i + 0.5) / count) * (width - PAD * 2)
      placed.push(n)
    })
  })

  const byId: Record<string, PlacedNode> = {}
  for (const n of placed) byId[n.id] = n

  const height = rows.length * ROW_H + PAD
  return { nodes: placed, byId, width, height, colW: COL_W, rowH: ROW_H }
}
