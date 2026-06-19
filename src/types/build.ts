// The unified data model. Every build — community-reported or self-reported —
// is a peer: same shape, same template, same prominence. All view-bearing
// fields are optional so sparse records render gracefully alongside rich ones.

export type PcieGen = 4 | 5
export type LaneWidth = 4 | 8 | 16
export type LinkRole = 'gpu' | 'uplink' | 'inter-switch' | 'host'

export type TopologyType =
  | 'direct-attach' // GPUs straight to CPU root complexes / xGMI
  | 'flat-2-switch' // 2 switches, cross-switch traffic via CPU (~162)
  | '2-vs-per-chip' // 2 switches each split into 2 virtual switches (~254)
  | 'hierarchy-3-switch' // leaf switches uplink to a root switch (~196)
  | 'flat-4-switch' // 4 sibling switches (16-GPU class, ~204)
  | 'broadcom-dual-vs' // Broadcom dual-VS with posted-write collapse

export type NodeKind = 'cpu' | 'root-complex' | 'switch' | 'virtual-switch' | 'gpu'

export interface TopoNode {
  id: string
  kind: NodeKind
  label: string
  /** virtual-switch -> physical switch; root-complex -> cpu; etc. */
  parentId?: string | null
  meta?: Record<string, string | number>
}

export interface TopoEdge {
  id: string
  from: string
  to: string
  gen: PcieGen
  width: LaneWidth
  role: LinkRole
  bandwidthGBs?: number | null
  latencyUs?: number | null
  /** true on links prone to the Broadcom posted-write arbitration collapse */
  collapseProne?: boolean
  note?: string
}

export interface Topology {
  type: TopologyType
  rootSwitchId?: string | null
  nodes: TopoNode[]
  edges: TopoEdge[]
  /** headline aggregate fabric bandwidth, GB/s */
  allToAllGBs?: number | null
  notes?: string[]
}

export interface GpuConfig {
  model: string
  count: number
  edition?: string | null
  vramGB?: number | null
  powerLimitW?: number | null
}

export interface CpuConfig {
  model?: string | null
  sockets: number
  vendor?: 'AMD' | 'Intel' | null
}

export interface Performance {
  allToAllGBs?: number | null
  p2pGBs?: number | null
  latencyUs?: number | null
}

export interface Stability {
  collapse?: boolean | null
  collapsePct?: number | null
  xidErrors?: string[] | null
  notes?: string | null
}

export interface SoftwareStack {
  os?: string | null
  driver?: string | null
  cuda?: string | null
  engines?: string[] | null
  notes?: string | null
}

export interface PowerSpec {
  psus?: string[] | null
  totalW?: number | null
  circuits?: string[] | null
  notes?: string | null
}

// --- optional detailed views (any build may carry these) ---

export interface BomLine {
  component: string
  qty: number
  unitCost?: number | null
  status?: 'owned' | 'ordered' | 'planned' | null
  source?: string | null
}

export interface CostRollup {
  incrementalUSD?: number | null
  fullUSD?: number | null
  breakdown?: { label: string; usd: number }[]
}

export interface CableRun {
  id: string
  kind: 'uplink' | 'gpu-link' | 'power'
  from: string
  to: string
  spec: string
  lengthCm?: number | null
}

export interface ValidationRung {
  rung: number
  name: string
  target: string
  metric?: string | null
  status?: 'pass' | 'fail' | 'pending' | null
}

export interface ChecklistItem {
  label: string
  detail?: string | null
  done?: boolean | null
}

export interface RackUnit {
  label: string
  kind: 'compute' | 'gpu' | 'psu' | 'pdu' | 'ups' | 'switch' | 'blank'
}

export interface CoolingPlan {
  stages: { trigger: string; action: string }[]
  notes?: string | null
}

export interface ServingConfig {
  engine: string
  flags?: string | null
  headline?: { metric: string; value: string }[]
  notes?: string | null
}

export interface RiskItem {
  risk: string
  likelihood: 'low' | 'med' | 'high'
  impact: 'low' | 'med' | 'high'
  mitigation: string
}

export interface Build {
  id: string
  name: string
  practitioner: string
  summary: string
  /** Source for the build's claims. Self-reported builds may cite a reference. */
  sourceUrl?: string | null
  credit?: string | null

  gpu: GpuConfig
  cpu: CpuConfig
  motherboard?: string | null
  topology: Topology
  performance?: Performance
  stability?: Stability
  software?: SoftwareStack
  power?: PowerSpec

  // weigh-against-each-other fields, first-class on every build
  pros?: string[]
  cons?: string[]
  notes?: string[]

  // optional detailed views
  bom?: BomLine[]
  costRollup?: CostRollup
  cableSchedule?: CableRun[]
  validationLadder?: ValidationRung[]
  biosChecklist?: ChecklistItem[]
  rackElevation?: RackUnit[]
  cooling?: CoolingPlan
  servingConfig?: ServingConfig
  riskRegister?: RiskItem[]
}
