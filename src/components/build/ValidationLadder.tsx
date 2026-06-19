import type { ValidationRung } from '../../types/build'

// The validation ladder is a genuine sequence — each rung gates the next — so
// the numbering encodes real order, not decoration.
export function ValidationLadder({ rungs }: { rungs: ValidationRung[] }) {
  return (
    <ol className="relative ml-3 border-l border-line-bright">
      {rungs.map((r) => (
        <li key={r.rung} className="relative mb-6 pl-7 last:mb-0">
          <span
            className="data absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border border-copper-dim bg-board text-[11px] text-copper-bright"
            aria-hidden
          >
            {r.rung}
          </span>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-sm font-semibold text-text">{r.name}</h3>
            {r.metric && <span className="data text-[11px] text-faint">{r.metric}</span>}
          </div>
          <p className="data mt-1 text-sm text-copper-bright">{r.target}</p>
        </li>
      ))}
    </ol>
  )
}
