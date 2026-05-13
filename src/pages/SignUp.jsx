import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function SignUp() {
  const { signUp, signIn } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const isArabic = lang === 'ar'
  const logoSrc = '/brand/shawaf-logo.png'

  const text = {
    subtitle: isArabic
      ? 'أنشئ حسابك وابدأ تخطيط رحلتك مع شواف.'
      : 'Create your account and start planning your trip with Shawaf.',
    fullNamePlaceholder: isArabic ? 'الاسم الكامل' : 'Ahmed Al-Rashid',
    emailPlaceholder: isArabic ? 'example@email.com' : 'you@example.com',
    passwordPlaceholder: '••••••••',
    showPassword: isArabic ? 'إظهار كلمة المرور' : 'Show password',
    hidePassword: isArabic ? 'إخفاء كلمة المرور' : 'Hide password',
    creating: isArabic ? 'جاري إنشاء الحساب...' : 'Creating account...',
    success: isArabic
      ? 'تم إنشاء الحساب بنجاح. يتم تحويلك الآن...'
      : 'Account created successfully. Redirecting...',
    signUpFailed: isArabic
      ? 'فشل إنشاء الحساب. إذا كان تأكيد البريد مفعّلًا في Supabase، عطّله للسماح بتسجيل الدخول مباشرة.'
      : 'Sign up failed. If email confirmation is enabled in Supabase, disable it to allow instant login.',
    arrow: isArabic ? '←' : '→',
  }

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signUp({ email, password, fullName })

      if (result?.session || result?.data?.session) {
        setSuccess(true)
        navigate('/planner')
        return
      }

      if (signIn) {
        await signIn({ email, password })
        setSuccess(true)
        navigate('/planner')
        return
      }

      setSuccess(true)
      navigate('/planner')
    } catch (err) {
      setError(err?.message || text.signUpFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center px-4 py-10 sm:py-12 overflow-hidden">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-24 h-24 rounded-3xl bg-white/80 border border-[#D4AF37]/40 flex items-center justify-center shadow-lg mb-3 overflow-hidden">
          <img
            src={logoSrc}
            alt="Shawaf Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#333333] whitespace-nowrap">
          Shawaf
        </h1>
        <p className="text-stone-500 text-sm">شواف</p>
      </div>

      <div className="card w-full max-w-md p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#D4AF37] text-xl"></span>

          <h2 className="text-xl sm:text-2xl font-bold text-[#333333]" dir="auto">
            {t('signUpTitle')}
          </h2>
        </div>

        <p className="text-stone-500 text-sm sm:text-base mb-6 leading-relaxed" dir="auto">
          {text.subtitle}
        </p>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="bg-[#E6F2EE] border border-[#006A4E]/20 text-[#006A4E] px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {text.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {t('fullName')}
            </label>

            <input
              type="text"
              className="input-field"
              placeholder={text.fullNamePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {t('emailAddress')}
            </label>

            <input
              type="email"
              className="input-field"
              placeholder={text.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {t('password')}
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field pe-10"
                placeholder={text.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                dir="ltr"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#006A4E]"
                aria-label={showPassword ? text.hidePassword : text.showPassword}
              >
                {showPassword ? (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full btn-primary justify-center py-3.5 rounded-xl text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2" dir="auto">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {text.creating}
              </span>
            ) : (
              <span dir="auto">
                {t('signUp')} {text.arrow}
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6" dir="auto">
          {t('haveAccount')}{' '}
          <Link
            to="/signin"
            className="text-[#006A4E] font-semibold hover:text-[#004D39]"
          >
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}