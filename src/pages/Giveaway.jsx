import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const GIVEAWAY_BACKGROUND =
  'radial-gradient(circle at 18% 25%, rgba(212, 175, 55, 0.24), transparent 32%), radial-gradient(circle at 82% 30%, rgba(255, 255, 255, 0.10), transparent 34%), linear-gradient(135deg, #002F24 0%, #006A4E 48%, #0B3B2F 100%)'
const GIVEAWAY_THEME_COLOR = '#002F24'
const CV_DOWNLOADS = [
  {
    key: 'ahmed',
    name: 'Ahmed Alqaoud',
    role: 'CV / Resume',
    href: '/cvs/ahmed-alqaoud-cv.pdf',
    qrSrc: '/cvs/ahmed-cv-qr.svg',
  },
  {
    key: 'meshari',
    name: 'Meshari Almana',
    role: 'CV / Resume',
    href: '/cvs/meshari-cv.pdf',
    qrSrc: '/cvs/meshari-cv-qr.svg',
  },
  {
    key: 'abdullah',
    name: 'Abdullah Alajlan',
    role: 'CV / Resume',
    href: '/cvs/abdullah-alajlan-cv.pdf',
    qrSrc: '/cvs/abdullah-cv-qr.svg',
  },
]

export default function Giveaway() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    eyebrow: isArabic ? 'فريق شواف' : 'Shawaf Team',
    title: isArabic ? 'مرحبًا بك في شواف' : 'Welcome to Shawaf',
    subtitle: isArabic
      ? 'هل أنت مستعد لبدء رحلتك معنا؟'
      : 'Ready to start your journey with us?',
    cvTitle: isArabic ? 'السير الذاتية للفريق' : 'Team CVs',
    cvIntro: isArabic
      ? 'امسح رمز QR أو حمّل السيرة الذاتية مباشرة لكل عضو من الفريق.'
      : 'Scan a QR code or download each team member CV directly.',
    scanLabel: isArabic ? 'امسح رمز QR' : 'Scan QR',
    downloadCv: isArabic ? 'تحميل السيرة الذاتية' : 'Download CV',
    startJourney: isArabic ? 'ابدأ رحلتك' : 'Start Your Journey',
    logoAlt: isArabic ? 'شعار شواف' : 'Shawaf logo',
  }

  const steps = [
    { number: '01', label: isArabic ? 'تعرّف على الفريق' : 'Meet the team' },
    { number: '02', label: isArabic ? 'حمّل السير الذاتية' : 'Download CVs' },
    { number: '03', label: isArabic ? 'ابدأ رحلتك' : 'Start exploring' },
  ]

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
            <div className="py-3 sm:py-5">
              <div className="w-20 h-20 rounded-2xl bg-[#E6F2EE] border border-[#D4AF37]/45 flex items-center justify-center mx-auto mb-5 shadow-sm overflow-hidden">
                <img
                  src="/brand/shawaf-logo.png"
                  alt={text.logoAlt}
                  className="w-full h-full object-contain p-2.5"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#333333]" dir="auto">
                {text.cvTitle}
              </h2>

              <p
                className="mt-3 text-center text-sm sm:text-base text-stone-600 leading-relaxed max-w-md mx-auto"
                dir="auto"
              >
                {text.cvIntro}
              </p>

              <div className="mt-6 grid gap-4">
                {CV_DOWNLOADS.map((cv) => (
                  <article
                    key={cv.key}
                    className="rounded-2xl border border-[#DDD8C8] bg-[#F5F5F0] p-4 sm:p-5 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-32 h-32 rounded-2xl border border-[#D4AF37]/40 bg-white p-2 shadow-inner flex items-center justify-center shrink-0">
                        <img
                          src={cv.qrSrc}
                          alt={`${text.scanLabel}: ${cv.name}`}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1 text-center sm:text-start">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#006A4E]">
                          {text.scanLabel}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-[#333333]" dir="auto">
                          {cv.name}
                        </h3>
                        <p className="text-sm text-stone-500">{cv.role}</p>

                        <a
                          href={cv.href}
                          download
                          className="mt-4 w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B89122] text-[#333333] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-[#D4AF37]/25 inline-flex items-center justify-center gap-2"
                        >
                          <span className="text-xs font-bold" aria-hidden="true">
                            PDF
                          </span>
                          <span dir="auto">{text.downloadCv}</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="bg-[#006A4E] hover:bg-[#004D39] text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg flex items-center justify-center mt-7 mx-auto"
              >
                <span dir="auto">{text.startJourney}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
