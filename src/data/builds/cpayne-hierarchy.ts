import type { Build } from '../../types/build'

// The c-payne MEASURED 3-switch hierarchy on a 7955WX + Server Edition cards.
// Same topology *type* as luke's rig, but a distinct measured build: ASRock
// board, Server Edition GPUs, no custom kernel — the canonical hierarchy
// numbers (196 all-to-all, 41.1 GB/s NCCL bus) come from this measurement.
export const cpayneHierarchy: Build = {
  id: 'cpayne-hierarchy',
  name: 'c-payne · 8× Server · 3-switch',
  practitioner: 'c-payne',
  summary:
    'Eight RTX PRO 6000 Server Edition on a single-socket Threadripper PRO 7955WX (ASRock WRX90 WS EVO) behind three Microchip Switchtec PM50100 in a one-root / two-leaf hierarchy, four GPUs per leaf. Inter-leaf traffic stays inside the switch fabric and never touches the CPU root ports — 196 GB/s all-to-all and a 41.1 GB/s NCCL all-reduce bus, the highest measured in the community.',
  sourceUrl:
    'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/wrx90-cpayne-microchip-switches.md',
  credit: 'c-payne — rtx6kpro',

  gpu: { model: 'RTX PRO 6000 Blackwell Server Edition', edition: 'Server', count: 8, vramGB: 96 },
  cpu: { model: 'Threadripper PRO 7955WX', sockets: 1, vendor: 'AMD' },
  motherboard: 'ASRock WRX90 WS EVO',

  topology: {
    type: 'hierarchy-3-switch',
    rootSwitchId: 'root',
    allToAllGBs: 196,
    notes: [
      'One root PM50100 with two leaf PM50100; four GPUs per leaf. Inter-leaf traffic is routed by the root switch, so it never hits the CPU root ports.',
      'Uniform bandwidth across every topology tier (PIX, PXB, NODE) — single NUMA node eliminates cross-NUMA penalties.',
      'Custom PCIe one-shot all-reduce crosses over NCCL at 120 KB (1.4–4.3× advantage for 1–120 KB messages).',
    ],
    nodes: [
      { id: 'cpu', kind: 'cpu', label: 'Threadripper PRO 7955WX', meta: { numa: '1 NUMA node' } },
      { id: 'root', kind: 'switch', label: 'PM50100 root', meta: { part: 'Microchip Switchtec PM50100', pci: '1f18:0101' } },
      { id: 'l1', kind: 'switch', label: 'PM50100 leaf 1', meta: { part: 'Microchip Switchtec PM50100' } },
      { id: 'l2', kind: 'switch', label: 'PM50100 leaf 2', meta: { part: 'Microchip Switchtec PM50100' } },
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
      { id: 'up', from: 'cpu', to: 'root', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 63 },
      { id: 'r1', from: 'root', to: 'l1', gen: 5, width: 16, role: 'inter-switch', bandwidthGBs: 55 },
      { id: 'r2', from: 'root', to: 'l2', gen: 5, width: 16, role: 'inter-switch', bandwidthGBs: 55 },
      { id: 'a0', from: 'l1', to: 'g0', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'a1', from: 'l1', to: 'g1', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'a2', from: 'l1', to: 'g2', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'a3', from: 'l1', to: 'g3', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'a4', from: 'l2', to: 'g4', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'a5', from: 'l2', to: 'g5', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'a6', from: 'l2', to: 'g6', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
      { id: 'a7', from: 'l2', to: 'g7', gen: 5, width: 16, role: 'gpu', bandwidthGBs: 56 },
    ],
  },

  performance: { allToAllGBs: 196, p2pGBs: 56, latencyUs: 0.45 },
  stability: {
    collapse: false,
    xidErrors: [],
    notes:
      'No posted-write arbitration collapse under any flow pattern; uplink-degradation test confirms all traffic stays inside the switch fabric. 41.1 GB/s NCCL all-reduce bus — highest in the community.',
  },
  software: {
    os: 'Linux 6.17.0-19-generic',
    driver: '595.45.04',
    cuda: '13.2',
    notes: 'Single NUMA node eliminates cross-NUMA penalties.',
  },

  pros: [
    'Highest NCCL all-reduce bus in the community at 41.1 GB/s (tuned channels) — the hierarchy keeps inter-leaf traffic off the CPU root ports.',
    'No collapse under any flow pattern; uniform bandwidth across all topology tiers.',
    'Proven on the consumer WRX90 board — the canonical 196 GB/s hierarchy measurement.',
  ],
  cons: [
    'Three switches for less all-to-all bandwidth than a 2-VS layout (196 vs 254).',
    'Single shared CPU uplink to the root switch caps host-RAM DMA versus a multi-uplink layout.',
    'Eight 96 GB BARs on a single 7955WX socket keep BIOS enumeration the bring-up risk.',
  ],
  notes: [
    'Same hierarchy topology *type* as luke’s rig, but a distinct measured build: Server Edition cards on ASRock, no custom-kernel dependency for the headline fabric numbers.',
    'Single-flow latency 0.45–0.53 µs; concurrent 8-GPU effective latency 6.56 µs.',
  ],
}
