import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

export default function ResetPassword() {
  const { lang } = useLang()

  const isArabic = lang === 'ar'

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
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-stone-900">Shawaf</h1>
        <p className="text-stone-500 text-sm">شواف</p>
      </div>

      <div className="card w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-orange-500 text-xl">↺</span>

          <h2 className="text-xl font-bold text-stone-900">
            {text.title}
          </h2>
        </div>

        <p className="text-stone-500 text-sm mb-6">
          {text.subtitle}
        </p>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
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
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {text.sending}
              </span>
            ) : (
              text.sendLink
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          <Link
            to="/signin"
            className="text-orange-500 font-semibold hover:text-orange-600"
          >
            {text.backToSignIn}
          </Link>
        </p>
      </div>
    </div>
  )
}