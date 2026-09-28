import { scalePoint } from 'd3-scale'

/**
 * Decorative neural-network / data-stream visual (docs/ui-spec.md §5.3).
 *
 * Geometry (layer + node positions and edges) is computed once with D3.
 *
 * Animation: each node/edge runs a CSS keyframe "fire" (`nn-node-fire` /
 * `nn-edge-fire`, defined in tailwind.config.ts) that rests at a faint opacity
 * for most of its cycle and spikes briefly (~6%) before decaying — neurons
 * firing one at a time rather than pulsing in lockstep. Every element gets its
 * OWN duration and a NEGATIVE animation-delay so they are desynchronised from
 * the first frame and drift further apart over time (different durations never
 * re-align). Both values come from a seeded mulberry32 PRNG, so the pattern is
 * identical on every load and every machine — no `Math.random()` in render,
 * which keeps it safe under React StrictMode double-invocation and any
 * future SSR/prerender. It is pure CSS: no JS interval, no render loop.
 *
 * Purely decorative: `aria-hidden`, and the firing only runs from `sm` upward
 * and behind `motion-safe:` so mobile/reduced-motion users get the static
 * low-opacity graph (agent.md §2 "Performance first on mobile"). `min-w-0`
 * defeats the SVG's automatic minimum size as a grid item (intrinsic 480px
 * would otherwise force its cell wider than narrow viewports → page-level
 * overflow-x).
 */

const WIDTH = 480
const HEIGHT = 320
const X_PADDING = 72
const Y_PADDING = 56
const LAYER_COUNTS = [3, 4, 4, 2] as const
const LAST_LAYER = LAYER_COUNTS.length - 1

/**
 * Seeded timing. Nodes fire a little faster and brighter than edges; the
 * jitter band keeps every element on its own rhythm. All constants are fixed,
 * so the network looks the same on every render.
 */
const NODE_SEED = 0x51f7a3c9
const EDGE_SEED = 0x7c1b9e2d
const NODE_CYCLE_SECONDS = 6.5
const EDGE_CYCLE_SECONDS = 8
const NODE_CYCLE_JITTER = 1.5
const EDGE_CYCLE_JITTER = 2

interface NetworkNode {
  id: string
  layer: number
  x: number
  y: number
  /** Negative animation-delay in seconds — starts the element mid-cycle. */
  delay: number
  /** Per-element animation duration in seconds. */
  duration: number
}

interface NetworkEdge {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  delay: number
  duration: number
}

/** Deterministic PRNG — the flicker must be identical on every load. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Rolls one element's cycle: a duration centred on `baseCycle` (± `jitter`)
 * and a negative delay somewhere inside that duration so it starts mid-fire.
 */
function fireTiming(
  rnd: () => number,
  baseCycle: number,
  jitter: number,
): { delay: number; duration: number } {
  const duration = baseCycle + (rnd() * 2 - 1) * jitter
  const delay = -rnd() * duration
  return { delay: round2(delay), duration: round2(duration) }
}

function buildNetwork(): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
  const nodeRnd = mulberry32(NODE_SEED)
  const edgeRnd = mulberry32(EDGE_SEED)

  const xScale = scalePoint<number>()
    .domain(LAYER_COUNTS.map((_, layer) => layer))
    .range([X_PADDING, WIDTH - X_PADDING])

  const nodesByLayer: NetworkNode[][] = LAYER_COUNTS.map((count, layer) => {
    const yScale = scalePoint<number>()
      .domain(Array.from({ length: count }, (_, index) => index))
      .range([Y_PADDING, HEIGHT - Y_PADDING])

    const x = xScale(layer) ?? 0
    return Array.from({ length: count }, (_, index) => ({
      id: `node-${layer}-${index}`,
      layer,
      x,
      y: yScale(index) ?? 0,
      ...fireTiming(nodeRnd, NODE_CYCLE_SECONDS, NODE_CYCLE_JITTER),
    }))
  })

  const edges: NetworkEdge[] = []
  nodesByLayer.slice(0, -1).forEach((layerNodes, layer) => {
    const nextLayer = nodesByLayer[layer + 1]
    layerNodes.forEach((fromNode) => {
      nextLayer.forEach((toNode) => {
        edges.push({
          id: `${fromNode.id}-${toNode.id}`,
          x1: fromNode.x,
          y1: fromNode.y,
          x2: toNode.x,
          y2: toNode.y,
          ...fireTiming(edgeRnd, EDGE_CYCLE_SECONDS, EDGE_CYCLE_JITTER),
        })
      })
    })
  })

  return { nodes: nodesByLayer.flat(), edges }
}

const { nodes, edges } = buildNetwork()

interface NeuralNetworkProps {
  className?: string
}

export default function NeuralNetwork({ className = '' }: NeuralNetworkProps) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={`h-auto w-full min-w-0 text-accent ${className}`}
    >
      <g stroke="currentColor" strokeWidth={1}>
        {edges.map((edge) => (
          <line
            key={edge.id}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            className="opacity-20 sm:motion-safe:animate-nn-edge-fire"
            style={{ animationDelay: `${edge.delay}s`, animationDuration: `${edge.duration}s` }}
          />
        ))}
      </g>
      <g fill="currentColor">
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.layer === 0 || node.layer === LAST_LAYER ? 5 : 4}
            className="opacity-40 sm:motion-safe:animate-nn-node-fire"
            style={{ animationDelay: `${node.delay}s`, animationDuration: `${node.duration}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
