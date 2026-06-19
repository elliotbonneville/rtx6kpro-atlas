export type Quant = 'FP8' | 'NVFP4' | 'INT4' | 'AWQ' | 'GGUF'
export type Engine = 'vLLM' | 'SGLang' | 'llama.cpp'
export type MetricType = 'single-stream-decode' | 'batched' | 'prefill'

export interface Benchmark {
  id: string
  /** FK -> Build.id */
  buildId: string
  model: string
  modelSizeB?: number | null
  quant: Quant
  engine: Engine
  parallelism?: string | null // e.g. "TP8", "EP8 + DCP8"
  gpuCount: number
  metricType: MetricType
  contextTokens?: number | null
  mtp?: boolean | null
  /** tok/s (per-stream for decode/prefill; aggregate for batched) */
  throughput?: number | null
  /** REQUIRED for community records. */
  sourceUrl?: string | null
  credit?: string | null
  notes?: string | null
}
