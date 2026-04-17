import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLang } from '../context/LanguageContext'

const chartData = [
  { month: 'Jan', trips: 140 },
  { month: 'Feb', trips: 195 },
  { month: 'Mar', trips: 175 },
  { month: 'Apr', trips: 280 },
  { month: 'May', trips: 310 },
  { month: 'Jun', trips: 430 },
  { month: 'Jul', trips: 360 },
]

const recentActivity = [
  { text: 'Ahmed K. Generated a 5-day Riyadh itinerary', time: '2 min ago' },
  { text: 'Sarah M. Signed up for premium', time: '15 min ago' },
  { text: 'Omar T. Exported PDF for Jeddah trip', time: '32 min ago' },
  { text: 'Fatima A. Modified 3-day Al-Ula plan', time: '1 hour ago' },
  { text: 'Khalid R. Requested regeneration for Neom trip', time: '2 hours ago' },
]

const users = [
  { name: 'Ahmed Al-Rashid', email: 'ahmed@mail.com', trips: 5, status: 'Active' },
  { name: 'Sarah Mohammed', email: 'sarah@mail.com', trips: 3, status: 'Active' },
  { name: 'Omar Tariq', email: 'omar@mail.com', trips: 8, status: 'Premium' },
  { name: 'Fatima Alhadi', email: 'fatima@mail.com', trips: 2, status: 'Active' },
  { name: 'Khalid Rasheed', email: 'khalid@mail.com', trips: 6, status: 'Inactive' },
]

const statusColor = {
  Active: 'bg-green-100 text-green-700',
  Premium: 'bg-orange-100 text-orange-700',
  Inactive: 'bg-stone-100 text-stone-500',
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="card p-6 relative overflow-hidden">
      <div
        className="absolute top-2 end-2 w-16 h-16 rounded-full opacity-20"
        style={{ background: color }}
      />
      <div className="text-2xl mb-3" style={{ color }}>{icon}</div>
      <div className="text-3xl font-bold text-stone-900 mb-1">{value}</div>
      <div className="text-sm text-stone-500">{label}</div>
    </div>
  )
}

export default function Admin() {
  const { t } = useLang()

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">{t('systemOverview')}</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📍" value="1,284" label={t('activeTrips')} color="#3B82F6" />
        <StatCard icon="📈" value="98.2%" label={t('aiAccuracy')} color="#10B981" />
        <StatCard icon="👥" value="450" label={t('newSignups')} color="#F97316" />
        <StatCard icon="💵" value="$128,400" label={t('totalRevenue')} color="#8B5CF6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-semibold text-stone-900 mb-6">{t('analyticsTitle')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="trips" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="card p-6">
          <h2 className="font-semibold text-stone-900 mb-4">{t('recentActivity')}</h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-700 leading-tight">{item.text}</p>
                  <p className="text-xs text-stone-400 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="card p-6">
        <h2 className="font-semibold text-stone-900 mb-4">{t('users')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-start text-stone-500 border-b border-stone-100">
                <th className="text-start pb-3 font-medium">{t('name')}</th>
                <th className="text-start pb-3 font-medium">{t('email')}</th>
                <th className="text-start pb-3 font-medium">{t('trips_count')}</th>
                <th className="text-start pb-3 font-medium">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="border-b border-stone-50 last:border-0">
                  <td className="py-3.5 font-medium text-stone-900">{user.name}</td>
                  <td className="py-3.5 text-stone-500">{user.email}</td>
                  <td className="py-3.5 text-stone-700">{user.trips}</td>
                  <td className="py-3.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
