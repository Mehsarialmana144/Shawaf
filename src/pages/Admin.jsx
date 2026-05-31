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

function formatGiveawayDate(dateValue, lang) {
  if (!dateValue) return '—'

  return new Date(dateValue).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
    giveawayDraw: isArabic ? 'سحب القيف أوي' : 'Giveaway Draw',
    giveawayDrawDesc: isArabic
      ? 'اختر فائزًا عشوائيًا من المشاركين المسجلين في صفحة القيف أوي.'
      : 'Pick a random winner from the giveaway check-in entries.',
    giveawayEntries: isArabic ? 'عدد المشاركين' : 'Entries',
    pickWinner: isArabic ? 'اختيار الفائز' : 'Pick Winner',
    pickingWinner: isArabic ? 'جاري الاختيار...' : 'Picking...',
    winner: isArabic ? 'الفائز' : 'Winner',
    winnerName: isArabic ? 'الاسم' : 'Name',
    winnerEmail: isArabic ? 'الإيميل' : 'Email',
    participants: isArabic ? 'المشاركون' : 'Participants',
    participantName: isArabic ? 'الاسم' : 'Name',
    participantEmail: isArabic ? 'الإيميل' : 'Email',
    participantTicket: isArabic ? 'رقم التذكرة' : 'Ticket',
    participantDate: isArabic ? 'وقت التسجيل' : 'Checked In',
    noEntries: isArabic
      ? 'لا يوجد مشاركون في السحب حتى الآن.'
      : 'No giveaway entries yet.',
    giveawayLoadFailed: isArabic
      ? 'فشل تحميل بيانات القيف أوي.'
      : 'Failed to load giveaway entries.',
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
  const [giveawayEntries, setGiveawayEntries] = useState([])
  const [giveawayWinner, setGiveawayWinner] = useState(null)
  const [giveawayError, setGiveawayError] = useState('')
  const [pickingWinner, setPickingWinner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)

    setGiveawayError('')

    const [
      profilesRes,
      tripsRes,
      attractionsRes,
      reportsRes,
      tripsListRes,
      giveawayRes,
    ] =
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
        supabase
          .from('giveaway_entries')
          .select('full_name, email, ticket_number, created_at')
          .order('created_at', { ascending: false }),
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

    if (giveawayRes.error) {
      setGiveawayError(giveawayRes.error.message || text.giveawayLoadFailed)
      setGiveawayEntries([])
      setGiveawayWinner(null)
    } else {
      setGiveawayEntries(
        (giveawayRes.data || []).filter((entry) => entry.full_name?.trim())
      )
    }

    setChartData(data.length ? data : [{ month: text.noData, trips: 0 }])
    setLoading(false)
  }

  const pickGiveawayWinner = () => {
    if (!giveawayEntries.length || pickingWinner) return

    setPickingWinner(true)

    window.setTimeout(() => {
      const index = Math.floor(Math.random() * giveawayEntries.length)
      setGiveawayWinner(giveawayEntries[index])
      setPickingWinner(false)
    }, 450)
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

      <div className="card p-4 sm:p-6 mt-5 lg:mt-6 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-[#E6F2EE] text-[#006A4E] flex items-center justify-center text-xl shrink-0">
                🎁
              </div>

              <div className="min-w-0">
                <h2 className="font-semibold text-[#333333]" dir="auto">
                  {text.giveawayDraw}
                </h2>
                <p className="text-sm text-stone-500 mt-1 leading-relaxed" dir="auto">
                  {text.giveawayDrawDesc}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-[#FBF6E3] border border-[#D4AF37]/35 text-sm text-[#333333]">
              <span className="font-semibold text-[#006A4E]">
                {giveawayEntries.length}
              </span>
              <span dir="auto">{text.giveawayEntries}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={pickGiveawayWinner}
            disabled={!giveawayEntries.length || pickingWinner}
            className="btn-primary justify-center shrink-0"
          >
            {pickingWinner ? text.pickingWinner : text.pickWinner}
          </button>
        </div>

        {giveawayError && (
          <div
            className="mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
            dir="auto"
          >
            {giveawayError}
          </div>
        )}

        {!giveawayError && !giveawayEntries.length && (
          <div
            className="mt-5 bg-stone-50 border border-stone-200 text-stone-500 px-4 py-3 rounded-xl text-sm"
            dir="auto"
          >
            {text.noEntries}
          </div>
        )}

        {giveawayWinner && (
          <div className="mt-5 rounded-2xl border border-[#D4AF37]/45 bg-[#FBF6E3] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-[#B89122] font-semibold mb-3">
              {text.winner}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-xl border border-[#DDD8C8] p-4">
                <div className="text-xs text-stone-500 mb-1" dir="auto">
                  {text.winnerName}
                </div>
                <div className="text-lg font-bold text-[#333333]" dir="auto">
                  {giveawayWinner.full_name}
                </div>
              </div>

              <div className="bg-white/80 rounded-xl border border-[#DDD8C8] p-4">
                <div className="text-xs text-stone-500 mb-1" dir="auto">
                  {text.winnerEmail}
                </div>
                <div className="text-lg font-bold text-[#333333]" dir="ltr">
                  {giveawayWinner.email || '—'}
                </div>
              </div>
            </div>
          </div>
        )}

        {!giveawayError && giveawayEntries.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-semibold text-[#333333]" dir="auto">
                {text.participants}
              </h3>
              <span className="text-xs text-stone-500">
                {giveawayEntries.length}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#DDD8C8]">
              <table className="w-full min-w-[760px] text-sm bg-white">
                <thead>
                  <tr className="text-stone-500 border-b border-stone-100 bg-[#F5F5F0]">
                    <th className="text-start px-4 py-3 font-medium">
                      {text.participantName}
                    </th>
                    <th className="text-start px-4 py-3 font-medium">
                      {text.participantEmail}
                    </th>
                    <th className="text-start px-4 py-3 font-medium">
                      {text.participantTicket}
                    </th>
                    <th className="text-start px-4 py-3 font-medium">
                      {text.participantDate}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {giveawayEntries.map((entry, index) => (
                    <tr
                      key={`${entry.ticket_number || entry.email || entry.full_name}-${index}`}
                      className="border-b border-stone-50 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-[#333333]" dir="auto">
                        {entry.full_name}
                      </td>
                      <td className="px-4 py-3 text-stone-600" dir="ltr">
                        {entry.email || '—'}
                      </td>
                      <td className="px-4 py-3 text-stone-600" dir="auto">
                        {entry.ticket_number || '—'}
                      </td>
                      <td className="px-4 py-3 text-stone-500" dir="auto">
                        {formatGiveawayDate(entry.created_at, lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
