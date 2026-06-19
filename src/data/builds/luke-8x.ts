import type { Build } from '../../types/build'

export const luke8x: Build = {
  id: 'luke-8x-hierarchy',
  name: 'luke · 8× Max-Q · 3-switch',
  practitioner: 'luke',
  summary:
    'Eight RTX PRO 6000 Max-Q on a single-socket Threadripper PRO, three C-Payne PM50100 in a 2-leaf / 1-root hierarchy, GDDR7 overclocked. The reference single-socket build and author of the custom PCIe one-shot all-reduce kernel.',
  sourceUrl: 'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/gpu-configs.md',
  credit: 'luke (lukealonso) — rtx6kpro',

  gpu: { model: 'RTX PRO 6000 Blackwell Max-Q', edition: 'Max-Q', count: 8, vramGB: 96, powerLimitW: 300 },
  cpu: { model: 'Threadripper PRO (single socket)', sockets: 1, vendor: 'AMD' },
  motherboard: 'ASUS WRX90E',

  topology: {
    type: 'hierarchy-3-switch',
    rootSwitchId: 'root',
    allToAllGBs: 192,
    notes: ['Leaf switches uplink to a root switch, so inter-leaf traffic never touches the CPU root ports.'],
    nodes: [
      { id: 'cpu', kind: 'cpu', label: 'Threadripper PRO', meta: { lanes: '128 PCIe 5.0' } },
      { id: 'root', kind: 'switch', label: 'PM50100 root', meta: { part: 'Switchtec PM50100' } },
      { id: 'l1', kind: 'switch', label: 'PM50100 leaf 1' },
      { id: 'l2', kind: 'switch', label: 'PM50100 leaf 2' },
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
      { id: 'r1', from: 'root', to: 'l1', gen: 5, width: 16, role: 'inter-switch', bandwidthGBs: 56 },
      { id: 'r2', from: 'root', to: 'l2', gen: 5, width: 16, role: 'inter-switch', bandwidthGBs: 56 },
      { id: 'a0', from: 'l1', to: 'g0', gen: 5, width: 16, role: 'gpu' },
      { id: 'a1', from: 'l1', to: 'g1', gen: 5, width: 16, role: 'gpu' },
      { id: 'a2', from: 'l1', to: 'g2', gen: 5, width: 16, role: 'gpu' },
      { id: 'a3', from: 'l1', to: 'g3', gen: 5, width: 16, role: 'gpu' },
      { id: 'a4', from: 'l2', to: 'g4', gen: 5, width: 16, role: 'gpu' },
      { id: 'a5', from: 'l2', to: 'g5', gen: 5, width: 16, role: 'gpu' },
      { id: 'a6', from: 'l2', to: 'g6', gen: 5, width: 16, role: 'gpu' },
      { id: 'a7', from: 'l2', to: 'g7', gen: 5, width: 16, role: 'gpu' },
    ],
  },

  performance: { allToAllGBs: 192, p2pGBs: 56, latencyUs: 0.5 },
  stability: { collapse: false, notes: 'No collapse under any flow pattern; 41.1 GB/s NCCL all-reduce bus — highest in the community.' },
  software: { engines: ['SGLang (custom fork)', 'vLLM b12x'], notes: 'Custom PCIe one-shot all-reduce (+7–11% at low concurrency, single-socket only). GDDR7 +4000 via pynvml.' },
  power: { psus: ['single-PSU + power-limited'], notes: 'Open-air mining chassis.' },

  pros: [
    'Proven, well-documented single-socket build — the closest reference for a Threadripper + switch rig.',
    'Hierarchy keeps inter-leaf GPU traffic off the CPU root ports.',
    'Author of the custom all-reduce kernel; reached ~350 tok/s on Qwen3.5 (heavily patched).',
  ],
  cons: [
    'Three switches (one more than a 2-VS layout) for less all-to-all bandwidth (192 vs 254).',
    'Open-air chassis — not enclosed; the headline tok/s needs the custom kernel + GDDR7 OC.',
  ],
  notes: ['Single-socket NUMA is what lets the custom all-reduce help at 8 GPUs (it loses on dual-socket).'],
}
