import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
      <div>
        <div className="font-bold text-stone-900 text-lg leading-none">Shawaf</div>
        <div className="text-xs text-stone-500 leading-none">شواف</div>
      </div>
    </Link>
  )
}

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { t, toggle, lang } = useLang()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const navLinks = user
    ? [
        { path: '/', label: t('home') },
        { path: '/planner', label: t('tripPlanner') },
        { path: '/itinerary', label: t('itinerary') },
        { path: '/map', label: t('map') },
        { path: '/profile', label: t('profile') },
      ]
    : [{ path: '/', label: t('home') }]

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive(path)
                  ? 'bg-orange-500 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            {lang === 'en' ? 'عربي' : 'English'}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-stone-700 hidden sm:block">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="p-2 text-stone-500 hover:text-stone-700 transition-colors"
                title={t('signOut')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/signin" className="text-sm font-medium text-stone-700 hover:text-orange-600 transition-colors px-3 py-2">
                {t('signIn')}
              </Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-5">
                {t('signUp')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
