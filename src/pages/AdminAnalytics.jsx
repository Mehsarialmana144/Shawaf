import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

const CITY_LABELS_AR = {
  Riyadh: 'الرياض',
  Diriyah: 'الدرعية',
  Jeddah: 'جدة',
  Mecca: 'مكة',
  Medina: 'المدينة المنورة',
  Dammam: 'الدمام',
  'Al-Khobar': 'الخبر',
  Dhahran: 'الظهران',
  'Al-Ahsa': 'الأحساء',
  'Al-Ula': 'العلا',
  NEOM: 'نيوم',
  Abha: 'أبها',
  Taif: 'الطائف',
  Yanbu: 'ينبع',
  Tabuk: 'تبوك',
  Hail: 'حائل',
  Najran: 'نجران',
  Jizan: 'جازان',
  Buraidah: 'بريدة',
  Jubail: 'الجبيل',
  'Al-Baha': 'الباحة',
  Sakaka: 'سكاكا',
  'Hafar Al-Batin': 'حفر الباطن',
  KAEC: 'مدينة الملك عبدالله الاقتصادية',
}

const STATUS_LABELS_AR = {
  pending: 'قيد الانتظار',
  reviewed: 'تمت المراجعة',
  resolved: 'تم الحل',
  dismissed: 'تم التجاهل',
  active: 'نشط',
  inactive: 'غير نشط',
}

const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

const COLORS = ['#006A4E', '#D4AF37', '#004D39', '#B89122', '#6FAE9B', '#DDD8C8']

function getCityLabel(city, lang) {
  if (!city) return lang === 'ar' ? 'غير محدد' : 'Unknown'
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
}

function getStatusLabel(status, lang) {
  if (!status) return lang === 'ar' ? 'غير محدد' : 'Unknown'
  return lang === 'ar' ? STATUS_LABELS_AR[status] || status : status
}

function getCategoryLabel(category, lang) {
  if (!category) return lang === 'ar' ? 'غير محدد' : 'Unknown'
  return lang === 'ar' ? CATEGORY_LABELS_AR[category] || category : category
}

function countByField(items, field, labelFormatter) {
  const counts = {}

  items.forEach((item) => {
    const key = item[field] || 'Unknown'
    counts[key] = (counts[key] || 0) + 1
  })

  return Object.entries(counts).map(([key, value]) => ({
    name: labelFormatter(key),
    value,
  }))
}

export default function AdminAnalytics() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'تحليلات النظام' : 'Analytics',
    subtitle: isArabic
      ? 'رسوم بيانية وإحصاءات توضح نشاط شواف.'
      : 'Charts and insights for Shawaf system activity.',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    tripsByCity: isArabic ? 'الرحلات حسب المدينة' : 'Trips by City',
    attractionsByCity: isArabic ? 'المعالم حسب المدينة' : 'Attractions by City',
    attractionsByCategory: isArabic ? 'المعالم حسب التصنيف' : 'Attractions by Category',
    reportsByStatus: isArabic ? 'البلاغات حسب الحالة' : 'Reports by Status',
    noData: isArabic ? 'لا توجد بيانات' : 'No data available',
  }

  const [tripsByCity, setTripsByCity] = useState([])
  const [attractionsByCity, setAttractionsByCity] = useState([])
  const [attractionsByCategory, setAttractionsByCategory] = useState([])
  const [reportsByStatus, setReportsByStatus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalytics()
  }, [lang])

  const loadAnalytics = async () => {
    setLoading(true)
    setError('')

    const [tripsRes, attractionsRes, reportsRes] = await Promise.all([
      supabase.from('trips').select('city, ai_plan'),
      supabase.from('attractions').select('city, category, status'),
      supabase.from('user_reports').select('status'),
    ])

    if (tripsRes.error || attractionsRes.error || reportsRes.error) {
      setError(
        tripsRes.error?.message ||
          attractionsRes.error?.message ||
          reportsRes.error?.message ||
          'Failed to load analytics'
      )
      setLoading(false)
      return
    }

    const normalizedTrips = (tripsRes.data || []).map((trip) => {
      const firstCity =
        trip.ai_plan?.cities?.[0] ||
        trip.city?.split('→')?.[0]?.trim() ||
        trip.city

      return {
        city: firstCity,
      }
    })

    setTripsByCity(
      countByField(normalizedTrips, 'city', (city) => getCityLabel(city, lang))
    )

    setAttractionsByCity(
      countByField(attractionsRes.data || [], 'city', (city) =>
        getCityLabel(city, lang)
      )
    )

    setAttractionsByCategory(
      countByField(attractionsRes.data || [], 'category', (category) =>
        getCategoryLabel(category, lang)
      )
    )

    setReportsByStatus(
      countByField(reportsRes.data || [], 'status', (status) =>
        getStatusLabel(status, lang)
      )
    )

    setLoading(false)
  }

  const renderEmpty = () => (
    <div className="h-64 flex items-center justify-center text-stone-400 text-sm text-center px-4">
      {text.noData}
    </div>
  )

  const renderBarChart = (data) => {
    if (!data.length) return renderEmpty()

    return (
      <div className="h-64 sm:h-72 w-full min-w-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDD8C8" />
            <XAxis dataKey="name" stroke="#78716c" tick={{ fontSize: 11 }} />
            <YAxis stroke="#78716c" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#006A4E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderPieChart = (data) => {
    if (!data.length) return renderEmpty()

    return (
      <div className="h-64 sm:h-72 w-full min-w-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
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

        <button onClick={loadAnalytics} className="btn-outline shrink-0">
          {text.refresh}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5" dir="auto">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.tripsByCity}
          </h2>
          {renderBarChart(tripsByCity)}
        </div>

        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.attractionsByCity}
          </h2>
          {renderBarChart(attractionsByCity)}
        </div>

        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.attractionsByCategory}
          </h2>
          {renderPieChart(attractionsByCategory)}
        </div>

        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.reportsByStatus}
          </h2>
          {renderPieChart(reportsByStatus)}
        </div>
      </div>
    </div>
  )
}