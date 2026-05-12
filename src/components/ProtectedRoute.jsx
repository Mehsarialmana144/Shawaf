import { Link } from 'react-router-dom'
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#F5F5F0]">
        <div className="card p-6 sm:p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">🔐</div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] mb-2" dir="auto">
            {text.title}
          </h1>

          <p className="text-stone-500 text-sm sm:text-base mb-5 leading-relaxed" dir="auto">
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