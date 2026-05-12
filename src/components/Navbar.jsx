import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 shrink-0 min-w-fit"
      aria-label="Go to home"
    >
      <img
        src="/brand/shawaf-logo.png"
        alt="Shawaf logo"
        className="w-11 h-11 object-contain shrink-0"
      />

      <div className="leading-none shrink-0">
        <div className="font-bold text-[#333333] text-base sm:text-lg leading-none whitespace-nowrap">
          Shawaf
        </div>
        <div className="text-xs text-stone-500 leading-none whitespace-nowrap mt-1">
          شواف
        </div>
      </div>
    </Link>
  )
}

export default function Navbar() {
  const { user, profile, signOut, isAdmin, loading } = useAuth()
  const { t, toggle, lang } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdminArea = location.pathname.startsWith('/admin')

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const adminLinks = [
    { path: '/admin', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard' },
    { path: '/admin/attractions', label: lang === 'ar' ? 'إدارة المعالم' : 'Attractions' },
    { path: '/admin/reports', label: lang === 'ar' ? 'بلاغات المستخدمين' : 'Reports' },
    { path: '/admin/analytics', label: lang === 'ar' ? 'الإحصائيات' : 'Analytics' },
  ]

  const userLinks = [
    { path: '/', label: t('home') },
    { path: '/planner', label: t('tripPlanner') },
    { path: '/itinerary', label: t('itinerary') },
    { path: '/map', label: t('map') },
    { path: '/profile', label: t('profile') },
  ]

  const navLinks = user
    ? isAdmin || isAdminArea
      ? adminLinks
      : userLinks
    : [{ path: '/', label: t('home') }]

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    ''

  const handleSignOut = async () => {
    await signOut()
    setMobileOpen(false)
    navigate('/')
  }

  const handleNavigate = () => {
    setMobileOpen(false)
  }

  return (
    <nav className="bg-white border-b border-[#DDD8C8] sticky top-0 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Logo />

        <div className="hidden lg:flex items-center gap-1">
          {!loading &&
            navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(path)
                    ? 'bg-[#006A4E] text-white'
                    : 'text-stone-600 hover:text-[#006A4E] hover:bg-[#E6F2EE]'
                }`}
              >
                {label}
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 hover:text-[#006A4E] transition-colors shrink-0"
            type="button"
          >
            <svg
              className="w-4 h-4 shrink-0"
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

            <span className="whitespace-nowrap">
              {lang === 'en' ? 'عربي' : 'English'}
            </span>
          </button>

          {loading ? (
            <div className="w-8 h-8 rounded-full border-2 border-[#006A4E] border-t-transparent animate-spin" />
          ) : user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-[#E6F2EE] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 hover:border-[#006A4E] transition-colors"
                title={t('profile')}
                aria-label={t('profile')}
              >
                <svg
                  className="w-5 h-5 text-[#006A4E]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </Link>

              <div className="hidden md:flex flex-col leading-tight max-w-[140px]">
                <Link
                  to="/profile"
                  className="text-sm font-medium text-stone-700 hover:text-[#006A4E] truncate"
                  dir="auto"
                >
                  {displayName}
                </Link>

                {isAdmin && (
                  <span className="text-xs font-semibold text-[#D4AF37]">
                    {lang === 'ar' ? 'أدمن' : 'Admin'}
                  </span>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 text-stone-500 hover:text-[#006A4E] transition-colors"
                title={t('signOut')}
                type="button"
              >
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/signin"
                className="text-sm font-medium text-stone-600 hover:text-[#006A4E] transition-colors whitespace-nowrap"
              >
                {t('signIn')}
              </Link>

              <Link
                to="/signup"
                className="btn-primary text-sm py-2 px-4 whitespace-nowrap"
              >
                {t('signUp')}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden w-9 h-9 rounded-xl border border-[#DDD8C8] text-[#333333] hover:text-[#006A4E] hover:border-[#D4AF37] flex items-center justify-center transition-colors shrink-0"
            aria-label={lang === 'ar' ? 'فتح القائمة' : 'Open menu'}
          >
            {mobileOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#DDD8C8] bg-white">
          <div className="px-3 py-3 space-y-2">
            {!loading &&
              navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={handleNavigate}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-[#006A4E] text-white'
                      : 'text-stone-600 hover:text-[#006A4E] hover:bg-[#E6F2EE]'
                  }`}
                  dir="auto"
                >
                  {label}
                </Link>
              ))}

            <div className="pt-2 border-t border-[#DDD8C8]">
              {user ? (
                <div className="space-y-3">
                  <Link
                    to="/profile"
                    onClick={handleNavigate}
                    className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#E6F2EE] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E6F2EE] border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-[#006A4E]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <div
                        className="text-sm font-medium text-[#333333] truncate"
                        dir="auto"
                      >
                        {displayName}
                      </div>

                      {isAdmin && (
                        <div className="text-xs font-semibold text-[#D4AF37]">
                          {lang === 'ar' ? 'أدمن' : 'Admin'}
                        </div>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-start px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    type="button"
                  >
                    {t('signOut')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    to="/signin"
                    onClick={handleNavigate}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:text-[#006A4E] hover:bg-[#E6F2EE] transition-colors"
                  >
                    {t('signIn')}
                  </Link>

                  <Link
                    to="/signup"
                    onClick={handleNavigate}
                    className="btn-primary justify-center text-sm py-3"
                  >
                    {t('signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}