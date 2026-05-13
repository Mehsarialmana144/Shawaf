import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

export default function ResetPassword() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'
  const logoSrc = '/shawaf-logo.png'

  const text = {
    title: isArabic ? 'إعادة تعيين كلمة المرور' : 'Reset Password',
    subtitle: isArabic
      ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.'
      : 'Enter your email and we will send you a password reset link.',
    email: isArabic ? 'البريد الإلكتروني' : 'Email Address',
    emailPlaceholder: isArabic ? 'example@email.com' : 'you@example.com',
    sendLink: isArabic ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link',
    sending: isArabic ? 'جاري الإرسال...' : 'Sending...',
    success: isArabic
      ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
      : 'Password reset link has been sent to your email.',
    failed: isArabic
      ? 'فشل إرسال رابط إعادة تعيين كلمة المرور.'
      : 'Failed to send reset password email.',
    backToSignIn: isArabic ? 'العودة لتسجيل الدخول' : 'Back to Sign In',
  }

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const redirectTo = `${window.location.origin}/update-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) throw error

      setMessage(text.success)
    } catch (err) {
      setError(err.message || text.failed)
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
          <span className="text-[#006A4E] text-xl">↺</span>

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

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {text.email}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3.5 rounded-xl text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2" dir="auto">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {text.sending}
              </span>
            ) : (
              text.sendLink
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