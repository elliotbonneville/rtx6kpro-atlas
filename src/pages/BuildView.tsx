import { Link, useParams } from 'react-router-dom'
import { builds, buildsById, defaultBuildId } from '../data'
import { BuildDetail } from '../components/build/BuildDetail'

export function BuildView() {
  const params = useParams()
  const id = params.id ?? defaultBuildId
  const build = buildsById[id]

  if (!build) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="nameplate mt-3 text-2xl text-text">No build by that id</h1>
        <Link to="/" className="data mt-5 inline-block text-sm text-copper hover:text-copper-bright">
          ← back to the catalog
        </Link>
      </main>
    )
  }

  return (
    <main>
      <div className="mx-auto max-w-6xl px-5 pt-6">
        <Link to="/" className="data text-[11px] uppercase tracking-[0.16em] text-muted hover:text-copper-bright">
          ← catalog
        </Link>

        {/* peer switcher — every build one tap away, none privileged */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {builds.map((b) => (
            <Link
              key={b.id}
              to={`/builds/${b.id}`}
              className={`data rounded-full border px-3 py-1 text-[11px] transition-colors ${
                b.id === id
                  ? 'border-copper-dim bg-surface text-copper-bright'
                  : 'border-line text-muted hover:border-copper-dim hover:text-text'
              }`}
            >
              {b.practitioner}
            </Link>
          ))}
        </div>
      </div>

      <BuildDetail build={build} />
    </main>
  )
}
