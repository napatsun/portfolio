/**
 * Illustrative equity curve — Price Direction & Return Forecasting backtest.
 *
 * HONESTY CONTRACT (agent.md §2 "Never invent content", specification.md §6):
 * docs/content.md §5 reports only summary statistics for this backtest —
 * total return 20.66%, win rate 53.76%, max drawdown -3.16%, period
 * Jan 2024 – Mar 2026. The day-by-day equity curve does NOT exist in our
 * docs, so the series generated here is an illustrative shape that is
 * mathematically consistent with those three statistics:
 *
 *   - starts at 0% (first bar) and ends at exactly +20.66%
 *   - touches exactly -3.16% at the bottom of the max-drawdown dip, and
 *     never goes below it (that point is the global minimum)
 *   - the share of up-months approximates the reported 53.76% win rate
 *     (with 27 monthly steps the closest achievable is ~55.6%/51.9%)
 *
 * It must never be presented as the real historical daily data — the chart
 * component renders an always-visible caption saying exactly that. The
 * generation is fully deterministic (seeded PRNG, fixed constants), so the
 * curve is identical on every load and every machine.
 */

export interface EquityCurvePoint {
  /** Month label, e.g. "Jan 2024". */
  label: string
  /** Cumulative return in percent at that month (0 = break-even). */
  value: number
}

const BAR_COUNT = 27 // Jan 2024 … Mar 2026 inclusive
const TOTAL_RETURN_PCT = 20.66
const MAX_DRAWDOWN_PCT = -3.16
const TARGET_WIN_RATE_PCT = 53.76

