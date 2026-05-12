import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

const REPORT_TYPE_LABELS_AR = {
  technical: 'مشكلة تقنية',
  itinerary: 'مشكلة في الخطة',
  attraction: 'مشكلة في معلومات مكان',
  map: 'مشكلة في الخريطة أو الموقع',
  other: 'أخرى',
}

const REPORT_TYPE_LABELS_EN = {
  technical: 'Technical Issue',
  itinerary: 'Itinerary Issue',
  attraction: 'Attraction Information Issue',
  map: 'Map / Location Issue',
  other: 'Other',
}

const STATUS_LABELS_AR = {
  pending: 'قيد الانتظار',
  reviewed: 'تمت المراجعة',
  resolved: 'تم الحل',
  dismissed: 'تم التجاهل',
}

const STATUS_LABELS_EN = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
}

function getReportTypeLabel(type, lang) {
  if (!type) return ''
  return lang === 'ar'
    ? REPORT_TYPE_LABELS_AR[type] || type
    : REPORT_TYPE_LABELS_EN[type] || type
}

function getStatusLabel(status, lang) {
  if (!status) return ''
  return lang === 'ar'
    ? STATUS_LABELS_AR[status] || status
    : STATUS_LABELS_EN[status] || status
}

function formatDate(dateValue, lang) {
  if (!dateValue) return ''

  return new Date(dateValue).toLocaleDateString(
    lang === 'ar' ? 'ar-SA' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  )
}

function getStatusClass(status) {
  if (status === 'resolved') {
    return 'bg-[#E6F2EE] text-[#006A4E] border-[#006A4E]/20'
  }

  if (status === 'reviewed') {
    return 'bg-[#FBF6E3] text-[#8A6F18] border-[#D4AF37]/35'
  }

  if (status === 'dismissed') {
    return 'bg-stone-100 text-stone-500 border-stone-200'
  }

  return 'bg-white text-[#006A4E] border-[#D4AF37]/45'
}

export default function AdminReports() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'إدارة بلاغات المستخدمين' : 'Manage User Reports',
    subtitle: isArabic
      ? 'مراجعة البلاغات المرسلة من المستخدمين وتحديث حالتها.'
      : 'Review and update user-submitted reports.',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    type: isArabic ? 'النوع' : 'Type',
    message: isArabic ? 'الرسالة' : 'Message',
    status: isArabic ? 'الحالة' : 'Status',
    date: isArabic ? 'التاريخ' : 'Date',
    action: isArabic ? 'الإجراء' : 'Action',
    noReports: isArabic ? 'لا توجد بلاغات حتى الآن.' : 'No reports yet.',
    pending: isArabic ? 'قيد الانتظار' : 'Pending',
    reviewed: isArabic ? 'تمت المراجعة' : 'Reviewed',
    resolved: isArabic ? 'تم الحل' : 'Resolved',
    dismissed: isArabic ? 'تم التجاهل' : 'Dismissed',
    updateFailed: isArabic ? 'فشل تحديث حالة البلاغ.' : 'Failed to update report status.',
    loadFailed: isArabic ? 'فشل تحميل البلاغات.' : 'Failed to load reports.',
  }

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('user_reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message || text.loadFailed)
    } else {
      setReports(data || [])
    }

    setLoading(false)
  }

  const handleStatusChange = async (id, status) => {
    setError('')

    const { error } = await supabase
      .from('user_reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      setError(error.message || text.updateFailed)
      return
    }

    await loadReports()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h1>

          <p className="text-sm text-stone-500 mt-1 leading-relaxed" dir="auto">
            {text.subtitle}
          </p>
        </div>

        <button onClick={loadReports} className="btn-outline shrink-0">
          {text.refresh}
        </button>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5"
          dir="auto"
        >
          {error}
        </div>
      )}

      <div className="card p-4 sm:p-6 min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-stone-500 border-b border-stone-100">
                <th className="text-start pb-3 font-medium">{text.type}</th>
                <th className="text-start pb-3 font-medium">{text.message}</th>
                <th className="text-start pb-3 font-medium">{text.status}</th>
                <th className="text-start pb-3 font-medium">{text.date}</th>
                <th className="text-start pb-3 font-medium">{text.action}</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-400" dir="auto">
                    {text.noReports}
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-stone-50 last:border-0 align-top"
                  >
                    <td className="py-3.5 text-stone-700" dir="auto">
                      {getReportTypeLabel(report.report_type, lang)}
                    </td>

                    <td className="py-3.5 text-stone-600 max-w-md leading-relaxed" dir="auto">
                      {report.message}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(
                          report.status
                        )}`}
                        dir="auto"
                      >
                        {getStatusLabel(report.status, lang)}
                      </span>
                    </td>

                    <td className="py-3.5 text-stone-500 whitespace-nowrap" dir="auto">
                      {formatDate(report.created_at, lang)}
                    </td>

                    <td className="py-3.5">
                      <select
                        className="border border-[#DDD8C8] rounded-lg px-2 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E]"
                        value={report.status}
                        onChange={(e) =>
                          handleStatusChange(report.id, e.target.value)
                        }
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        <option value="pending">{text.pending}</option>
                        <option value="reviewed">{text.reviewed}</option>
                        <option value="resolved">{text.resolved}</option>
                        <option value="dismissed">{text.dismissed}</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-stone-400 mt-3" dir="auto">
          {reports.length} {isArabic ? 'بلاغ' : 'reports'}
        </p>
      </div>
    </div>
  )
}