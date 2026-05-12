import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const { lang } = useLang()

  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'تسجيل الدخول مطلوب' : 'Sign In Required',
    message: isArabic
      ? 'يجب تسجيل الدخول للوصول إلى هذه الصفحة.'
      : 'You need to sign in to access this page.',
    signIn: isArabic ? 'تسجيل الدخول' : 'Sign In',
    backHome: isArabic ? 'العودة للرئيسية' : 'Back to Home',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-8 max-w-md text-center">
          <div className="text-5xl mb-4">🔐</div>

          <h1 className="text-xl font-bold text-stone-900 mb-2">
            {text.title}
          </h1>

          <p className="text-stone-500 text-sm mb-5">
            {text.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signin" className="btn-primary justify-center">
              {text.signIn}
            </Link>

            <Link to="/" className="btn-outline justify-center">
              {text.backHome}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}