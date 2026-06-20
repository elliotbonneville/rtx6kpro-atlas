import type { Build } from '../../types/build'

// The c-payne MEASURED 8-GPU 2-VS-per-chip rig — the actual reference
// measurement on a 7955WX + Server Edition cards that the 254 GB/s headline
// comes from.
export const cpayne2vs: Build = {
  id: 'cpayne-2vs',
  name: 'c-payne · 8× Server · 2-VS',
  practitioner: 'c-payne',
  summary:
    'The reference measurement behind the 2-VS-per-chip layout: eight RTX PRO 6000 Server Edition on a Threadripper PRO 7955WX (ASRock WRX90 WS EVO), two Microchip Switchtec PM50100 each partitioned into two virtual switches, the four uplinks spread across the four CPU IOD quadrants. The recommended V1 four-quadrant wiring hits 254 GB/s all-to-all — the highest measured on Microchip silicon.',
  sourceUrl:
    'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/wrx90-cpayne-8gpu-2vs-per-chip.md',
  credit: 'c-payne — rtx6kpro',

  gpu: { model: 'RTX PRO 6000 Blackwell Server Edition', edition: 'Server', count: 8, vramGB: 96 },
  cpu: { model: 'Threadripper PRO 7955WX', sockets: 1, vendor: 'AMD' },
  motherboard: 'ASRock WRX90 WS EVO',

  topology: {
    type: '2-vs-per-chip',
    allToAllGBs: 254,
    notes: [
      'Each PM50100 is partitioned into two virtual switches (4 logical switches, 4 uplinks total).',
      'Upstream: 2× x16 per chip (x32) — four x16 host uplinks total. That doubled upstream is what lifts all-to-all to 254 vs the flat layout’s single-x16-per-chip 162.',
      'V1 (recommended) lands each VS on a separate CPU IOD quadrant Q0–Q3 — 254 GB/s all-to-all. V2 (Q0+Q3 split) drops to 225; V3 (concentrated Q0/Q3) to 213.',
      'Single-pair P2P writes measure 56.3 GB/s on every variant; no collapse on any wiring.',
    ],
    nodes: [
      { id: 'cpu', kind: 'cpu', label: 'Threadripper PRO 7955WX', meta: { quadrants: 'Q0–Q3 (1 IOD)' } },
      { id: 'rcA', kind: 'root-complex', label: 'Root complex Q0', parentId: 'cpu' },
      { id: 'rcB', kind: 'root-complex', label: 'Root complex Q1', parentId: 'cpu' },
      { id: 'rcC', kind: 'root-complex', label: 'Root complex Q2', parentId: 'cpu' },
      { id: 'rcD', kind: 'root-complex', label: 'Root complex Q3', parentId: 'cpu' },
      { id: 'sw1', kind: 'switch', label: 'PM50100 #1', meta: { part: 'Microchip Switchtec PM50100', pci: '1f18:0101' } },
      { id: 'sw2', kind: 'switch', label: 'PM50100 #2', meta: { part: 'Microchip Switchtec PM50100', pci: '1f18:0101' } },
      { id: 'vsa', kind: 'virtual-switch', label: 'VS-1', parentId: 'sw1' },
      { id: 'vsb', kind: 'virtual-switch', label: 'VS-3', parentId: 'sw1' },
      { id: 'vsc', kind: 'virtual-switch', label: 'VS-2', parentId: 'sw2' },
      { id: 'vsd', kind: 'virtual-switch', label: 'VS-4', parentId: 'sw2' },
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
      { id: 'e-cpu-c', from: 'cpu', to: 'rcC', gen: 5, width: 16, role: 'host' },
      { id: 'e-cpu-d', from: 'cpu', to: 'rcD', gen: 5, width: 16, role: 'host' },
      { id: 'u-a', from: 'rcA', to: 'vsa', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 63 },
      { id: 'u-b', from: 'rcC', to: 'vsb', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 63 },
      { id: 'u-c', from: 'rcB', to: 'vsc', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 63 },
      { id: 'u-d', from: 'rcD', to: 'vsd', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 63 },
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
  stability: {
    collapse: false,
    xidErrors: [],
    notes:
      'No posted-write arbitration collapse on any wiring — the AMD/Broadcom collapse does not activate on Microchip + Threadripper PRO at 2 GPU/VS. V1 254, V2 225 (−11%), V3 213 (−16%) all-to-all.',
  },
  software: {
    os: 'Ubuntu 24.04 (kernel 6.18.24)',
    driver: '595.58.03',
    cuda: '13.2',
    notes: 'IOMMU off, ACS Request-Redirect disabled.',
  },

  pros: [
    'Highest measured all-to-all on Microchip silicon — 254 GB/s on the recommended V1 four-quadrant wiring.',
    'Collapse-immune across every wiring variant tested; uniform 56.3 GB/s single-pair P2P.',
    'Reuses the consumer WRX90 board — two switches instead of a server-platform rebuild.',
  ],
  cons: [
    'The 254 GB/s V1 layout is non-default — needs the right quadrant-aligned uplink wiring; V2/V3 give up 11–16%.',
    'Eight 96 GB BARs on a single 7955WX socket make BIOS enumeration the bring-up risk.',
    'Two physical switches plus virtual-switch partitioning add configuration surface over a flat layout.',
  ],
  notes: [
    'This is the reference measurement the 2-VS headline is quoted from — Server Edition cards, not Max-Q.',
    'V1 also keeps memory bandwidth NUMA-aligned across all four CPU quadrants; V3 wins only the 4-to-1 stress pattern (112 GB/s).',
  ],
}
