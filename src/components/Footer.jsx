import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
      <div>
        <div className="font-bold text-stone-900 text-base leading-none">Shawaf</div>
        <div className="text-xs text-stone-500 leading-none">شواف</div>
      </div>
    </div>
  )
}

export default function Footer() {
  const { t, isRTL } = useLang()

  return (
    <footer className="bg-white border-t border-stone-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-4 text-sm text-stone-500 leading-relaxed">{t('footerDesc')}</p>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-orange-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
              {t('vision2030')}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link to="/" className="hover:text-orange-600 transition-colors">{t('home')}</Link></li>
              <li><Link to="/planner" className="hover:text-orange-600 transition-colors">{t('tripPlanner')}</Link></li>
              <li><Link to="/itinerary" className="hover:text-orange-600 transition-colors">{t('itinerary')}</Link></li>
              <li><Link to="/map" className="hover:text-orange-600 transition-colors">{t('map')}</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4">{t('account')}</h3>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link to="/signup" className="hover:text-orange-600 transition-colors">{t('signUp')}</Link></li>
              <li><Link to="/signin" className="hover:text-orange-600 transition-colors">{t('signIn')}</Link></li>
              <li><Link to="/profile" className="hover:text-orange-600 transition-colors">{t('profile')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4">{t('contactUs')}</h3>
            <ul className="space-y-2 text-sm text-stone-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@shawaf.sa
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +966 11 123 4567
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <span>© 2026 Shawaf — شواف</span>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-orange-500 transition-colors">{t('privacy')}</Link>
            <Link to="#" className="hover:text-orange-500 transition-colors">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
