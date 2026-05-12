import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
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

const BUDGET_LABELS_AR = {
  Budget: 'اقتصادي',
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

function getCityLabel(city, lang) {
  if (!city) return ''
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
}

function getBudgetLabel(budget, lang) {
  if (!budget) return ''
  return lang === 'ar' ? BUDGET_LABELS_AR[budget] || budget : budget
}

function getTripCityDisplay(trip, lang) {
  const cities =
    trip?.ai_plan?.cities?.length
      ? trip.ai_plan.cities
      : Array.isArray(trip?.cities) && trip.cities.length
      ? trip.cities
      : trip?.city
      ? String(trip.city)
          .split('→')
          .map((item) => item.trim())
          .filter(Boolean)
      : []

  if (!cities.length) return trip?.city || ''

  return cities
    .map((city) => getCityLabel(city, lang))
    .join(lang === 'ar' ? ' ← ' : ' → ')
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

export default function Profile() {
  const { user, signOut } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const isArabic = lang === 'ar'

  const text = {
    savedTripCount: isArabic ? 'رحلات محفوظة' : t('savedTrips'),
    deleteConfirm: isArabic
      ? 'هل تريد حذف هذه الرحلة؟'
      : 'Delete this trip?',
    saving: isArabic ? 'جاري الحفظ...' : 'Saving...',
    updateFailed: isArabic
      ? 'فشل تحديث الملف الشخصي.'
      : 'Failed to update profile.',
    deleteFailed: isArabic ? 'فشل حذف الرحلة.' : 'Failed to delete trip.',
    days: isArabic ? 'أيام' : 'days',
    day: isArabic ? 'يوم' : 'day',
    view: t('viewItinerary'),
    delete: t('deleteTrip'),
  }

  const [profile, setProfile] = useState({ full_name: '', email: '' })
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('trips')
        .select('id, city, days, budget, created_at, ai_plan')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]).then(
      ([{ data: p, error: profileError }, { data: tr, error: tripsError }]) => {
        if (profileError) {
          console.error('Load profile error:', profileError)
        }

        if (tripsError) {
          console.error('Load trips error:', tripsError)
        }

        if (p) setProfile(p)
        setTrips(tr || [])
        setLoading(false)
      }
    )
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    setError('')

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: profile.full_name,
      email: user.email,
      updated_at: new Date().toISOString(),
    })

    setSaving(false)

    if (error) {
      setError(error.message || text.updateFailed)
      return
    }

    setSaveMsg(t('profileUpdated'))
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!confirm(text.deleteConfirm)) return

    setError('')

    const { error } = await supabase.from('trips').delete().eq('id', id)

    if (error) {
      setError(error.message || text.deleteFailed)
      return
    }

    setTrips((prev) => prev.filter((tr) => tr.id !== id))
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-6 sm:mb-8" dir="auto">
        {t('myProfile')}
      </h1>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5"
          dir="auto"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-1">
          <div className="card p-5 sm:p-6 text-center">
            <div className="w-20 h-20 bg-[#E6F2EE] border border-[#D4AF37]/35 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-[#006A4E]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>

            <div className="font-bold text-[#333333] mb-0.5 break-words" dir="auto">
              {profile.full_name || user.email?.split('@')[0]}
            </div>

            <div className="text-sm text-stone-500 mb-5 break-all" dir="ltr">
              {user.email}
            </div>

            <div className="text-sm text-stone-400" dir="auto">
              {trips.length} {text.savedTripCount}
            </div>

            <button
              onClick={handleSignOut}
              className="mt-5 w-full btn-outline justify-center text-sm py-2 text-red-500 border-red-200 hover:bg-red-50"
            >
              {t('signOut')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5 min-w-0">
          <div className="card p-5 sm:p-6">
            <h2 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('updateProfile')}
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-stone-700 mb-1"
                  dir="auto"
                >
                  {t('fullName')}
                </label>

                <input
                  type="text"
                  className="input-field"
                  value={profile.full_name || ''}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                  dir="auto"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-stone-700 mb-1"
                  dir="auto"
                >
                  {t('emailAddress')}
                </label>

                <input
                  type="email"
                  className="input-field bg-stone-50"
                  value={user.email}
                  disabled
                  dir="ltr"
                />
              </div>
            </div>

            {saveMsg && (
              <div className="mt-3 text-sm text-[#006A4E] font-medium" dir="auto">
                {saveMsg}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 btn-primary disabled:opacity-60 justify-center"
            >
              {saving ? text.saving : t('updateProfile')}
            </button>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('savedTrips')}
            </h2>

            {trips.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🗺️</div>

                <p className="text-stone-500 text-sm mb-4" dir="auto">
                  {t('noTripsYet')}
                </p>

                <button
                  onClick={() => navigate('/planner')}
                  className="btn-primary text-sm justify-center"
                >
                  {t('startFirstTrip')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => {
                  const cityDisplay = getTripCityDisplay(trip, lang)
                  const dayLabel = trip.days === 1 ? text.day : text.days

                  return (
                    <div
                      key={trip.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-[#F5F5F0] rounded-xl border border-[#DDD8C8]"
                    >
                      <div className="min-w-0 flex-1">
                        <div
                          className="font-medium text-[#333333] text-sm leading-relaxed"
                          dir="auto"
                        >
                          {cityDisplay}
                        </div>

                        <div
                          className="text-xs text-stone-400 mt-1 leading-relaxed"
                          dir="auto"
                        >
                          {trip.days} {dayLabel} ·{' '}
                          {getBudgetLabel(trip.budget, lang)} ·{' '}
                          {formatDate(trip.created_at, lang)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            sessionStorage.setItem(
                              'currentTrip',
                              JSON.stringify({
                                tripData: {
                                  ...trip,
                                  city: cityDisplay,
                                  cities: trip.ai_plan?.cities || [],
                                },
                                plan: trip.ai_plan,
                              })
                            )
                            navigate('/itinerary')
                          }}
                          className="text-xs text-[#006A4E] hover:text-[#004D39] border border-[#D4AF37]/45 rounded-lg px-3 py-2 transition-colors hover:bg-[#FBF6E3]"
                        >
                          {text.view}
                        </button>

                        <button
                          onClick={() => handleDelete(trip.id)}
                          className="text-xs text-red-500 hover:text-red-600 border border-red-100 rounded-lg px-3 py-2 transition-colors hover:bg-red-50"
                        >
                          {text.delete}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}