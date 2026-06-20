import { Panel, SourceLink } from '../components/common/ui'

const REPO_URL = 'https://github.com/local-inference-lab/rtx6kpro'

export function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-12">
      <header className="max-w-2xl">
        <p className="eyebrow">About</p>
        <h1 className="nameplate mt-3 text-3xl leading-[0.95] text-text sm:text-4xl">
          A peer catalog of Blackwell fabrics
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          A reference catalog of RTX PRO 6000 Blackwell local-inference builds, shown as equal peers. There is no
          privileged reference design here. Every build is community-documented and renders through the same template
          so you can compare topology, trade-offs, and benchmarks directly rather than reading a vendor's preferred
          arrangement.
        </p>
      </header>

      <div className="mt-4 max-w-3xl">
        <Panel label="What it is">
          <p className="text-sm leading-relaxed text-muted">
            Each card holds the specs, the stated pros and cons, and the measured numbers for one build, with every
            build given the same prominence. The signature element is a data-driven SVG visualizer of each build's
            PCIe fabric: switches, root complexes, and links rendered from the same structured topology that drives
            the rest of the page. You read the fabric, not a marketing diagram.
          </p>
        </Panel>

        <Panel label="Why the fabric is the story">
          <p className="text-sm leading-relaxed text-muted">
            None of these builds have NVLink. The entire interconnect story is the copper PCIe fabric, which is why
            the catalog is organized around it. Topology decides where bandwidth holds and where it collapses: a
            flat pair of switches that routes cross-switch traffic back through the CPU, a chip split into virtual
            switches, a leaf-and-root hierarchy. The cautionary case is the Broadcom dual-virtual-switch
            arrangement, where posted-write arbitration collapses all-to-all bandwidth under load. The visualizer
            exists to make those collapse points legible before you buy the parts.
          </p>
        </Panel>

        <Panel label="Provenance and verification">
          <p className="text-sm leading-relaxed text-muted">
            The data is drawn from the community repository{' '}
            <SourceLink href={REPO_URL}>local-inference-lab/rtx6kpro</SourceLink>, itself synthesized from a
            practitioner Discord. Every build and every benchmark links its source, so any figure can be traced back
            and checked by hand. Attribution is not a courtesy here; it
            is a structural requirement, enforced at build time. A community record without a source URL fails the
            build. Read the numbers as community-reported rather than independently re-measured. They reflect what
            practitioners observed on their own hardware, under their own conditions, and the linked source is the
            place to confirm the details before you rely on them.
          </p>
        </Panel>

        <Panel label="Credits">
          <p className="text-sm leading-relaxed text-muted">
            This catalogs the work of luke, Festr, orangezed, Grimulkan, c-payne, and the other practitioners whose
            measurements made it possible. The builds are theirs. This site only arranges them.
          </p>
        </Panel>

        <div className="trace-rule my-8" />

        <p className="text-sm leading-relaxed text-muted">
          The peer-parity ethos is the whole point. No build is the reference and the rest the alternatives. They
          are siblings on one bench, described in one vocabulary, so the differences you see are the real ones.
        </p>
      </div>
    </main>
  )
}
