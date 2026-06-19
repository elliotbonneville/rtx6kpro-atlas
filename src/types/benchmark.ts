export type Quant = 'FP8' | 'NVFP4' | 'INT4' | 'AWQ' | 'GGUF'
export type Engine = 'vLLM' | 'SGLang' | 'llama.cpp'
export type MetricType = 'single-stream-decode' | 'batched' | 'prefill'

export interface Benchmark {
  id: string
  buildId?: string | null      // set when tied to a documented build; null for generic-hardware records
  hardware: string             // e.g. '8× RTX PRO 6000'
  model: string
  modelSizeB?: number | null
  quant: Quant
  engine: Engine
  parallelism?: string | null
  gpuCount: number
  metricType: MetricType
  contextTokens?: number | null
  mtp?: boolean | null
  throughput?: number | null   // tok/s (per-stream for decode/prefill, aggregate for batched)
  sourceUrl?: string | null
  credit?: string | null
  notes?: string | null
}
