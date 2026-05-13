import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

export default function UpdatePassword() {
  const { lang } = useLang()
  const navigate = useNavigate()

  const isArabic = lang === 'ar'
  const logoSrc = '/shawaf-logo.png'

  const text = {
    title: isArabic ? 'تحديث كلمة المرور' : 'Update Password',
    subtitle: isArabic
      ? 'أدخل كلمة المرور الجديدة لحسابك.'
      : 'Enter your new password for your account.',
    newPassword: isArabic ? 'كلمة المرور الجديدة' : 'New Password',
    confirmPassword: isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password',
    passwordPlaceholder: '••••••••',
    updatePassword: isArabic ? 'تحديث كلمة المرور' : 'Update Password',
    updating: isArabic ? 'جاري التحديث...' : 'Updating...',
    success: isArabic
      ? 'تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.'
      : 'Password updated successfully. You can sign in now.',
    failed: isArabic
      ? 'فشل تحديث كلمة المرور.'
      : 'Failed to update password.',
    passwordRequired: isArabic
      ? 'أدخل كلمة المرور الجديدة.'
      : 'Please enter a new password.',
    passwordShort: isArabic
      ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.'
      : 'Password must be at least 6 characters.',
    passwordMismatch: isArabic
      ? 'كلمتا المرور غير متطابقتين.'
      : 'Passwords do not match.',
    backToSignIn: isArabic ? 'العودة لتسجيل الدخول' : 'Back to Sign In',
    showPassword: isArabic ? 'إظهار كلمة المرور' : 'Show password',
    hidePassword: isArabic ? 'إخفاء كلمة المرور' : 'Hide password',
  }

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const validate = () => {
    if (!password.trim()) return text.passwordRequired
    if (password.length < 6) return text.passwordShort
    if (password !== confirmPassword) return text.passwordMismatch
    return ''
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const validationError = validate()

      if (validationError) {
        throw new Error(validationError)
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setMessage(text.success)
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/signin')
      }, 1500)
    } catch (err) {
      setError(err.message || text.failed)
    } finally {
      setLoading(false)
    }
  }

  const PasswordToggleIcon = ({ visible }) =>
    visible ? (
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
    )

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
          <span className="text-[#006A4E] text-xl">🔐</span>

          <h2 className="text-xl sm:text-2xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h2>
        </div>

        <p className="text-stone-500 text-sm sm:text-base mb-6 leading-relaxed" dir="auto">
          {text.subtitle}
        </p>

        {message && (
          <div
            className="bg-[#E6F2EE] border border-[#006A4E]/20 text-[#006A4E] px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {text.newPassword}
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
                onClick={() => setShowPassword((value) => !value)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#006A4E]"
                aria-label={showPassword ? text.hidePassword : text.showPassword}
              >
                <PasswordToggleIcon visible={showPassword} />
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {text.confirmPassword}
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-field pe-10"
                placeholder={text.passwordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                dir="ltr"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#006A4E]"
                aria-label={
                  showConfirmPassword ? text.hidePassword : text.showPassword
                }
              >
                <PasswordToggleIcon visible={showConfirmPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3.5 rounded-xl text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2" dir="auto">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {text.updating}
              </span>
            ) : (
              text.updatePassword
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6" dir="auto">
          <Link
            to="/signin"
            className="text-[#006A4E] font-semibold hover:text-[#004D39]"
          >
            {text.backToSignIn}
          </Link>
        </p>
      </div>
    </div>
  )
}