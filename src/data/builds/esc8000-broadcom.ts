import type { Build } from '../../types/build'

export const esc8000Broadcom: Build = {
  id: 'esc8000-broadcom',
  name: 'ASUS ESC8000 · Broadcom',
  practitioner: 'voipmonitor',
  summary:
    'Eight RTX PRO 6000 Server Edition in an ASUS ESC8000A-E13P, wired through two Broadcom PEX890xx switches each split into two virtual switches. A cautionary build: the Broadcom fabric suffers a posted-write arbitration collapse that drops bandwidth 93%.',
  sourceUrl: 'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/asus-esc8000a-e13p-broadcom-switches.md',
  credit: 'voipmonitor — rtx6kpro',

  gpu: { model: 'RTX PRO 6000 Blackwell Server Edition', edition: 'Server', count: 8, vramGB: 96 },
  cpu: { model: '2× EPYC 9575F (Turin)', sockets: 2, vendor: 'AMD' },
  motherboard: 'ASUS ESC8000A-E13P (K15PG-D24)',

  topology: {
    type: 'broadcom-dual-vs',
    allToAllGBs: null,
    notes: [
      'Each Broadcom PEX890xx split into two virtual switches, two GPUs each, no root switch.',
      'Posted-write collapse: bandwidth drops 37 → 2.7 GB/s when two GPUs on a VS write to different CPU roots. No driver/IOMMU fix.',
    ],
    nodes: [
      { id: 'cpu0', kind: 'cpu', label: 'EPYC 9575F · socket 0' },
      { id: 'cpu1', kind: 'cpu', label: 'EPYC 9575F · socket 1' },
      { id: 'sw1', kind: 'switch', label: 'PEX890xx #0', meta: { part: 'Broadcom PEX890xx' } },
      { id: 'sw2', kind: 'switch', label: 'PEX890xx #1', meta: { part: 'Broadcom PEX890xx' } },
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
      { id: 'u-a', from: 'cpu0', to: 'vsa', gen: 5, width: 16, role: 'uplink', collapseProne: true, note: 'posted-write collapse 37 → 2.7 GB/s' },
      { id: 'u-b', from: 'cpu0', to: 'vsb', gen: 5, width: 16, role: 'uplink', collapseProne: true, note: 'posted-write collapse 37 → 2.7 GB/s' },
      { id: 'u-c', from: 'cpu1', to: 'vsc', gen: 5, width: 16, role: 'uplink', collapseProne: true, note: 'posted-write collapse 37 → 2.7 GB/s' },
      { id: 'u-d', from: 'cpu1', to: 'vsd', gen: 5, width: 16, role: 'uplink', collapseProne: true, note: 'posted-write collapse 37 → 2.7 GB/s' },
      { id: 'g-0', from: 'vsa', to: 'g0', gen: 5, width: 16, role: 'gpu' },
      { id: 'g-1', from: 'vsa', to: 'g1', gen: 5, width: 16, role: 'gpu' },
      { id: 'g-2', from: 'vsb', to: 'g2', gen: 5, width: 16, role: 'gpu' },
      { id: 'g-3', from: 'vsb', to: 'g3', gen: 5, width: 16, role: 'gpu' },
      { id: 'g-4', from: 'vsc', to: 'g4', gen: 5, width: 16, role: 'gpu' },
      { id: 'g-5', from: 'vsc', to: 'g5', gen: 5, width: 16, role: 'gpu' },
      { id: 'g-6', from: 'vsd', to: 'g6', gen: 5, width: 16, role: 'gpu' },
      { id: 'g-7', from: 'vsd', to: 'g7', gen: 5, width: 16, role: 'gpu' },
    ],
  },

  performance: { p2pGBs: 51, latencyUs: 0.72 },
  stability: { collapse: true, collapsePct: 93, notes: 'Posted-write arbitration collapse on Broadcom — 37 → 2.7 GB/s. Reads unaffected (~51 GB/s).' },
  software: { engines: ['vLLM', 'SGLang'] },

  pros: [
    'Off-the-shelf 8-GPU server — every card at x16, no DIY switch wiring.',
    'Dual-socket EPYC with ample lanes and memory channels.',
  ],
  cons: [
    'Broadcom posted-write collapse drops fabric bandwidth 93% under common all-reduce patterns — no fix.',
    'Proprietary server platform; ~$13k complete system.',
  ],
  notes: ['Why sincerely’s build avoids Broadcom baseboards entirely and uses Microchip switches.'],
}
