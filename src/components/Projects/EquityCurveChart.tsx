import { useId } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../../hooks/useTheme'
import type { EquityCurvePoint } from '../../data/equityCurve'

export interface EquityCurveChartProps {
  /** Series to plot; x values come from `label`, y from `value`. */
  data: EquityCurvePoint[]
  /** Accessible name for the whole figure (announced by screen readers). */
  ariaLabel: string
  /** Always-visible honesty/disclosure text rendered as the figure caption. */
  caption: string
  /** Series name shown in the tooltip (default: cumulative return). */
  valueName?: string
}

const GOLD = '#EDAE17' // docs/ui-spec.md §1 accent token

function formatSignedPercent(value: number): string {
  const fixed = value.toFixed(2)
  return value > 0 ? `+${fixed}%` : `${fixed}%`
}

/**
 * Minimal structural props for the tooltip — keeps this component decoupled
 * from recharts internals; recharts v3 passes these via the `content`
 * render-prop form (`content={(props) => <ChartTooltipContent {...props} />}`).
 */
interface TooltipRenderProps {
  active?: boolean
  label?: string | number
  payload?: ReadonlyArray<{ value?: number | string | ReadonlyArray<number | string> }>
}

/**
 * Custom tooltip: date + cumulative return, restyled to the Navy/Gold system
 * instead of the default white box.
 */
function ChartTooltipContent({ active, payload, label }: TooltipRenderProps) {
  if (!active || !payload || payload.length === 0) return null
  const raw = payload[0]?.value
  const value = typeof raw === 'number' ? raw : Number(raw)
  if (Number.isNaN(value)) return null

  return (
    <div className="rounded-lg border border-accent/40 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm dark:bg-[#001631]/95">
      <p className="font-mono text-xs text-primary/70 dark:text-secondary-gray/80">{label}</p>
      <p className="font-mono text-sm font-semibold text-primary dark:text-secondary-light">
        {formatSignedPercent(value)}
      </p>
    </div>
  )
}

/**
 * EquityCurveChart — docs/ui-spec.md §5.3 "Model Accuracy / Trading Chart":
 * a responsive line chart whose tooltip shows the cumulative return on hover.
 *
 * Reusable: takes data + labels via props, so a future project can plot its
 * own series without touching this component. Colors follow the ui-spec
 * tokens — gold line (the 10% accent), navy/white axes and grid depending on
 * the active theme.
 *
 * The component itself renders NO claims about data authenticity: callers
 * must pass the disclosure text via `caption` (always visible below the
 * plot) and `ariaLabel`.
 */
export default function EquityCurveChart({
  data,
  ariaLabel,
  caption,
  valueName = 'Cumulative return',
}: EquityCurveChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const id = useId()
  const captionId = `${id}-caption`

  const palette = {
    line: GOLD,
    axis: isDark ? 'rgba(245, 247, 250, 0.35)' : 'rgba(0, 40, 86, 0.35)',
    grid: isDark ? 'rgba(245, 247, 250, 0.10)' : 'rgba(0, 40, 86, 0.10)',
    tick: isDark ? '#F5F7FA' : '#002856',
  }

  const values = data.map((point) => point.value)
  const yDomain: [number, number] = [Math.floor(Math.min(...values)) - 1, Math.ceil(Math.max(...values)) + 1]

  return (
    <figure className="flex h-full min-h-0 flex-col">
      {/* role="img" + describedby the caption so the illustrative-data
          disclosure reaches screen-reader users too (tests.md §4). */}
      <div
        role="img"
        aria-label={ariaLabel}
        aria-describedby={captionId}
        className="min-h-[180px] flex-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 10, bottom: 4, left: 0 }}>
            <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              interval="preserveStartEnd"
              minTickGap={28}
              tick={{ fill: palette.tick, fontSize: 10, fontFamily: '"JetBrains Mono", monospace' }}
              tickLine={false}
              axisLine={{ stroke: palette.axis }}
            />
            <YAxis
              width={44}
              domain={yDomain}
              tickCount={6}
              tickFormatter={(value: number) => `${value}%`}
              tick={{ fill: palette.tick, fontSize: 10, fontFamily: '"JetBrains Mono", monospace' }}
              tickLine={false}
              axisLine={false}
            />
            {/* Break-even baseline so drawdown dips read at a glance. */}
            <ReferenceLine y={0} stroke={palette.axis} strokeDasharray="4 4" />
            <Tooltip
              content={(props) => <ChartTooltipContent {...props} />}
              cursor={{ stroke: palette.axis, strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={valueName}
              stroke={palette.line}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: palette.line, strokeWidth: 2 }}
              isAnimationActive="auto"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Honesty caption — always visible, never hover-only (agent.md §2). */}
      <figcaption
        id={captionId}
        className="mt-2 shrink-0 text-[11px] leading-snug text-primary/70 dark:text-secondary-gray/60"
      >
        {caption}
      </figcaption>
    </figure>
  )
}
