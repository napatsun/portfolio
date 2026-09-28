import { useEffect, useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { ChatDemoMessage } from '../../data/chatDemo'

export interface ChatDemoProps {
  /** Illustrative mock messages; sender order drives bubble alignment. */
  messages: ChatDemoMessage[]
  /** Accessible name for the whole figure (announced by screen readers). */
  ariaLabel: string
  /** Always-visible honesty/disclosure text rendered as the figure caption. */
  caption: string
}

/** Pause before a user bubble appears. */
const USER_PAUSE_MS = 1100
/** Pause (with typing dots) before a bot bubble appears. */
const TYPING_MS = 1500
/** Hold the full conversation before restarting the loop. */
const HOLD_FULL_MS = 3600

const userBubble =
  'max-w-[80%] self-end rounded-2xl rounded-br-md bg-primary px-3 py-2 text-[13px] leading-snug text-white dark:bg-secondary-light dark:text-primary'

const botBubble =
  'max-w-[85%] self-start rounded-2xl rounded-bl-md border border-primary/10 bg-white px-3 py-2 text-[13px] leading-snug text-primary/85 shadow-sm dark:border-secondary-light/15 dark:bg-secondary-light/10 dark:text-secondary-gray'

/**
 * Three-dot typing indicator shown just before each bot reply.
 * Pure opacity pulse — disabled entirely under prefers-reduced-motion.
 */
function TypingDots({ animated }: { animated: boolean }) {
  return (
    <span aria-hidden="true" className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((dot) =>
        animated ? (
          <motion.span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-primary/50 dark:bg-secondary-gray/60"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: dot * 0.15 }}
          />
        ) : (
          <span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-primary/50 dark:bg-secondary-gray/60"
          />
        ),
      )}
    </span>
  )
}

/**
 * ChatDemo — docs/content.md §5 "Consider an animated chat demo instead of
 * a data chart" for the LINE Chatbot RAG project.
 *
 * A clearly-labeled UI mockup (NOT a live chatbot — no API, no network):
 * bubbles reveal one by one with a staggered fade, a typing indicator
 * precedes each bot reply, then the loop holds and restarts. Reusable: takes
 * messages + labels via props, mirroring the EquityCurveChart contract
 * (caption + ariaLabel required, content lives in `src/data/`).
 *
 * Motion safety: under prefers-reduced-motion the full conversation renders
 * statically with no timers. Colors use only the ui-spec §1 tokens
 * (navy / white / gold, dark-mode variants).
 */
export default function ChatDemo({ messages, ariaLabel, caption }: ChatDemoProps) {
  const prefersReduced = useReducedMotion() ?? false
  const id = useId()
  const captionId = `${id}-caption`

  const [step, setStep] = useState(0)

  // Derived during render (never synced via setState in an effect): under
  // prefers-reduced-motion the full script shows statically; otherwise each
  // loop step reveals one bubble, with the typing dots shown for the whole
  // step that precedes a bot reply.
  const visibleCount = prefersReduced ? messages.length : step
  const typing =
    !prefersReduced && step < messages.length && messages[step]?.from === 'bot'

  useEffect(() => {
    if (prefersReduced) return
    if (step >= messages.length) {
      const hold = window.setTimeout(() => setStep(0), HOLD_FULL_MS)
      return () => window.clearTimeout(hold)
    }
    const nextIsBot = messages[step]?.from === 'bot'
    const timer = window.setTimeout(
      () => setStep((count) => count + 1),
      nextIsBot ? TYPING_MS : USER_PAUSE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [step, prefersReduced, messages])

  return (
    <figure className="flex h-full min-h-0 flex-col">
      {/* role="img" + describedby the caption so the mock-data disclosure
          reaches screen-reader users too (tests.md §4). Inner bubbles are
          aria-hidden: the loop is decorative, the aria-label carries the
          meaning — screen readers are not spammed by re-announcements. */}
      <div
        role="img"
        aria-label={ariaLabel}
        aria-describedby={captionId}
        className="flex min-h-[180px] flex-1 flex-col"
      >
        <div aria-hidden="true" className="flex shrink-0 items-center gap-2 px-1 pb-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <p className="font-mono text-xs font-medium text-primary/70 dark:text-secondary-gray/70">
            Shop Assistant · online
          </p>
        </div>

        <ul aria-hidden="true" className="flex flex-1 flex-col justify-end gap-2 overflow-hidden">
          {messages.slice(0, visibleCount).map((message, index) => (
            <motion.li
              // Index key is safe: the illustrative script never reorders.
              key={`${message.from}-${index}`}
              initial={prefersReduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={message.from === 'user' ? userBubble : botBubble}
            >
              {message.text}
            </motion.li>
          ))}
          {typing && visibleCount < messages.length && (
            <motion.li
              initial={prefersReduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={botBubble}
            >
              <TypingDots animated={!prefersReduced} />
            </motion.li>
          )}
        </ul>
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
