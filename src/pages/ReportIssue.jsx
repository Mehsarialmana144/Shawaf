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
    <div className="py-12 px-6 max-w-3xl mx-auto">
      <div className="card p-8">
        <div className="mb-6">
          <div className="text-4xl mb-3">🚩</div>

          <h1 className="text-2xl font-bold text-stone-900">
            {text.title}
          </h1>

          <p className="text-sm text-stone-500 mt-2 leading-relaxed">
            {text.subtitle}
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-5">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              {text.issueType}
            </label>

            <select
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {isArabic ? type.labelAr : type.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
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
            <div className="bg-orange-50 border border-orange-100 text-orange-700 px-4 py-3 rounded-xl text-sm">
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