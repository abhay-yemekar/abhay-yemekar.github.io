import type { DiagramNode, DiagramSpec } from '../data/caseStudies'

const BOX_W = 210
const BOX_H = 58

const KIND_LABEL: Record<DiagramNode['kind'], string> = {
  llm: 'LLM step',
  code: 'Code',
  data: 'Data',
}

/**
 * An architecture diagram with one grammar across every case study: dashed =
 * LLM step, solid = deterministic code, pill = data, amber = the trust path.
 *
 * The SVG only shows from 1280px: at 12.4 viewBox units the smallest labels
 * render at 13.07px there, and would drop under 13px on anything narrower.
 * Below that, the same nodes render as a stacked HTML list instead. Both are in
 * the prerendered HTML; CSS shows one. The hidden one is display:none, so
 * assistive tech meets the content once.
 */
export function Diagram({ spec, caption }: { spec: DiagramSpec; caption: string }) {
  const byId = new Map(spec.nodes.map((node) => [node.id, node]))
  const titleId = `dg-${spec.title.replace(/\W+/g, '-').toLowerCase()}`

  return (
    <figure className="m-0 rounded-card border border-border bg-bg-elev p-5 lg:p-6">
      <svg
        viewBox={`0 0 ${spec.width} ${spec.height}`}
        role="img"
        aria-labelledby={`${titleId}-t ${titleId}-d`}
        className="hidden h-auto w-full xl:block"
      >
        <title id={`${titleId}-t`}>{spec.title}</title>
        <desc id={`${titleId}-d`}>{spec.description}</desc>
        <defs>
          <marker id={`${titleId}-ar`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 8 4 0 8z" className="fill-fg-muted" />
          </marker>
          <marker id={`${titleId}-arh`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 8 4 0 8z" className="fill-mark" />
          </marker>
        </defs>

        {spec.edges.map((edge) => (
          <g key={edge.d}>
            <path
              d={edge.d}
              fill="none"
              strokeWidth={edge.hot ? 2.25 : 1.25}
              className={edge.hot ? 'stroke-mark' : 'stroke-fg-muted'}
              markerEnd={`url(#${titleId}-${edge.hot ? 'arh' : 'ar'})`}
            />
            {edge.label && (
              <text x={edge.label.x} y={edge.label.y} className="fill-fg-subtle font-mono text-[12.4px]">
                {edge.label.text}
              </text>
            )}
          </g>
        ))}

        {spec.nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={BOX_W}
              height={BOX_H}
              rx={node.kind === 'data' ? BOX_H / 2 : 3}
              strokeWidth={node.hot ? 2 : 1.25}
              strokeDasharray={node.kind === 'llm' ? '5 4' : node.warn ? '2 3' : undefined}
              className={node.hot ? 'fill-wash stroke-mark' : node.warn ? 'fill-bg stroke-fg-subtle' : 'fill-bg stroke-fg'}
            />
            <text x={node.x + BOX_W / 2} y={node.y + 26} textAnchor="middle" className="fill-fg text-[17px] font-medium">
              {node.title}
            </text>
            {node.sub && (
              <text x={node.x + BOX_W / 2} y={node.y + 45} textAnchor="middle" className={`${node.hot ? 'fill-fg-muted' : 'fill-fg-subtle'} font-mono text-[12.4px]`}>
                {node.sub}
              </text>
            )}
          </g>
        ))}
      </svg>

      <ol className="m-0 list-none space-y-2 p-0 xl:hidden" aria-label={spec.title}>
        {spec.order.map((id, i) => {
          const node = byId.get(id)
          if (!node) return null
          const branch = spec.branches?.[id]
          return (
            <li key={id}>
              <div
                className={`rounded-sm border px-4 py-3 ${node.kind === 'llm' ? 'border-dashed border-fg' : node.hot ? 'border-2 border-mark bg-wash' : 'border-fg'} ${node.kind === 'data' ? 'rounded-full' : ''}`}
              >
                <p className={`u-meta m-0 ${node.hot ? 'text-fg-muted' : 'text-fg-subtle'}`}>
                  {String(i + 1).padStart(2, '0')} · {KIND_LABEL[node.kind]}
                </p>
                <p className="m-0 text-small font-medium">{node.title}</p>
                {node.sub && <p className={`u-meta m-0 ${node.hot ? 'text-fg-muted' : 'text-fg-subtle'}`}>{node.sub}</p>}
              </div>
              {branch && <p className="u-meta mt-2 mb-0 border-l-2 border-dotted border-fg-subtle pl-3 text-fg-muted">{branch}</p>}
            </li>
          )
        })}
      </ol>

      <figcaption className="u-meta mt-4 text-fg-subtle">
        <span className="mr-4 hidden xl:inline">
          dashed = LLM step · solid = code · pill = data · amber = evidence path
        </span>
        {caption}
      </figcaption>
    </figure>
  )
}
