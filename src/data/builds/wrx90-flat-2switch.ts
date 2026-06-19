import type { Build } from '../../types/build'

export const wrx90Flat2Switch: Build = {
  id: 'wrx90-flat-2switch',
  name: 'WRX90 · flat 2-switch',
  practitioner: 'c-payne',
  summary:
    'Eight Server Edition cards on a single-socket Threadripper PRO 7955WX (ASRock WRX90 WS EVO) behind two Microchip Switchtec switches in the plug-and-play flat layout — four GPUs per switch, no root switch. Cross-switch traffic routes through the CPU, capping all-to-all at 162 GB/s.',
  sourceUrl: 'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/wrx90-cpayne-2switch-flat.md',
  credit: 'c-payne — rtx6kpro',

  gpu: { model: 'RTX PRO 6000 Blackwell Server Edition', edition: 'Server', count: 8, vramGB: 96 },
  cpu: { model: 'Threadripper PRO 7955WX', sockets: 1, vendor: 'AMD' },
  motherboard: 'ASRock WRX90 WS EVO',

  topology: {
    type: 'flat-2-switch',
    allToAllGBs: 162,
    notes: [
      'Default 1-up/5-down switch config — plug-and-play. Cross-switch traffic funnels through the two CPU uplinks.',
    ],
    nodes: [
      { id: 'cpu', kind: 'cpu', label: 'Threadripper PRO 7955WX' },
      { id: 'sw1', kind: 'switch', label: 'Switchtec PM50100 #1' },
      { id: 'sw2', kind: 'switch', label: 'Switchtec PM50100 #2' },
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
      { id: 'up1', from: 'cpu', to: 'sw1', gen: 5, width: 16, role: 'uplink' },
      { id: 'up2', from: 'cpu', to: 'sw2', gen: 5, width: 16, role: 'uplink' },
      { id: 'a0', from: 'sw1', to: 'g0', gen: 5, width: 16, role: 'gpu' },
      { id: 'a1', from: 'sw1', to: 'g1', gen: 5, width: 16, role: 'gpu' },
      { id: 'a2', from: 'sw1', to: 'g2', gen: 5, width: 16, role: 'gpu' },
      { id: 'a3', from: 'sw1', to: 'g3', gen: 5, width: 16, role: 'gpu' },
      { id: 'a4', from: 'sw2', to: 'g4', gen: 5, width: 16, role: 'gpu' },
      { id: 'a5', from: 'sw2', to: 'g5', gen: 5, width: 16, role: 'gpu' },
      { id: 'a6', from: 'sw2', to: 'g6', gen: 5, width: 16, role: 'gpu' },
      { id: 'a7', from: 'sw2', to: 'g7', gen: 5, width: 16, role: 'gpu' },
    ],
  },

  performance: { allToAllGBs: 162, p2pGBs: 51, latencyUs: 1.42 },
  stability: { collapse: false, notes: 'Microchip fabric — no posted-write collapse.' },
  software: { engines: ['vLLM', 'SGLang'] },

  pros: [
    'Simplest 2-switch layout, plug-and-play (no virtual-switch partitioning).',
    'No collapse.',
    'Bidirectional P2P ~100 GB/s.',
  ],
  cons: [
    '162 GB/s all-to-all — cross-switch bottlenecks through two uplinks.',
    '~36% below the 2-VS layout (254) on the same two chips.',
  ],
  notes: [
    'Same two PM50100s as the 2-VS layout, just un-partitioned — the bandwidth gap (162 vs 254) is the cost of staying default.',
  ],
}
