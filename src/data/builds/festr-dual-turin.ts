import type { Build } from '../../types/build'

export const festrDualTurin: Build = {
  id: 'festr-dual-turin',
  name: 'Festr · 8× Server · dual-EPYC',
  practitioner: 'Festr',
  summary:
    'Eight RTX PRO 6000 Server Edition direct-attached to a dual-socket EPYC Turin board — no PCIe switches, four GPUs per socket bridged by xGMI. The switchless reference, and the rig that posted the headline GLM-5.2 MTP numbers.',
  sourceUrl: 'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/gpu-configs.md',
  credit: 'Festr — rtx6kpro',

  gpu: { model: 'RTX PRO 6000 Blackwell Server Edition', edition: 'Server', count: 8, vramGB: 96, powerLimitW: 600 },
  cpu: { model: '2× EPYC 9575F (Turin)', sockets: 2, vendor: 'AMD' },
  motherboard: 'K15PG-D24',

  topology: {
    type: 'direct-attach',
    allToAllGBs: 173,
    notes: ['No switches — GPUs attach straight to CPU root ports; cross-socket traffic rides 3× xGMI links (~192 GB/s fabric).'],
    nodes: [
      { id: 'cpu0', kind: 'cpu', label: 'EPYC 9575F · socket 0' },
      { id: 'cpu1', kind: 'cpu', label: 'EPYC 9575F · socket 1' },
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
      { id: 'xgmi', from: 'cpu0', to: 'cpu1', gen: 5, width: 16, role: 'inter-switch', note: 'xGMI ~192 GB/s' },
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

  performance: { allToAllGBs: 173, p2pGBs: 53 },
  stability: { collapse: false, notes: 'No collapse — AMD xGMI path. NCCL bus 37.6 GB/s tuned (22.2 untuned).' },
  software: { engines: ['SGLang', 'vLLM b12x'], notes: 'Authors the production Docker images and NVFP4 quants. ForceP2P modprobe required for direct-attach P2P.' },
  power: { psus: ['server PSUs'], notes: 'Server Edition cards at up to 600 W.' },

  pros: [
    'No switches at all — ~160 dual-socket lanes direct-attach eight cards; dodges switch sourcing + cabling.',
    'Two sockets give two native root complexes, easing the eight-BAR address-space problem.',
    'Posted the best GLM-5.2 MTP:3 decode (130–140 tok/s).',
  ],
  cons: [
    'Dual-socket Infinity-Fabric barrier makes the custom all-reduce kernel lose to stock NCCL.',
    'A from-scratch server platform — strands a single-socket workstation host if you already own one.',
    'Server Edition at 600 W runs hotter and louder than power-limited Max-Q.',
  ],
  notes: ['The 130–140 figure pairs Server Edition cards with the MTP fix — not purely the platform.'],
}
