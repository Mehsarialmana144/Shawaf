import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

function HeroSection() {
  const { t, isRTL } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()

  const arrow = isRTL ? '←' : '→'

  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 18% 25%, rgba(212, 175, 55, 0.24), transparent 32%), radial-gradient(circle at 82% 30%, rgba(255, 255, 255, 0.10), transparent 34%), linear-gradient(135deg, #002F24 0%, #006A4E 48%, #0B3B2F 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.28) 0%, transparent 42%), radial-gradient(circle at 80% 20%, rgba(245, 245, 240, 0.14) 0%, transparent 38%), linear-gradient(120deg, rgba(0, 47, 36, 0.45), rgba(0, 106, 78, 0.05))',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(45deg, rgba(255,255,255,0.35) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.35) 25%, transparent 25%)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-sm px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          {t('heroTag')}
        </div>

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
          style={{
            fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif',
          }}
          dir="auto"
        >
          {t('heroTitle')}
        </h1>

        <p className="text-[#D4AF37] text-xl font-semibold mb-6" dir="auto">
          {t('heroBrand')}
        </p>

        <p
          className="text-[#F5F5F0]/85 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          dir="auto"
        >
          {t('heroSub')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate(user ? '/planner' : '/signup')}
            className="bg-[#D4AF37] hover:bg-[#B89122] text-[#333333] font-semibold px-7 py-3.5 rounded-full transition-all shadow-lg hover:shadow-[#D4AF37]/30 flex items-center gap-2"
          >
            {t('startPlanning')} <span>{arrow}</span>
          </button>

          <button
            onClick={() =>
              document
                .getElementById('features')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="border border-[#F5F5F0]/40 hover:border-[#D4AF37] text-[#F5F5F0] hover:text-[#D4AF37] font-medium px-7 py-3.5 rounded-full transition-all backdrop-blur-sm"
          >
            {t('learnMore')}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { val: t('rating'), label: t('ratingLabel') },
            { val: t('cities'), label: t('citiesLabel') },
            { val: t('travelers'), label: t('travelersLabel') },
            { val: t('trips'), label: t('tripsLabel') },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border border-[#D4AF37]/25 rounded-2xl p-4"
            >
              <div className="text-2xl font-bold text-white" dir="auto">
                {stat.val}
              </div>
              <div className="text-xs text-[#F5F5F0]/65 mt-1" dir="auto">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const { t } = useLang()

  const features = [
    { icon: '⚡', title: t('feat1Title'), desc: t('feat1Desc') },
    { icon: '🗺️', title: t('feat2Title'), desc: t('feat2Desc') },
    { icon: '🕐', title: t('feat3Title'), desc: t('feat3Desc') },
    { icon: '📄', title: t('feat4Title'), desc: t('feat4Desc') },
    { icon: '✈️', title: t('feat5Title'), desc: t('feat5Desc') },
    { icon: '🎧', title: t('feat6Title'), desc: t('feat6Desc') },
  ]

  return (
    <section id="features" className="py-20 px-6 bg-[#F5F5F0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">{t('whyChoose')}</h2>
        <div className="section-divider" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#E6F2EE] border border-[#D4AF37]/30 rounded-xl flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>

              <h3 className="font-semibold text-[#333333] text-lg mb-2" dir="auto">
                {f.title}
              </h3>

              <p className="text-stone-500 text-sm leading-relaxed" dir="auto">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const { t, isRTL } = useLang()
  const { user } = useAuth()

  const steps = [
    { num: 1, title: t('step1'), desc: t('step1Desc') },
    { num: 2, title: t('step2'), desc: t('step2Desc') },
    { num: 3, title: t('step3'), desc: t('step3Desc') },
    { num: 4, title: t('step4'), desc: t('step4Desc') },
  ]

  const displayedSteps = isRTL ? [...steps].reverse() : steps

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">{t('howItWorks')}</h2>
        <div className="section-divider" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {displayedSteps.map((step, i) => (
            <div
              key={step.num}
              className="flex flex-col items-center text-center relative"
            >
              {i < displayedSteps.length - 1 && (
                <div className="hidden lg:block absolute top-6 start-[calc(50%+28px)] w-full h-0.5 bg-[#DDD8C8] z-0" />
              )}

              <div className="w-14 h-14 bg-[#006A4E] border border-[#D4AF37]/40 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg relative z-10 mb-4">
                {step.num}
              </div>

              <h3 className="font-semibold text-[#333333] mb-2" dir="auto">
                {step.title}
              </h3>

              <p className="text-sm text-stone-500 leading-relaxed" dir="auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to={user ? '/planner' : '/signup'} className="btn-primary">
            {t('ctaBtn')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const { t } = useLang()

  const testimonials = [
    { quote: t('t1'), name: t('t1Name'), city: t('t1City') },
    { quote: t('t2'), name: t('t2Name'), city: t('t2City') },
    { quote: t('t3'), name: t('t3Name'), city: t('t3City') },
  ]

  return (
    <section className="py-20 px-6 bg-[#F5F5F0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">{t('travelers_say')}</h2>
        <div className="section-divider" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="card p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < 4 ? 'text-[#D4AF37]' : 'text-[#D4AF37]/50'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p
                className="text-stone-600 text-sm leading-relaxed mb-5 italic"
                dir="auto"
              >
                {testimonial.quote}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#E6F2EE] border border-[#D4AF37]/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#006A4E]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>

                <div>
                  <div className="font-semibold text-[#333333] text-sm" dir="auto">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-stone-400" dir="auto">
                    {testimonial.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTABannerSection() {
  const { t, isRTL } = useLang()
  const { user } = useAuth()

  const arrow = isRTL ? '←' : '→'

  return (
    <section className="py-6 px-6 bg-[#F5F5F0]">
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-3xl px-8 py-14 text-center text-white border border-[#D4AF37]/35 shadow-xl overflow-hidden relative"
          style={{
            background:
              'radial-gradient(circle at 18% 25%, rgba(212, 175, 55, 0.22), transparent 34%), linear-gradient(135deg, #003B2D 0%, #006A4E 55%, #002F24 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                'linear-gradient(45deg, rgba(245,245,240,0.45) 25%, transparent 25%), linear-gradient(-45deg, rgba(245,245,240,0.45) 25%, transparent 25%)',
              backgroundSize: '70px 70px',
            }}
          />

          <div className="relative z-10">
            <div className="text-5xl mb-6">🏅</div>

            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{
                fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif',
              }}
              dir="auto"
            >
              {t('ctaTitle')}
            </h2>

            <p className="text-[#F5F5F0]/80 mb-8 text-base" dir="auto">
              {t('ctaSub')}
            </p>

            <Link
              to={user ? '/planner' : '/signup'}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B89122] text-[#333333] font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg"
            >
              {t('ctaBtn')} <span>{arrow}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTABannerSection />
    </>
  )
} 