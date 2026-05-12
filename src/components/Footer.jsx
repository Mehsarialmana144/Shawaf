import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

function Logo() {
  return (
    <div className="flex items-center gap-2.5 shrink-0 min-w-fit">
      <img
        src="/brand/shawaf-logo.png"
        alt="Shawaf logo"
        className="w-10 h-10 object-contain shrink-0"
      />

      <div className="leading-none shrink-0">
        <div className="font-bold text-[#333333] text-base leading-none whitespace-nowrap">
          Shawaf
        </div>
        <div className="text-xs text-stone-500 leading-none whitespace-nowrap mt-1">
          شواف
        </div>
      </div>
    </div>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="hover:text-[#006A4E] transition-colors"
      dir="auto"
    >
      {children}
    </Link>
  )
}

function ContactIcon({ children }) {
  return (
    <span className="w-7 h-7 bg-[#E6F2EE] border border-[#D4AF37]/30 rounded-lg flex items-center justify-center shrink-0 text-[#006A4E]">
      {children}
    </span>
  )
}

export default function Footer() {
  const { t, isRTL } = useLang()

  const text = {
    reportIssue: isRTL ? 'هل تواجه مشكلة؟' : 'Report an Issue',
    resetPassword: isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password',
    location: isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
  }

  return (
    <footer className="bg-white border-t border-[#DDD8C8] mt-14 sm:mt-20 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="min-w-0">
            <Logo />

            <p
              className="mt-4 text-sm text-stone-500 leading-relaxed max-w-sm"
              dir="auto"
            >
              {t('footerDesc')}
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm text-[#006A4E]">
              <ContactIcon>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                  />
                </svg>
              </ContactIcon>

              <span dir="auto">{t('vision2030')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('quickLinks')}
            </h3>

            <ul className="space-y-2 text-sm text-stone-500">
              <li>
                <FooterLink to="/">{t('home')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/planner">{t('tripPlanner')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/itinerary">{t('itinerary')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/map">{t('map')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/report-issue">{text.reportIssue}</FooterLink>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('account')}
            </h3>

            <ul className="space-y-2 text-sm text-stone-500">
              <li>
                <FooterLink to="/signup">{t('signUp')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/signin">{t('signIn')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/profile">{t('profile')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/reset-password">{text.resetPassword}</FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('contactUs')}
            </h3>

            <ul className="space-y-3 text-sm text-stone-500">
              <li className="flex items-center gap-2 min-w-0">
                <ContactIcon>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </ContactIcon>

                <span className="truncate" dir="ltr">
                  info@shawaf.sa
                </span>
              </li>

              <li className="flex items-center gap-2 min-w-0">
                <ContactIcon>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </ContactIcon>

                <span dir="ltr">+966 11 123 4567</span>
              </li>

              <li className="flex items-center gap-2 min-w-0">
                <ContactIcon>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </ContactIcon>

                <span className="min-w-0" dir="auto">
                  {text.location}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#DDD8C8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <span className="text-center sm:text-start" dir="auto">
            © 2026 Shawaf — شواف
          </span>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <FooterLink to="#">{t('privacy')}</FooterLink>
            <FooterLink to="#">{t('terms')}</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  )
}