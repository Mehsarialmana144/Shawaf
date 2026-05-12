import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

function StatCard({ icon, value, label }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold text-[#333333] mb-1">
        {value}
      </div>
      <div className="text-sm text-stone-500" dir="auto">
        {label}
      </div>
    </div>
  )
}

export default function Admin() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'لوحة تحكم الأدمن' : 'Admin Dashboard',
    subtitle: isArabic
      ? 'نظرة عامة على نشاط نظام شواف.'
      : 'Visual overview of Shawaf system activity.',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    totalUsers: isArabic ? 'إجمالي المستخدمين' : 'Total Users',
    savedTrips: isArabic ? 'الرحلات المحفوظة' : 'Saved Trips',
    attractions: isArabic ? 'المعالم' : 'Attractions',
    pendingReports: isArabic ? 'البلاغات المعلقة' : 'Pending Reports',
    monthlyTrips: isArabic ? 'الرحلات الشهرية' : 'Monthly Trips Overview',
    noData: isArabic ? 'لا توجد بيانات' : 'No Data',
    quickActions: isArabic ? 'إجراءات سريعة' : 'Quick Actions',
    manageAttractions: isArabic ? 'إدارة المعالم' : 'Manage Attractions',
    manageAttractionsDesc: isArabic
      ? 'إضافة أو تعديل أو تعطيل الأماكن السياحية.'
      : 'Add, edit, or disable tourist attractions.',
    userReports: isArabic ? 'بلاغات المستخدمين' : 'User Reports',
    userReportsDesc: isArabic
      ? 'مراجعة البلاغات وتحديث حالتها.'
      : 'Review reports and update their status.',
    analytics: isArabic ? 'التحليلات' : 'Analytics',
    analyticsDesc: isArabic
      ? 'عرض الرسوم البيانية والإحصاءات.'
      : 'View charts and system statistics.',
    open: isArabic ? 'فتح' : 'Open',
  }

  const [stats, setStats] = useState({
    users: 0,
    trips: 0,
    attractions: 0,
    reports: 0,
  })

  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)

    const [profilesRes, tripsRes, attractionsRes, reportsRes, tripsListRes] =
      await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('trips').select('id', { count: 'exact', head: true }),
        supabase.from('attractions').select('id', { count: 'exact', head: true }),
        supabase
          .from('user_reports')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('trips')
          .select('created_at')
          .order('created_at', { ascending: true }),
      ])

    setStats({
      users: profilesRes.count || 0,
      trips: tripsRes.count || 0,
      attractions: attractionsRes.count || 0,
      reports: reportsRes.count || 0,
    })

    const monthCounts = {}

    ;(tripsListRes.data || []).forEach((trip) => {
      const date = new Date(trip.created_at)

      const month = date.toLocaleString(isArabic ? 'ar-SA' : 'en', {
        month: 'short',
      })

      monthCounts[month] = (monthCounts[month] || 0) + 1
    })

    const data = Object.entries(monthCounts).map(([month, trips]) => ({
      month,
      trips,
    }))

    setChartData(data.length ? data : [{ month: text.noData, trips: 0 }])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const actionCards = [
    {
      title: text.manageAttractions,
      desc: text.manageAttractionsDesc,
      icon: '📍',
      to: '/admin/attractions',
    },
    {
      title: text.userReports,
      desc: text.userReportsDesc,
      icon: '📝',
      to: '/admin/reports',
    },
    {
      title: text.analytics,
      desc: text.analyticsDesc,
      icon: '📊',
      to: '/admin/analytics',
    },
  ]

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

        <button onClick={loadStats} className="btn-outline shrink-0">
          {text.refresh}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
        <StatCard icon="👥" value={stats.users} label={text.totalUsers} />
        <StatCard icon="🧳" value={stats.trips} label={text.savedTrips} />
        <StatCard icon="📍" value={stats.attractions} label={text.attractions} />
        <StatCard icon="📝" value={stats.reports} label={text.pendingReports} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="card p-4 sm:p-6 lg:col-span-2 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.monthlyTrips}
          </h2>

          <div className="h-64 sm:h-72 w-full min-w-0" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDD8C8" />
                <XAxis dataKey="month" stroke="#78716c" />
                <YAxis stroke="#78716c" />
                <Tooltip />
                <Bar dataKey="trips" fill="#006A4E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.quickActions}
          </h2>

          <div className="space-y-3">
            {actionCards.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="block border border-[#DDD8C8] rounded-2xl p-4 hover:border-[#D4AF37] hover:bg-[#FBF6E3] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0">{action.icon}</div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[#333333] text-sm" dir="auto">
                      {action.title}
                    </div>

                    <p className="text-xs text-stone-500 mt-1 leading-relaxed" dir="auto">
                      {action.desc}
                    </p>

                    <div className="text-xs text-[#006A4E] font-medium mt-2" dir="auto">
                      {text.open} {isArabic ? '←' : '→'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}