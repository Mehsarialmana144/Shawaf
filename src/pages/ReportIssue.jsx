import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function ReportIssue() {
  const { user } = useAuth()
  const { lang } = useLang()

  const isArabic = lang === 'ar'

  const [reportType, setReportType] = useState('technical')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const text = {
    title: isArabic ? 'هل تواجه مشكلة؟' : 'Report an Issue',
    subtitle: isArabic
      ? 'إذا واجهت مشكلة في الخطة، الخريطة، معلومات الأماكن، أو الموقع بشكل عام، أرسل لنا بلاغًا وسيظهر للأدمن للمراجعة.'
      : 'If you face an issue with the itinerary, map, attraction information, or the website, submit a report and the admin will review it.',
    issueType: isArabic ? 'نوع المشكلة' : 'Issue Type',
    issueDescription: isArabic ? 'وصف المشكلة' : 'Issue Description',
    placeholder: isArabic
      ? 'اكتب تفاصيل المشكلة هنا...'
      : 'Describe the issue here...',
    submit: isArabic ? 'إرسال البلاغ' : 'Submit Report',
    submitting: isArabic ? 'جاري الإرسال...' : 'Submitting...',
    backHome: isArabic ? 'العودة للرئيسية' : 'Back to Home',
    messageRequired: isArabic
      ? 'اكتب وصف المشكلة أولًا.'
      : 'Please describe the issue.',
    success: isArabic
      ? 'تم إرسال البلاغ بنجاح. شكرًا لمساعدتك في تحسين شواف.'
      : 'Your report has been submitted successfully. Thank you for helping improve Shawaf.',
    failed: isArabic ? 'فشل إرسال البلاغ.' : 'Failed to submit report.',
    guestNote: isArabic
      ? 'ملاحظة: يمكنك إرسال البلاغ بدون تسجيل دخول، لكن تسجيل الدخول يساعد في ربط البلاغ بحسابك.'
      : 'Note: You can submit a report without signing in, but signing in helps link the report to your account.',
  }

  const reportTypes = [
    {
      value: 'technical',
      labelEn: 'Technical Issue',
      labelAr: 'مشكلة تقنية',
    },
    {
      value: 'itinerary',
      labelEn: 'Itinerary Issue',
      labelAr: 'مشكلة في الخطة',
    },
    {
      value: 'attraction',
      labelEn: 'Attraction Information Issue',
      labelAr: 'مشكلة في معلومات مكان',
    },
    {
      value: 'map',
      labelEn: 'Map or Location Issue',
      labelAr: 'مشكلة في الخريطة أو الموقع',
    },
    {
      value: 'other',
      labelEn: 'Other',
      labelAr: 'أخرى',
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    try {
      if (!message.trim()) {
        throw new Error(text.messageRequired)
      }

      const { error } = await supabase.from('user_reports').insert([
        {
          user_id: user?.id || null,
          trip_id: null,
          report_type: reportType,
          message: message.trim(),
          status: 'pending',
        },
      ])

      if (error) throw error

      setSuccess(text.success)
      setReportType('technical')
      setMessage('')
    } catch (err) {
      setError(err.message || text.failed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden">
      <div className="card p-5 sm:p-8">
        <div className="mb-6">
          <div className="w-14 h-14 bg-[#E6F2EE] border border-[#D4AF37]/35 rounded-2xl flex items-center justify-center text-3xl mb-4">
            🚩
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-500 mt-2 leading-relaxed" dir="auto">
            {text.subtitle}
          </p>
        </div>

        {success && (
          <div
            className="bg-[#E6F2EE] border border-[#006A4E]/20 text-[#006A4E] px-4 py-3 rounded-xl text-sm mb-5"
            dir="auto"
          >
            {success}
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5"
            dir="auto"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5" dir="auto">
              {text.issueType}
            </label>

            <select
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {isArabic ? type.labelAr : type.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5" dir="auto">
              {text.issueDescription}
            </label>

            <textarea
              className="input-field min-h-[150px] resize-none"
              placeholder={text.placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              dir="auto"
            />
          </div>

          {!user && (
            <div
              className="bg-[#FBF6E3] border border-[#D4AF37]/40 text-[#6B571B] px-4 py-3 rounded-xl text-sm leading-relaxed"
              dir="auto"
            >
              {text.guestNote}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center disabled:opacity-60"
            >
              {loading ? text.submitting : text.submit}
            </button>

            <Link to="/" className="btn-outline justify-center">
              {text.backHome}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}