import { CodeXml, Globe, Mail, Send } from 'lucide-react'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  contactChannels,
  contactFormLabels,
  contactHeading,
  contactIntro,
} from '../../data/contact'

/**
 * EmailJS credentials — placeholder env names only (see `.env.example`).
 * No real service/template IDs exist yet, so nothing is invented here: when
 * any var is missing the form renders a visible "not configured" notice and
 * disables itself instead of pretending to send (agent.md §2).
 */
const emailjsServiceId: string | undefined = import.meta.env.VITE_EMAILJS_SERVICE_ID
const emailjsTemplateId: string | undefined = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const emailjsPublicKey: string | undefined = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const isConfigured = Boolean(emailjsServiceId && emailjsTemplateId && emailjsPublicKey)

/** lucide-react ships no brand icons — generic glyphs per channel. */
const channelIcons: Record<string, LucideIcon> = {
  Email: Mail,
  GitHub: CodeXml,
  LinkedIn: Globe,
}

interface FormValues {
  name: string
  email: string
  message: string
}

const emptyValues: FormValues = { name: '', email: '', message: '' }

/** Minimal email-format check for client-side validation (tests.md §1). */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

/** Returns one message per invalid field; empty object means valid. */
function validate(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {}
  if (values.name.trim() === '') errors.name = 'Please enter your name.'
  if (values.email.trim() === '') {
    errors.email = 'Please enter your email address.'
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (values.message.trim() === '') errors.message = 'Please enter your message.'
  return errors
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

const inputBase =
  'w-full rounded-lg border bg-secondary-light/5 px-4 py-3 font-body text-base text-secondary-light placeholder:text-secondary-gray/60 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-[#001631]'

const inputBorder = 'border-secondary-light/20 hover:border-secondary-light/40'
const inputBorderError = 'border-red-400 hover:border-red-400'

const labelClass = 'mb-2 block font-body text-sm font-medium text-secondary-gray'

/**
 * Contact — docs/content.md §6.
 *
 * Section rhythm (docs/ui-spec.md §1, PROGRESS.md §3): Projects = White, so
 * Contact is Navy — mirroring Skills' exact color treatment (bg-primary,
 * darker `#001631` in dark mode). Vertical padding 48px mobile / 96px
 * desktop (ui-spec §3). The single <h2> keeps the h1→h2→h3 order
 * (tests.md §5).
 *
 * The form validates inline per field (required + email format, tests.md
 * §1), announces results via role="status"/role="alert", and sends through
 * EmailJS only when configured — see the module constants above.
 */
export default function Contact() {
  const uid = useId()
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
    name: false,
    email: false,
    message: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const errors = validate(values)
  const showError = (field: keyof FormValues): boolean =>
    submitted || touched[field]

  const fieldIds = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    message: `${uid}-message`,
  } as const
  const errorIds = {
    name: `${uid}-name-error`,
    email: `${uid}-email-error`,
    message: `${uid}-message-error`,
  } as const

  function handleChange(field: keyof FormValues, value: string): void {
    setValues((prev) => ({ ...prev, [field]: value }))
    // Stale send results clear as soon as the user edits (tests.md §1).
    if (status === 'success' || status === 'error') setStatus('idle')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values)).length > 0) return
    // Belt-and-braces: the fieldset is disabled when unconfigured, so this
    // path is unreachable in practice — never attempt a send without creds.
    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) return
    setStatus('sending')
    try {
      // Dynamically imported: EmailJS (~16KB) stays out of the main bundle
      // and only downloads when a visitor actually submits (perf follow-up —
      // it was ~100% "unused" at Lighthouse measure time).
      const { default: emailjs } = await import('@emailjs/browser')
      await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,
        {
          from_name: values.name.trim(),
          reply_to: values.email.trim(),
          message: values.message.trim(),
        },
        { publicKey: emailjsPublicKey },
      )
      setStatus('success')
      setValues(emptyValues)
      setTouched({ name: false, email: false, message: false })
      setSubmitted(false)
    } catch {
      setStatus('error')
    }
  }

  function inputClass(field: keyof FormValues): string {
    return `${inputBase} ${showError(field) && errors[field] ? inputBorderError : inputBorder}`
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-[65px] bg-primary text-secondary-light dark:bg-[#001631]"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-24 lg:px-8">
        <h2
          id="contact-heading"
          className="font-header text-3xl font-semibold leading-tight text-secondary-light sm:text-4xl lg:text-[2.5rem]"
        >
          {contactHeading}
        </h2>
        <p className="mt-4 max-w-2xl font-body text-base text-secondary-gray/80 sm:text-lg">
          {contactIntro}
        </p>

        {/* Single implicit column below lg — pinned to minmax(0,1fr): a bare
            `auto` track takes its minimum from the largest item min-content,
            and the nowrap channel URLs (~60ch LinkedIn) would force the whole
            track past narrow viewports, dragging every full-width child
            (inputs, cards) off-screen identically. */}
        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            {!isConfigured && (
              <div className="mb-6 rounded-lg border border-accent/50 bg-accent/10 px-4 py-3">
                <p className="font-body text-sm text-secondary-light">
                  Contact form isn&rsquo;t configured yet — message sending is
                  disabled until the EmailJS keys are set (see{' '}
                  <code className="font-mono">.env.example</code>). You can still
                  reach me through the channels on this page.
                </p>
              </div>
            )}

            {status === 'success' && (
              <p
                role="status"
                className="mb-6 rounded-lg border border-accent/50 bg-accent/10 px-4 py-3 font-body text-sm text-secondary-light"
              >
                Your message has been sent successfully. Thank you for reaching
                out!
              </p>
            )}
            {status === 'error' && (
              <p
                role="alert"
                className="mb-6 rounded-lg border border-red-400/60 bg-red-400/10 px-4 py-3 font-body text-sm text-secondary-light"
              >
                Something went wrong while sending your message. Please try
                again, or reach out directly through the channels on this page.
              </p>
            )}

            <form aria-label="Contact form" noValidate onSubmit={handleSubmit}>
              <fieldset disabled={!isConfigured || status === 'sending'} className="space-y-6">
                <div>
                  <label className={labelClass} htmlFor={fieldIds.name}>
                    {contactFormLabels.name}{' '}
                    <span aria-hidden="true" className="text-accent">
                      *
                    </span>
                  </label>
                  <input
                    id={fieldIds.name}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={showError('name') && Boolean(errors.name)}
                    aria-describedby={showError('name') && errors.name ? errorIds.name : undefined}
                    placeholder="Your name"
                    value={values.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    className={inputClass('name')}
                  />
                  {showError('name') && errors.name && (
                    <p id={errorIds.name} role="alert" className="mt-1.5 text-sm text-red-300">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor={fieldIds.email}>
                    {contactFormLabels.email}{' '}
                    <span aria-hidden="true" className="text-accent">
                      *
                    </span>
                  </label>
                  <input
                    id={fieldIds.email}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={showError('email') && Boolean(errors.email)}
                    aria-describedby={showError('email') && errors.email ? errorIds.email : undefined}
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    className={inputClass('email')}
                  />
                  {showError('email') && errors.email && (
                    <p id={errorIds.email} role="alert" className="mt-1.5 text-sm text-red-300">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor={fieldIds.message}>
                    {contactFormLabels.message}{' '}
                    <span aria-hidden="true" className="text-accent">
                      *
                    </span>
                  </label>
                  <textarea
                    id={fieldIds.message}
                    name="message"
                    rows={5}
                    required
                    aria-required="true"
                    aria-invalid={showError('message') && Boolean(errors.message)}
                    aria-describedby={
                      showError('message') && errors.message ? errorIds.message : undefined
                    }
                    placeholder="Your message"
                    value={values.message}
                    onChange={(event) => handleChange('message', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
                    className={`${inputClass('message')} resize-y`}
                  />
                  {showError('message') && errors.message && (
                    <p id={errorIds.message} role="alert" className="mt-1.5 text-sm text-red-300">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isConfigured || status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-body text-base font-semibold text-primary transition-colors duration-300 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-[#001631]"
                >
                  <Send size={18} aria-hidden="true" />
                  {status === 'sending' ? 'Sending…' : contactFormLabels.send}
                </button>
              </fieldset>
            </form>
          </div>

          <ul aria-label="Contact channels" className="space-y-4 lg:col-span-2">
            {contactChannels.map((channel) => {
              const Icon = channelIcons[channel.label] ?? Globe
              return (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    // Accessible name starts with the EXACT visible text
                    // ("Label value") so voice-control/SR matching holds
                    // (label-content-name-mismatch): no colon separator, which
                    // broke substring containment of the visible string.
                    {...(channel.external
                      ? {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          'aria-label': `${channel.label} ${channel.value} (opens in a new tab)`,
                        }
                      : { 'aria-label': `${channel.label} ${channel.value}` })}
                    className="flex items-center gap-4 rounded-xl border border-secondary-light/15 bg-secondary-light/5 p-4 transition-colors duration-300 hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary dark:focus-visible:ring-offset-[#001631]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary-light/20 text-accent"
                    >
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-xs uppercase tracking-wider text-secondary-gray/70">
                        {channel.label}
                      </span>
                      <span className="block truncate font-body text-sm text-secondary-light">
                        {channel.value}
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
