import { Link, NavLink } from 'react-router-dom'

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-board/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="nameplate text-base text-text transition-colors group-hover:text-copper-bright">
            Blackwell Atlas
          </span>
          <span className="data hidden text-[10px] text-faint sm:inline">/ pcie fabric catalog</span>
        </Link>
        <nav className="flex items-center gap-5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `data text-xs uppercase tracking-[0.16em] transition-colors hover:text-copper-bright ${
                isActive ? 'text-copper-bright' : 'text-muted'
              }`
            }
          >
            Catalog
          </NavLink>
          <a
            href="https://github.com/local-inference-lab/rtx6kpro"
            target="_blank"
            rel="noreferrer"
            className="data text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-copper-bright"
          >
            Source ↗
          </a>
        </nav>
      </div>
    </header>
  )
}
