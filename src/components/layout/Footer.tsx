export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Build and benchmark data is drawn from the community{' '}
          <a
            href="https://github.com/local-inference-lab/rtx6kpro"
            target="_blank"
            rel="noreferrer"
            className="text-copper transition-colors hover:text-copper-bright"
          >
            rtx6kpro
          </a>{' '}
          repo — itself synthesized from a practitioner Discord — and from build notes. Every record links its
          source. Credit to <span className="text-text">luke, Festr, orangezed, Grimulkan</span>, and the
          practitioners whose measurements this catalogs.
        </p>
        <p className="data mt-4 text-[11px] text-faint">
          Every build is a peer — same template, same prominence. No reference build.
        </p>
      </div>
    </footer>
  )
}
