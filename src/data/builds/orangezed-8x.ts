import type { Build } from '../../types/build'

export const orangezed8x: Build = {
  id: 'orangezed-8x',
  name: 'orangezed · 8× Max-Q · dual-Genoa',
  practitioner: 'orangezed',
  summary:
    'Dual-socket EPYC Genoa with eight RTX PRO 6000 Max-Q direct-attached (no switches), four per socket — a switchless build whose cross-NUMA bandwidth is held back by under-populated (5-channel) RAM.',
  sourceUrl: 'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/topology.md',
  credit: 'orangezed — rtx6kpro',

  gpu: { model: 'RTX PRO 6000 Blackwell Max-Q', edition: 'Max-Q', count: 8, vramGB: 96 },
  cpu: { model: '2× EPYC Genoa (9004)', sockets: 2, vendor: 'AMD' },

  topology: {
    type: 'direct-attach',
    allToAllGBs: 64,
    notes: ['Cross-NUMA ~64 GB/s bidirectional; under-populated 5-channel RAM limits it.'],
    nodes: [
      { id: 'cpu0', kind: 'cpu', label: 'EPYC Genoa · socket 0' },
      { id: 'cpu1', kind: 'cpu', label: 'EPYC Genoa · socket 1' },
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
      { id: 'xgmi', from: 'cpu0', to: 'cpu1', gen: 5, width: 16, role: 'inter-switch', note: 'xGMI' },
      { id: 'h0', from: 'cpu0', to: 'g0', gen: 5, width: 16, role: 'host' },
      { id: 'h1', from: 'cpu0', to: 'g1', gen: 5, width: 16, role: 'host' },
      { id: 'h2', from: 'cpu0', to: 'g2', gen: 5, width: 16, role: 'host' },
      { id: 'h3', from: 'cpu0', to: 'g3', gen: 5, width: 16, role: 'host' },
      { id: 'h4', from: 'cpu1', to: 'g4', gen: 5, width: 16, role: 'host' },
      { id: 'h5', from: 'cpu1', to: 'g5', gen: 5, width: 16, role: 'host' },
      { id: 'h6', from: 'cpu1', to: 'g6', gen: 5, width: 16, role: 'host' },
      { id: 'h7', from: 'cpu1', to: 'g7', gen: 5, width: 16, role: 'host' },
    ],
  },

  performance: { allToAllGBs: 64, p2pGBs: 54 },
  stability: { collapse: false },
  software: { engines: ['vLLM', 'SGLang'] },

  pros: [
    'Switchless direct-attach — no PCIe switch sourcing or cabling.',
    'Dual-socket gives two native root complexes.',
  ],
  cons: [
    'Under-populated 5-channel RAM caps cross-NUMA bandwidth.',
    "Decode-only ~30–35 tok/s, below Festr's tuned dual-Turin.",
  ],
  notes: ['Cross-NUMA bandwidth is the bottleneck; fully populating the memory channels would lift it.'],
}
