import type { Build } from '../../types/build'

export const asrockrackTurin16gpu: Build = {
  id: 'asrockrack-turin-16gpu',
  name: 'ASRockRack Turin · 16× · 4-switch',
  practitioner: 'rtx6kpro',
  summary:
    'Sixteen RTX PRO 6000 on a single-socket EPYC 9575F (Turin) ASRockRack GENOAD24QM32 server board, behind four Microchip Switchtec PM50100 switches, four GPUs each. Reaches 204 GB/s all-to-all — 91% of the theoretical PCIe ceiling — with no collapse.',
  sourceUrl:
    'https://github.com/local-inference-lab/rtx6kpro/blob/master/hardware/asrockrack-turin-cpayne-16gpu.md',
  credit: 'rtx6kpro',

  gpu: { model: 'RTX PRO 6000 Blackwell', count: 16, vramGB: 96 },
  cpu: { model: 'EPYC 9575F (Turin)', sockets: 1, vendor: 'AMD' },
  motherboard: 'ASRockRack GENOAD24QM32-2L2T/BCM',

  topology: {
    type: 'flat-4-switch',
    allToAllGBs: 204,
    notes: [
      'Four PM50100, four GPUs each; all Gen5 x16. 204 GB/s all-to-all = 91% of the 224 GB/s theoretical ceiling. 8-GPU subset 187–190 GB/s.',
    ],
    nodes: [
      { id: 'cpu', kind: 'cpu', label: 'EPYC 9575F (Turin)', meta: { lanes: '128 PCIe 5.0' } },
      { id: 'sw1', kind: 'switch', label: 'PM50100 switch 1', meta: { part: 'Switchtec PM50100' } },
      { id: 'sw2', kind: 'switch', label: 'PM50100 switch 2', meta: { part: 'Switchtec PM50100' } },
      { id: 'sw3', kind: 'switch', label: 'PM50100 switch 3', meta: { part: 'Switchtec PM50100' } },
      { id: 'sw4', kind: 'switch', label: 'PM50100 switch 4', meta: { part: 'Switchtec PM50100' } },
      { id: 'g0', kind: 'gpu', label: 'GPU 0' },
      { id: 'g1', kind: 'gpu', label: 'GPU 1' },
      { id: 'g2', kind: 'gpu', label: 'GPU 2' },
      { id: 'g3', kind: 'gpu', label: 'GPU 3' },
      { id: 'g4', kind: 'gpu', label: 'GPU 4' },
      { id: 'g5', kind: 'gpu', label: 'GPU 5' },
      { id: 'g6', kind: 'gpu', label: 'GPU 6' },
      { id: 'g7', kind: 'gpu', label: 'GPU 7' },
      { id: 'g8', kind: 'gpu', label: 'GPU 8' },
      { id: 'g9', kind: 'gpu', label: 'GPU 9' },
      { id: 'g10', kind: 'gpu', label: 'GPU 10' },
      { id: 'g11', kind: 'gpu', label: 'GPU 11' },
      { id: 'g12', kind: 'gpu', label: 'GPU 12' },
      { id: 'g13', kind: 'gpu', label: 'GPU 13' },
      { id: 'g14', kind: 'gpu', label: 'GPU 14' },
      { id: 'g15', kind: 'gpu', label: 'GPU 15' },
    ],
    edges: [
      { id: 'up1', from: 'cpu', to: 'sw1', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 56 },
      { id: 'up2', from: 'cpu', to: 'sw2', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 56 },
      { id: 'up3', from: 'cpu', to: 'sw3', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 56 },
      { id: 'up4', from: 'cpu', to: 'sw4', gen: 5, width: 16, role: 'uplink', bandwidthGBs: 56 },
      { id: 'a0', from: 'sw1', to: 'g0', gen: 5, width: 16, role: 'gpu' },
      { id: 'a1', from: 'sw1', to: 'g1', gen: 5, width: 16, role: 'gpu' },
      { id: 'a2', from: 'sw1', to: 'g2', gen: 5, width: 16, role: 'gpu' },
      { id: 'a3', from: 'sw1', to: 'g3', gen: 5, width: 16, role: 'gpu' },
      { id: 'a4', from: 'sw2', to: 'g4', gen: 5, width: 16, role: 'gpu' },
      { id: 'a5', from: 'sw2', to: 'g5', gen: 5, width: 16, role: 'gpu' },
      { id: 'a6', from: 'sw2', to: 'g6', gen: 5, width: 16, role: 'gpu' },
      { id: 'a7', from: 'sw2', to: 'g7', gen: 5, width: 16, role: 'gpu' },
      { id: 'a8', from: 'sw3', to: 'g8', gen: 5, width: 16, role: 'gpu' },
      { id: 'a9', from: 'sw3', to: 'g9', gen: 5, width: 16, role: 'gpu' },
      { id: 'a10', from: 'sw3', to: 'g10', gen: 5, width: 16, role: 'gpu' },
      { id: 'a11', from: 'sw3', to: 'g11', gen: 5, width: 16, role: 'gpu' },
      { id: 'a12', from: 'sw4', to: 'g12', gen: 5, width: 16, role: 'gpu' },
      { id: 'a13', from: 'sw4', to: 'g13', gen: 5, width: 16, role: 'gpu' },
      { id: 'a14', from: 'sw4', to: 'g14', gen: 5, width: 16, role: 'gpu' },
      { id: 'a15', from: 'sw4', to: 'g15', gen: 5, width: 16, role: 'gpu' },
    ],
  },

  performance: { allToAllGBs: 204, p2pGBs: 56 },
  stability: {
    collapse: false,
    notes: 'No catastrophic collapse; worst W/R asymmetry 0.43× (read-driven).',
  },
  software: { engines: ['vLLM', 'SGLang'] },

  pros: [
    '16 GPUs at 91% of theoretical all-to-all — the highest large-fabric efficiency in the catalog.',
    'Single-socket SP5 server board with robust enumeration.',
    'No collapse.',
  ],
  cons: [
    'A very large, expensive build.',
    'Single socket still carries the 16-card BAR address-space load.',
  ],
  notes: [
    'Shows the Microchip 4-switch fabric scaling cleanly to 16 GPUs where Broadcom collapses.',
  ],
}