/** Bars (1-indexed) of the max-drawdown dip: down, down, recover, recover. */
const DIP_BARS = { downA: 4, downB: 5, upA: 6, upB: 7 } as const
/** Each pullback is a two-bar down/up pair; BOTH bars are excluded from growth. */
const PULLBACKS: ReadonlyArray<{ downBar: number; upBar: number; depth: number }> = [
  { downBar: 14, upBar: 15, depth: 1.2 },
  { downBar: 21, upBar: 22, depth: 0.9 },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/** Deterministic PRNG — curve must be identical on every load. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function monthLabel(bar: number): string {
  const monthIndex = bar - 1
  return `${MONTHS[monthIndex % 12]} ${2024 + Math.floor(monthIndex / 12)}`
}

function isDipBar(bar: number): boolean {
  return bar === DIP_BARS.downA || bar === DIP_BARS.downB || bar === DIP_BARS.upA || bar === DIP_BARS.upB
}

function isPullbackBar(bar: number): boolean {
  return PULLBACKS.some((pullback) => pullback.downBar === bar || pullback.upBar === bar)
}

/**
 * Builds one candidate curve for a given seed, or null if the shape fails a
 * plausibility guard (e.g. the dip bottom is not the global minimum).
 */
function buildCandidate(seed: number): EquityCurvePoint[] | null {
  const rnd = mulberry32(seed)
  const moves: number[] = new Array(BAR_COUNT).fill(0)

  // 1) Growth months (bars 2–27; bar 1 is the fixed 0% baseline, and dip/
  //    pullback bars are handled separately). Coin-flipped direction. Up-moves
  //    grow mildly with time (convex drift) but stay in a tight band so the
  //    early cumulative level remains small enough to fund the max-drawdown
  //    dip plausibly. The FINAL growth bar is forced positive so the curve
  //    ends by rising into the exact +20.66% close (never overshooting it).
  const growthBars: number[] = []
  for (let bar = 1; bar <= BAR_COUNT; bar += 1) {
    if (bar === 1 || isDipBar(bar) || isPullbackBar(bar)) continue
    const t = (bar - 1) / (BAR_COUNT - 1)
    const isUp = bar === BAR_COUNT ? true : rnd() < 0.55
    growthBars.push(isUp ? 1.3 + 1.1 * t + rnd() * 0.5 : -(0.3 + 0.3 * t + rnd() * 0.6))
  }

  // 2) Rescale growth so the TOTAL curve lands on exactly +20.66% (dip and
  //    pullback moves net to zero by construction).
  const rawSum = growthBars.reduce((sum, value) => sum + value, 0)
  if (rawSum <= 0) return null
  const scale = TOTAL_RETURN_PCT / rawSum
  let growthIndex = 0
  for (let bar = 1; bar <= BAR_COUNT; bar += 1) {
    if (bar === 1 || isDipBar(bar) || isPullbackBar(bar)) continue
    moves[bar - 1] = round2(growthBars[growthIndex] * scale)
    growthIndex += 1
  }

  // 3) Keep the final point exact after per-bar rounding: shift the residual
  //    into the last growth bar (bar 27). Residual ≤ 27 × 0.005 so no sign flips.
  const roundedSum = moves.reduce((sum, value) => sum + value, 0)
  moves[BAR_COUNT - 1] = round2(moves[BAR_COUNT - 1] + (TOTAL_RETURN_PCT - roundedSum))

  // 4) Max-drawdown dip: two down-months whose bottom lands on exactly
  //    -3.16%, then two recovery months restoring the pre-dip level exactly.
  const cumBeforeDip = round2(moves.slice(0, DIP_BARS.downA - 1).reduce((sum, value) => sum + value, 0))
  const totalDrop = round2(cumBeforeDip - MAX_DRAWDOWN_PCT)
  if (totalDrop <= 0 || totalDrop > 11) return null
  const downA = round2(-0.55 * totalDrop)
  const downB = round2(MAX_DRAWDOWN_PCT - cumBeforeDip - downA) // exact bottom
  const recovery = round2(-(downA + downB))
  const upA = round2(recovery / 2)
  const upB = round2(recovery - upA)
  moves[DIP_BARS.downA - 1] = downA
  moves[DIP_BARS.downB - 1] = downB
  moves[DIP_BARS.upA - 1] = upA
  moves[DIP_BARS.upB - 1] = upB

  // 5) Shallow pullbacks: two-bar down/up pairs that net to zero and stay
  //    well above the max drawdown. Both bars were excluded from growth, so
  //    nothing real is overwritten here.
  for (const pullback of PULLBACKS) {
    moves[pullback.downBar - 1] = -pullback.depth
    moves[pullback.upBar - 1] = pullback.depth
  }

  // 6) Walk the curve and apply plausibility guards.
  const points: EquityCurvePoint[] = []
  let cumulative = 0
  for (let bar = 1; bar <= BAR_COUNT; bar += 1) {
    cumulative = round2(cumulative + moves[bar - 1])
    points.push({ label: monthLabel(bar), value: cumulative })
  }

  const minimum = Math.min(...points.map((point) => point.value))
  const dipBottom = points[DIP_BARS.downB - 1].value
  const maximum = Math.max(...points.map((point) => point.value))
  if (Math.abs(minimum - MAX_DRAWDOWN_PCT) > 0.005) return null // dip must be the global min
  if (Math.abs(dipBottom - MAX_DRAWDOWN_PCT) > 0.005) return null
  if (Math.abs(points[BAR_COUNT - 1].value - TOTAL_RETURN_PCT) > 0.005) return null
  if (maximum > TOTAL_RETURN_PCT + 0.5) return null // no overshoot past the final level
  return points
}

/**
 * Picks the seed whose up-month share best approximates the reported win
 * rate (deterministic search — no runtime randomness).
 */
function selectCurve(): EquityCurvePoint[] {
  let best: EquityCurvePoint[] | null = null
  let bestError = Number.POSITIVE_INFINITY
  for (let seed = 0; seed < 5000; seed += 1) {
    const candidate = buildCandidate(seed)
    if (!candidate) continue
    const upMonths = candidate.filter((point) => point.value > 0).length
    const winRatePct = (upMonths / candidate.length) * 100
    const error = Math.abs(winRatePct - TARGET_WIN_RATE_PCT)
    if (error < bestError) {
      bestError = error
      best = candidate
    }
  }
  if (!best) throw new Error('illustrative equity curve: no seed satisfied the constraints')
  return best
}

export const illustrativeEquityCurve: EquityCurvePoint[] = selectCurve()

export const EQUITY_CURVE_CAPTION =
  'Illustrative equity curve — shape approximated from the reported backtest stats (20.66% total return, 53.76% win rate, -3.16% max drawdown). Not the real daily data.'

export const EQUITY_CURVE_ARIA_LABEL =
  'Illustrative equity curve for the Price Direction and Return Forecasting backtest, January 2024 to March 2026. The shape is approximated from the reported statistics — total return 20.66 percent, win rate 53.76 percent, max drawdown minus 3.16 percent — and is not real historical daily data.'
