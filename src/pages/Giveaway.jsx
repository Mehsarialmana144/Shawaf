import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

const GIVEAWAY_SIGNUP_PREFILL_KEY = 'shawafGiveawaySignupPrefill'

export default function Giveaway() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    eyebrow: isArabic ? 'تسجيل حضور المعرض' : 'Exhibition Check-In',
    title: isArabic ? 'مرحبًا بك في شواف' : 'Welcome to Shawaf',
    subtitle: isArabic
      ? 'هل أنت مستعد لبدء رحلتك معنا؟'
      : 'Ready to start your journey with us?',
    fullName: isArabic ? 'الاسم الكامل' : 'Full Name',
    fullNamePlaceholder: isArabic ? 'اكتب اسمك الكامل' : 'Enter your full name',
    email: isArabic ? 'البريد الإلكتروني' : 'Email Address',
    emailPlaceholder: isArabic ? 'example@email.com' : 'you@example.com',
    phone: isArabic ? 'رقم الجوال' : 'Phone Number',
    phonePlaceholder: isArabic ? '05xxxxxxxx' : '05xxxxxxxx',
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
    successTitle: isArabic ? '🎉 أهلًا بك معنا!' : '🎉 Welcome Aboard!',
    successLineOne: isArabic
      ? 'تم إكمال تسجيل حضورك بنجاح.'
      : 'Your check-in has been completed successfully.',
    successLineTwo: isArabic
      ? 'تم إدخالك في سحب حقيبة السفر من شواف.'
      : 'You have been entered into the Shawaf Travel Kit giveaway.',
    successLineThree: isArabic ? 'حظًا موفقًا أيها المستكشف!' : 'Good luck, Explorer!',
    startJourney: isArabic ? 'ابدأ رحلتك' : 'Start Your Journey',
    logoAlt: isArabic ? 'شعار شواف' : 'Shawaf logo',
  }

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    ticketNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

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
      phone: form.phone.trim(),
      ticket_number: form.ticketNumber.trim(),
    }
    const email = form.email.trim()

    if (!entry.full_name || !email || !entry.phone || !entry.ticket_number) {
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
          email,
          ticketNumber: entry.ticket_number,
        })
      )

      setSubmitted(true)
      setForm({
        fullName: '',
        email: '',
        phone: '',
        ticketNumber: '',
      })
    } catch (err) {
      setError(err?.message || text.submitError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#F5F5F0] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-72 bg-[#E6F2EE]" aria-hidden="true" />
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
          <section className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-white/85 px-4 py-2 text-sm font-semibold text-[#006A4E] shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" aria-hidden="true" />
              <span dir="auto">{text.eyebrow}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white border border-[#D4AF37]/40 shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/brand/shawaf-logo.png"
                  alt={text.logoAlt}
                  className="w-full h-full object-contain p-2.5"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-500" dir="auto">
                  Shawaf - شواف
                </p>
                <h1 className="text-3xl sm:text-5xl font-bold text-[#333333] leading-tight" dir="auto">
                  {text.title}
                </h1>
              </div>
            </div>

            <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl" dir="auto">
              {text.subtitle}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              <div className="rounded-2xl border border-[#DDD8C8] bg-white/75 px-4 py-4 text-center">
                <div className="text-xl font-bold text-[#006A4E]">01</div>
                <div className="text-xs text-stone-500 mt-1" dir="auto">
                  {isArabic ? 'سجّل' : 'Check in'}
                </div>
              </div>

              <div className="rounded-2xl border border-[#DDD8C8] bg-white/75 px-4 py-4 text-center">
                <div className="text-xl font-bold text-[#006A4E]">02</div>
                <div className="text-xs text-stone-500 mt-1" dir="auto">
                  {isArabic ? 'ادخل السحب' : 'Enter'}
                </div>
              </div>

              <div className="rounded-2xl border border-[#DDD8C8] bg-white/75 px-4 py-4 text-center">
                <div className="text-xl font-bold text-[#006A4E]">03</div>
                <div className="text-xs text-stone-500 mt-1" dir="auto">
                  {isArabic ? 'استكشف' : 'Explore'}
                </div>
              </div>
            </div>
          </section>

          <section className="card p-5 sm:p-8 lg:p-9 relative">
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
                      htmlFor="giveaway-phone"
                      className="block text-sm font-medium text-[#333333] mb-1.5"
                      dir="auto"
                    >
                      {text.phone}
                    </label>
                    <input
                      id="giveaway-phone"
                      type="tel"
                      className="input-field"
                      placeholder={text.phonePlaceholder}
                      value={form.phone}
                      onChange={handleChange('phone')}
                      required
                      dir="ltr"
                      inputMode="tel"
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
                    className="w-full btn-primary justify-center py-3.5 rounded-xl text-base disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2" dir="auto">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                  className="btn-primary justify-center mt-8 py-3.5 rounded-xl text-base"
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
