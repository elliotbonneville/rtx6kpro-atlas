import type { Build } from '../../types/build'

// A self-reported community build — well-documented, but structurally just a
// peer in the catalog, not a privileged reference.
export const ours: Build = {
  id: 'wrx90-2vs-maxq',
  name: 'sincerely · 8× Max-Q · 2-VS',
  practitioner: 'sincerely',
  summary:
    'Eight RTX PRO 6000 Max-Q on a single-socket Threadripper PRO, wired through two C-Payne PM50100 switches partitioned into four virtual switches for full Gen5 x16 to every card — a single-socket path to serving GLM-5.2 NVFP4 at full quality without a dual-socket platform.',
  sourceUrl:
    'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/wrx90-cpayne-8gpu-2vs-per-chip.md',
  credit: 'sincerely · self-reported (topology per rtx6kpro 2-VS measurement)',

  gpu: { model: 'RTX PRO 6000 Blackwell Max-Q', edition: 'Max-Q', count: 8, vramGB: 96, powerLimitW: 250 },
  cpu: { model: 'Threadripper PRO 9985WX', sockets: 1, vendor: 'AMD' },
  motherboard: 'ASRock WRX90 WS EVO',

  topology: {
    type: '2-vs-per-chip',
    allToAllGBs: 254,
    notes: [
      'Each PM50100 partitioned into two virtual switches (4 uplinks total), spread across two CPU root complexes.',
      'The 254 GB/s layout is non-default (jumper + config tool); flat 2-switch is 162, luke’s 3-board hierarchy 196.',
    ],
    nodes: [
      { id: 'cpu', kind: 'cpu', label: 'Threadripper PRO 9985WX', meta: { lanes: '128 PCIe 5.0' } },
      { id: 'rcA', kind: 'root-complex', label: 'Root complex A', parentId: 'cpu' },
      { id: 'rcB', kind: 'root-complex', label: 'Root complex B', parentId: 'cpu' },
      { id: 'sw1', kind: 'switch', label: 'PM50100 #1', meta: { part: 'Microchip Switchtec PM50100' } },
      { id: 'sw2', kind: 'switch', label: 'PM50100 #2', meta: { part: 'Microchip Switchtec PM50100' } },
      { id: 'vsa', kind: 'virtual-switch', label: 'VS-A', parentId: 'sw1' },
      { id: 'vsb', kind: 'virtual-switch', label: 'VS-B', parentId: 'sw1' },
      { id: 'vsc', kind: 'virtual-switch', label: 'VS-C', parentId: 'sw2' },
      { id: 'vsd', kind: 'virtual-switch', label: 'VS-D', parentId: 'sw2' },
      { id: 'g0', kind: 'gpu', label: 'GPU 0' },
      { id: 'g1', kind: 'gpu', label: 'GPU 1' },
      { id: 'g2', kind: 'gpu', label: 'GPU 2' },
      { id: 'g3', kind: 'gpu', label: 'GPU 3' },
      { id: 'g4', kind: 'gpu', label: 'GPU 4' },
      { id: 'g5', kind: 'gpu', label: 'GPU 5' },
      { id: 'g6', kind: 'gpu', label: 'GPU 6' },
      { id: 'g7', kind: 'gpu', label: 'GPU 7' },
    ],
    edges: [
      { id: 'e-cpu-a', from: 'cpu', to: 'rcA', gen: 5, width: 16, role: 'host' },
      { id: 'e-cpu-b', from: 'cpu', to: 'rcB', gen: 5, width: 16, role: 'host' },
      { id: 'u-a', from: 'rcA', to: 'vsa', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 63 },
      { id: 'u-b', from: 'rcA', to: 'vsb', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 63 },
      { id: 'u-c', from: 'rcB', to: 'vsc', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 63 },
      { id: 'u-d', from: 'rcB', to: 'vsd', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 63 },
      { id: 'g-0', from: 'vsa', to: 'g0', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'g-1', from: 'vsa', to: 'g1', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'g-2', from: 'vsb', to: 'g2', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'g-3', from: 'vsb', to: 'g3', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'g-4', from: 'vsc', to: 'g4', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'g-5', from: 'vsc', to: 'g5', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'g-6', from: 'vsd', to: 'g6', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'g-7', from: 'vsd', to: 'g7', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
    ],
  },

  performance: { allToAllGBs: 254, p2pGBs: 56, latencyUs: 0.45 },
  stability: { collapse: false, xidErrors: [], notes: 'Microchip fabric — no posted-write collapse at 2 GPU/VS.' },
  software: {
    os: 'Ubuntu (EXT4, not ZFS)',
    engines: ['vLLM b12x', 'SGLang'],
    notes: 'bf16 KV mandatory on SM120 for GLM; b12x at low concurrency, cutlass at 4+.',
  },
  power: {
    psus: ['2× Super Flower Leadex 2800 W'],
    totalW: 3000,
    circuits: ['Dedicated 240 V / 30 A'],
    notes: 'Add2PSU sync; cards power-limited to 250 W (~4% single-stream cost).',
  },

  pros: [
    'Reuses a single-socket WRX90 workstation host — roughly $5–6k of switches instead of a dual-socket platform rebuild.',
    'Full Gen5 x16 to all eight cards; 254 GB/s all-to-all, the highest measured on Microchip.',
    'Single-socket NUMA lets the custom PCIe all-reduce kernel help even at 8 GPUs.',
    'Max-Q’s higher memory clock favors memory-bound decode; power-limiting barely costs anything.',
  ],
  cons: [
    'The 254 GB/s 2-VS layout is non-default — needs jumper + config-tool partitioning, confirmed with C-Payne.',
    'Host RAM (384 GB) is smaller than the ~460 GB NVFP4 model, so cold loads come off disk.',
    'Single-source topology (rtx6kpro) until independently confirmed.',
    'Eight 96 GB BARs on one socket make BIOS enumeration the real bring-up risk.',
  ],
  notes: [
    'GLM-5.2 numbers are interpolated for this board class, not yet measured on this exact config.',
    'No NVLink on any RTX PRO 6000 edition; NVSwitch is baseboard-only. The fabric is PCIe 5.0, permanent.',
  ],

  cableSchedule: [
    { id: 'u1', kind: 'uplink', from: 'WRX90 slot (root cplx A)', to: 'PM50100 #1 / VS-A', spec: 'MCIO host adapter, x16 Gen5' },
    { id: 'u2', kind: 'uplink', from: 'WRX90 slot (root cplx A)', to: 'PM50100 #1 / VS-B', spec: 'MCIO host adapter, x16 Gen5' },
    { id: 'u3', kind: 'uplink', from: 'WRX90 slot (root cplx B)', to: 'PM50100 #2 / VS-C', spec: 'MCIO host adapter, x16 Gen5' },
    { id: 'u4', kind: 'uplink', from: 'WRX90 slot (root cplx B)', to: 'PM50100 #2 / VS-D', spec: 'MCIO host adapter, x16 Gen5' },
    { id: 'd1', kind: 'gpu-link', from: 'VS-A / VS-B / VS-C / VS-D', to: 'GPU 0–7 device adapters', spec: '2× MCIO 8i per x16, short vertical runs' },
    { id: 'p1', kind: 'power', from: 'Leadex #1 / #2', to: 'GPU 0–7', spec: '8× native 12V-2×6, no pigtail (~42% at 250 W)' },
  ],
  validationLadder: [
    { rung: 1, name: 'Enumeration', target: 'All 8 at Gen5 x16', metric: 'nvidia-smi link gen/width' },
    { rung: 2, name: 'P2P / fabric', target: '~41 GB/s NCCL bus · 254 GB/s all-to-all · uniform ~55 GB/s P2P', metric: 'nvbandwidth · nccl-tests · p2pmark' },
    { rung: 3, name: 'Thermal', target: 'Intake ≤ 27 °C · GPU < 80 °C', metric: 'thermal probe, sustained load' },
    { rung: 4, name: 'Single-stream serving', target: '~78 tok/s no-MTP · ~130 with MTP · ~3k prefill', metric: 'decode / prefill benchmark' },
    { rung: 5, name: 'Concurrency sweep', target: 'Aggregate climbs toward ~962 tok/s @ 32 concurrent', metric: 'multi-stream validation' },
  ],
  biosChecklist: [
    { label: 'MMIOH window 2–4 TB per root complex', detail: 'fit eight 96 GB resizable BARs' },
    { label: 'Above 4G Decoding + Resizable BAR on' },
    { label: 'USB4 / Thunderbolt off, PCIe hotplug off', detail: 'both reserve vast address space' },
    { label: 'SR-IOV off', detail: 'compute-mode VFs wedge allocation' },
    { label: 'Two switches on different root complexes' },
    { label: 'pcie_aspm=off, iommu=pt, ACS ReqRedir off' },
  ],
  rackElevation: [
    { label: '10 GbE switch', kind: 'switch' },
    { label: 'Host-only UPS (~1.5 kVA)', kind: 'ups' },
    { label: 'Switched 240 V PDU', kind: 'pdu' },
    { label: 'Vented GPU shelf — 8× Max-Q', kind: 'gpu' },
    { label: 'Board / PSU tray — WRX90 + 2× PM50100 + 2× Leadex', kind: 'compute' },
    { label: 'Future NAS / expansion', kind: 'blank' },
  ],
  cooling: {
    stages: [
      { trigger: 'Baseline', action: 'Large cool room as heat sink + circulation fans; measure intake under sustained load' },
      { trigger: 'Intake > 27 °C in summer', action: 'Rear-exhaust duct (AC Infinity CLOUDLINE)' },
      { trigger: 'Duct insufficient', action: '1-ton mini-split (last resort)' },
    ],
    notes: '~3 kW ≈ 10,900 BTU/hr. 70+ dBA — behind a door.',
  },
  servingConfig: {
    engine: 'SGLang / vLLM b12x',
    flags: 'TP8 · bf16 KV · MTP:2–3 · NCCL_MIN_NCHANNELS=8',
    headline: [
      { metric: 'GLM-5.2 decode (no MTP)', value: '78.9 tok/s' },
      { metric: 'GLM-5.2 decode (MTP:3)', value: '130–140 tok/s' },
      { metric: 'Prefill @ 8k', value: '~3k tok/s' },
    ],
    notes: 'Model fits once at 768 GB — one shared TP8 instance, no replicas.',
  },
  riskRegister: [
    { risk: 'BIOS enumeration of eight big BARs on one socket', likelihood: 'high', impact: 'high', mitigation: 'Dry-fit on Gen4 risers before switch cabling; MMIOH/SR-IOV/USB4 checklist' },
    { risk: '2-VS partition is non-default', likelihood: 'med', impact: 'med', mitigation: 'Confirm method with C-Payne; 3-board hierarchy (196) as proven fallback' },
    { risk: 'Cooling equilibrium unproven', likelihood: 'med', impact: 'med', mitigation: 'Measure under sustained load; escalation path held in reserve' },
    { risk: 'Host RAM < model size', likelihood: 'low', impact: 'med', mitigation: 'Multithreaded loader; accept slower cold loads or add RAM' },
  ],
}
