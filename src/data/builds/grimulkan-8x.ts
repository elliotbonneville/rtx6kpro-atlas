import type { Build } from '../../types/build'

export const grimulkan8x: Build = {
  id: 'grimulkan-8x',
  name: 'Grimulkan · 8× Max-Q · 4-switch',
  practitioner: 'Grimulkan',
  summary:
    'Eight RTX PRO 6000 Max-Q on a single-socket Threadripper PRO behind four PCIe switches (two GPUs per switch) — tuned with NCCL_MIN_NCHANNELS=8, and a stepping-stone toward 16-GPU.',
  sourceUrl: 'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/topology.md',
  credit: 'Grimulkan — rtx6kpro',

  gpu: { model: 'RTX PRO 6000 Blackwell Max-Q', edition: 'Max-Q', count: 8, vramGB: 96 },
  cpu: { model: 'Threadripper PRO (single socket)', sockets: 1, vendor: 'AMD' },

  topology: {
    type: 'flat-4-switch',
    allToAllGBs: null,
    notes: ['Four PCIe switches, two GPUs each; ~39.4 GB/s NCCL all-reduce bus.'],
    nodes: [
      { id: 'cpu', kind: 'cpu', label: 'Threadripper PRO' },
      { id: 'sw1', kind: 'switch', label: 'PCIe switch 1' },
      { id: 'sw2', kind: 'switch', label: 'PCIe switch 2' },
      { id: 'sw3', kind: 'switch', label: 'PCIe switch 3' },
      { id: 'sw4', kind: 'switch', label: 'PCIe switch 4' },
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
      { id: 'u1', from: 'cpu', to: 'sw1', gen: 5, width: 16, role: 'uplink' },
      { id: 'u2', from: 'cpu', to: 'sw2', gen: 5, width: 16, role: 'uplink' },
      { id: 'u3', from: 'cpu', to: 'sw3', gen: 5, width: 16, role: 'uplink' },
      { id: 'u4', from: 'cpu', to: 'sw4', gen: 5, width: 16, role: 'uplink' },
      { id: 'a0', from: 'sw1', to: 'g0', gen: 5, width: 16, role: 'gpu' },
      { id: 'a1', from: 'sw1', to: 'g1', gen: 5, width: 16, role: 'gpu' },
      { id: 'a2', from: 'sw2', to: 'g2', gen: 5, width: 16, role: 'gpu' },
      { id: 'a3', from: 'sw2', to: 'g3', gen: 5, width: 16, role: 'gpu' },
      { id: 'a4', from: 'sw3', to: 'g4', gen: 5, width: 16, role: 'gpu' },
      { id: 'a5', from: 'sw3', to: 'g5', gen: 5, width: 16, role: 'gpu' },
      { id: 'a6', from: 'sw4', to: 'g6', gen: 5, width: 16, role: 'gpu' },
      { id: 'a7', from: 'sw4', to: 'g7', gen: 5, width: 16, role: 'gpu' },
    ],
  },

  performance: { p2pGBs: 54 },
  stability: { collapse: false, notes: '39.4 GB/s NCCL all-reduce bus.' },
  software: { notes: 'NCCL_MIN_NCHANNELS=8.' },

  pros: [
    'Single-socket 8-GPU with proven NCCL tuning.',
    'Layout extends toward 16-GPU.',
  ],
  cons: [
    'Limited public detail.',
    'Switch count high for 8 GPUs.',
  ],
  notes: ['A stepping-stone toward a 16-GPU build; the four-switch layout is what scales.'],
}
