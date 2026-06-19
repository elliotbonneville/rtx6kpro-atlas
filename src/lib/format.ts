// Null-tolerant formatting so sparse and rich build records render the same way.

export const EM_DASH = '—'

export function dash<T>(v: T | null | undefined, fmt?: (v: T) => string): string {
  if (v === null || v === undefined || v === '') return EM_DASH
  return fmt ? fmt(v) : String(v)
}

export function gbs(v: number | null | undefined): string {
  return dash(v, (n) => `${n} GB/s`)
}

export function usd(v: number | null | undefined): string {
  return dash(v, (n) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`,
  )
}

export function watts(v: number | null | undefined): string {
  return dash(v, (n) => `${n} W`)
}

export function toks(v: number | null | undefined): string {
  return dash(v, (n) => `${n} tok/s`)
}

export function ctx(v: number | null | undefined): string {
  return dash(v, (n) => (n >= 1000 ? `${Math.round(n / 1000)}K` : String(n)))
}

export function lane(width: number): string {
  return `x${width}`
}
