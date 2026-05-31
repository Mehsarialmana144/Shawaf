import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

const GIVEAWAY_SIGNUP_PREFILL_KEY = 'shawafGiveawaySignupPrefill'
const GIVEAWAY_BACKGROUND =
  'radial-gradient(circle at 18% 25%, rgba(212, 175, 55, 0.24), transparent 32%), radial-gradient(circle at 82% 30%, rgba(255, 255, 255, 0.10), transparent 34%), linear-gradient(135deg, #002F24 0%, #006A4E 48%, #0B3B2F 100%)'
const GIVEAWAY_THEME_COLOR = '#002F24'

export default function Giveaway() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    eyebrow: isArabic ? 'سحب شواف على هدية تذكارية' : 'Shawaf Souvenir Gift Draw',
    title: isArabic ? 'مرحبًا بك في شواف' : 'Welcome to Shawaf',
    subtitle: isArabic
      ? 'هل أنت مستعد لبدء رحلتك معنا؟'
      : 'Ready to start your journey with us?',
    fullName: isArabic ? 'الاسم الكامل' : 'Full Name',
    fullNamePlaceholder: isArabic ? 'اكتب اسمك الكامل' : 'Enter your full name',
    email: isArabic ? 'البريد الإلكتروني' : 'Email Address',
    emailPlaceholder: isArabic ? 'example@email.com' : 'you@example.com',
    ticketNumber: isArabic ? 'رقم التذكرة' : 'Ticket Number',
    ticketPlaceholder: isArabic ? 'اكتب رقم التذكرة' : 'Enter ticket number',
    checkIn: isArabic ? 'تسجيل الحضور' : 'Check In',
    checkingIn: isArabic ? 'جاري تسجيل الحضور...' : 'Checking in...',
    requiredError: isArabic
      ? 'يرجى تعبئة جميع الحقول المطلوبة.'
      : 'Please complete all required fields.',
    submitError: isArabic
      ? 'تعذر إكمال تسجيل الحضور. يرجى المحاولة مرة أخرى.'
      : 'Unable to complete check-in. Please try again.',
    successTitle: isArabic ? 'أهلًا بك معنا!' : 'Welcome Aboard!',
    successLineOne: isArabic
      ? 'تم إكمال تسجيل حضورك بنجاح.'
      : 'Your check-in has been completed successfully.',
    successLineTwo: isArabic
      ? 'تم إدخالك في السحب على هدية تذكارية من شواف.'
      : 'You have been entered into the draw for a Shawaf souvenir gift.',
    successLineThree: isArabic ? 'حظًا موفقًا أيها المستكشف!' : 'Good luck, Explorer!',
    startJourney: isArabic ? 'ابدأ رحلتك' : 'Start Your Journey',
    logoAlt: isArabic ? 'شعار شواف' : 'Shawaf logo',
  }

  const steps = [
    { number: '01', label: isArabic ? 'سجّل حضورك' : 'Check in' },
    { number: '02', label: isArabic ? 'ادخل السحب' : 'Enter the draw' },
    { number: '03', label: isArabic ? 'ابدأ رحلتك' : 'Start exploring' },
  ]

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    ticketNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const root = document.getElementById('root')
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    let themeMeta = document.querySelector('meta[name="theme-color"]')

    const previous = {
      htmlBackground: html.style.background,
      htmlBackgroundColor: html.style.backgroundColor,
      bodyBackground: body.style.background,
      bodyBackgroundColor: body.style.backgroundColor,
      rootBackground: root?.style.background,
      rootBackgroundColor: root?.style.backgroundColor,
      viewport: viewportMeta?.getAttribute('content'),
      hadThemeMeta: Boolean(themeMeta),
      themeColor: themeMeta?.getAttribute('content'),
    }

    if (!themeMeta) {
      themeMeta = document.createElement('meta')
      themeMeta.setAttribute('name', 'theme-color')
      document.head.appendChild(themeMeta)
    }

    viewportMeta?.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover')
    themeMeta.setAttribute('content', GIVEAWAY_THEME_COLOR)

    html.style.background = GIVEAWAY_BACKGROUND
    html.style.backgroundColor = GIVEAWAY_THEME_COLOR
    body.style.background = GIVEAWAY_BACKGROUND
    body.style.backgroundColor = GIVEAWAY_THEME_COLOR
    if (root) {
      root.style.background = GIVEAWAY_BACKGROUND
      root.style.backgroundColor = GIVEAWAY_THEME_COLOR
    }

    return () => {
      html.style.background = previous.htmlBackground
      html.style.backgroundColor = previous.htmlBackgroundColor
      body.style.background = previous.bodyBackground
      body.style.backgroundColor = previous.bodyBackgroundColor
      if (root) {
        root.style.background = previous.rootBackground
        root.style.backgroundColor = previous.rootBackgroundColor
      }
      if (viewportMeta && previous.viewport) {
        viewportMeta.setAttribute('content', previous.viewport)
      }
      if (themeMeta) {
        if (previous.hadThemeMeta) {
          themeMeta.setAttribute('content', previous.themeColor || '')
        } else {
          themeMeta.remove()
        }
      }
    }
  }, [])

  const handleChange = (field) => (e) => {
    setForm((current) => ({
      ...current,
      [field]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const entry = {
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      ticket_number: form.ticketNumber.trim(),
    }

    if (!entry.full_name || !entry.email || !entry.ticket_number) {
      setError(text.requiredError)
      return
    }

    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('giveaway_entries')
        .insert([entry])

      if (insertError) throw insertError

      sessionStorage.setItem(
        GIVEAWAY_SIGNUP_PREFILL_KEY,
        JSON.stringify({
          fullName: entry.full_name,
          email: entry.email,
          ticketNumber: entry.ticket_number,
        })
      )

      setSubmitted(true)
      setForm({
        fullName: '',
        email: '',
        ticketNumber: '',
      })
    } catch (err) {
      setError(err?.message || text.submitError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      style={{
        background: GIVEAWAY_BACKGROUND,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.28) 0%, transparent 42%), radial-gradient(circle at 80% 20%, rgba(245, 245, 240, 0.14) 0%, transparent 38%), linear-gradient(120deg, rgba(0, 47, 36, 0.45), rgba(0, 106, 78, 0.05))',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(45deg, rgba(255,255,255,0.35) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.35) 25%, transparent 25%)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
          <section className="min-w-0 text-center lg:text-start">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-sm px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" aria-hidden="true" />
              <span dir="auto">{text.eyebrow}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-5 mb-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/95 border border-[#D4AF37]/50 shadow-xl flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/brand/shawaf-logo.png"
                  alt={text.logoAlt}
                  className="w-full h-full object-contain p-2.5"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[#D4AF37] text-lg font-semibold mb-3" dir="auto">
                  Shawaf — شواف
                </p>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
                  style={{
                    fontFamily: isArabic ? 'Cairo, sans-serif' : 'Inter, sans-serif',
                  }}
                  dir="auto"
                >
                  {text.title}
                </h1>
              </div>
            </div>

            <p
              className="text-[#F5F5F0]/85 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              dir="auto"
            >
              {text.subtitle}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white/10 backdrop-blur-sm border border-[#D4AF37]/25 rounded-2xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-white">{step.number}</div>
                  <div className="text-xs text-[#F5F5F0]/70 mt-1" dir="auto">
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-[#D4AF37]/35 shadow-2xl p-5 sm:p-8 lg:p-9 relative">
            {!submitted ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#333333]" dir="auto">
                    {text.checkIn}
                  </h2>
                  <div className="w-14 h-1 rounded-full bg-[#D4AF37] mt-3" />
                </div>

                {error && (
                  <div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5"
                    dir="auto"
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="giveaway-full-name"
                      className="block text-sm font-medium text-[#333333] mb-1.5"
                      dir="auto"
                    >
                      {text.fullName}
                    </label>
                    <input
                      id="giveaway-full-name"
                      type="text"
                      className="input-field"
                      placeholder={text.fullNamePlaceholder}
                      value={form.fullName}
                      onChange={handleChange('fullName')}
                      required
                      dir="auto"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="giveaway-email"
                      className="block text-sm font-medium text-[#333333] mb-1.5"
                      dir="auto"
                    >
                      {text.email}
                    </label>
                    <input
                      id="giveaway-email"
                      type="email"
                      className="input-field"
                      placeholder={text.emailPlaceholder}
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="giveaway-ticket"
                      className="block text-sm font-medium text-[#333333] mb-1.5"
                      dir="auto"
                    >
                      {text.ticketNumber}
                    </label>
                    <input
                      id="giveaway-ticket"
                      type="text"
                      className="input-field"
                      placeholder={text.ticketPlaceholder}
                      value={form.ticketNumber}
                      onChange={handleChange('ticketNumber')}
                      required
                      dir="auto"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D4AF37] hover:bg-[#B89122] text-[#333333] font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[#D4AF37]/25 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2" dir="auto">
                        <span className="w-4 h-4 border-2 border-[#333333] border-t-transparent rounded-full animate-spin" />
                        {text.checkingIn}
                      </span>
                    ) : (
                      <span dir="auto">{text.checkIn}</span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8 sm:py-10">
                <div className="w-24 h-24 rounded-3xl bg-[#E6F2EE] border border-[#D4AF37]/45 flex items-center justify-center mx-auto mb-6 shadow-sm overflow-hidden">
                  <img
                    src="/brand/shawaf-logo.png"
                    alt={text.logoAlt}
                    className="w-full h-full object-contain p-2.5"
                  />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-[#333333]" dir="auto">
                  {text.successTitle}
                </h2>

                <div className="mt-5 space-y-3 text-stone-600 leading-relaxed" dir="auto">
                  <p>{text.successLineOne}</p>
                  <p>{text.successLineTwo}</p>
                  <p className="font-semibold text-[#006A4E]">{text.successLineThree}</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="bg-[#D4AF37] hover:bg-[#B89122] text-[#333333] font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg inline-flex items-center justify-center mt-8"
                >
                  <span dir="auto">{text.startJourney}</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
