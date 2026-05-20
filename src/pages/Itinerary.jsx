import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { generatePDF } from '../utils/pdf'
import * as itineraryDisplay from '../utils/itineraryDisplay'

const CITY_LABELS_AR = {
  Riyadh: 'الرياض',
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
  Diriyah: 'الدرعية',
  Buraidah: 'بريدة',
  Jubail: 'الجبيل',
  'Al-Baha': 'الباحة',
  Sakaka: 'سكاكا',
  'Hafar Al-Batin': 'حفر الباطن',
  KAEC: 'مدينة الملك عبدالله الاقتصادية',
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

const BUDGET_LABELS_AR = {
  Budget: 'اقتصادي',
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

const STYLE_LABELS_AR = {
  Low: 'خفيف',
  Moderate: 'متوسط',
  High: 'مكثف',
}

function getCityLabel(city, lang) {
  return itineraryDisplay.getCityLabel(city, lang)
}

function getCategoryLabel(category, lang) {
  return itineraryDisplay.getCategoryLabel(category, lang)
}

function getBudgetLabel(budget, lang) {
  return itineraryDisplay.getBudgetLabel(budget, lang)
}

function getStyleLabel(style, lang) {
  return itineraryDisplay.getStyleLabel(style, lang)
}

function getStationName(station, lang = 'en') {
  return itineraryDisplay.getStationName(station, lang)
}

function getStationDescription(station, lang = 'en') {
  return itineraryDisplay.getStationDescription(station, lang)
}

function getStationLat(station) {
  const value = station?.lat ?? station?.latitude
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function getStationLng(station) {
  const value = station?.lng ?? station?.longitude
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function buildMapsUrl(station, city) {
  const lat = getStationLat(station)
  const lng = getStationLng(station)

  if (lat !== null && lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  const placeName = getStationName(station)
  const query = encodeURIComponent(`${placeName}, ${city}, Saudi Arabia`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

function getCitiesDisplay(trip, lang = 'en') {
  return itineraryDisplay.getCitiesDisplay(trip, lang)
}

function getDayCity(day, index, trip) {
  const plan = trip?.ai_plan

  return day?.city || plan?.cities?.[index] || trip?.city || ''
}

function getTravelerName(profile, user, plan) {
  return (
    profile?.full_name ||
    profile?.email?.split('@')[0] ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    plan?.travelerName ||
    ''
  )
}

export default function Itinerary() {
  const { user, profile } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [trips, setTrips] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const isArabic = lang === 'ar'

  const text = {
    days: isArabic ? 'الأيام' : 'Days',
    dayShort: isArabic ? 'يوم' : 'd',
    budget: isArabic ? 'الميزانية' : 'Budget',
    style: isArabic ? 'النمط' : 'Style',
    openInMaps: isArabic ? 'فتح في خرائط Google' : 'Open in Maps',
    tripSummary: isArabic ? 'ملخص الرحلة' : t('tripSummary'),
    destination: isArabic ? 'مدينة الوجهة' : t('destinationCityLabel'),
  }

  useEffect(() => {
    if (!user) return

    supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Load saved trips error:', error)
        }

        setTrips(data || [])

        if (data && data.length > 0) {
          setSelected(data[0])
        }

        setLoading(false)
      })
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!trips.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#F5F5F0]">
        <div className="card p-6 sm:p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">🗺️</div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#333333] mb-2" dir="auto">
            {t('noTripsYet')}
          </h2>

          <button onClick={() => navigate('/planner')} className="btn-primary mt-4 justify-center">
            {t('startFirstTrip')}
          </button>
        </div>
      </div>
    )
  }

  const plan = selected?.ai_plan
  const itinerary = plan?.itinerary || plan?.days || []
  const cityDisplay = getCitiesDisplay(selected, lang)
  const travelerName = getTravelerName(profile, user, plan)

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      {trips.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
          {trips.map((trip) => {
            const tripCityDisplay = getCitiesDisplay(trip, lang)

            return (
              <button
                key={trip.id}
                onClick={() => setSelected(trip)}
                className={`flex-shrink-0 max-w-[260px] px-4 py-2 rounded-full text-sm font-medium border transition-all truncate ${
                  selected?.id === trip.id
                    ? 'bg-[#006A4E] text-white border-[#006A4E]'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-[#D4AF37] hover:bg-[#FBF6E3]'
                }`}
                dir="auto"
              >
                {tripCityDisplay} · {trip.days}
                {isArabic ? ` ${text.dayShort}` : text.dayShort}
              </button>
            )
          })}
        </div>
      )}

      <div className="bg-[#E6F2EE] border border-[#D4AF37]/40 rounded-2xl p-4 sm:p-5 mb-5">
        <h3 className="flex items-center gap-2 font-semibold text-[#006A4E] mb-3" dir="auto">
          <span>🗺️</span> {text.tripSummary}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="sm:col-span-2">
            <span className="text-stone-500">{text.destination}:</span>{' '}
            <strong className="text-[#333333]" dir="auto">
              {cityDisplay}
            </strong>
          </div>

          <div>
            <span className="text-stone-500">{text.days}:</span>{' '}
            <strong className="text-[#333333]">{selected?.days}</strong>
          </div>

          <div>
            <span className="text-stone-500">{text.budget}:</span>{' '}
            <strong className="text-[#333333]" dir="auto">
              {getBudgetLabel(selected?.budget, lang)}
            </strong>
          </div>

          <div>
            <span className="text-stone-500">{text.style}:</span>{' '}
            <strong className="text-[#333333]" dir="auto">
              {getStyleLabel(selected?.trip_style, lang)}
            </strong>
          </div>
        </div>
      </div>

      {itinerary.map((day, di) => {
        const dayCity = getDayCity(day, di, selected)
        const dayCityLabel = getCityLabel(dayCity, lang)
        const dayTheme = itineraryDisplay.getDayTheme(day, lang)

        return (
          <div key={di} className="card p-4 sm:p-6 mb-4 overflow-hidden">
            <h3 className="font-bold text-[#333333] text-base sm:text-lg mb-4 flex items-center gap-2 flex-wrap">
              <span className="w-8 h-8 bg-[#006A4E] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {di + 1}
              </span>

              <span dir="auto">
                {t('day')} {di + 1}
              </span>

              {dayCityLabel && (
                <span className="text-sm font-semibold text-[#006A4E]" dir="auto">
                  ({dayCityLabel})
                </span>
              )}

              {dayTheme && (
                <span className="text-sm font-normal text-stone-500 ms-1" dir="auto">
                  — {dayTheme}
                </span>
              )}
            </h3>

            <div className="space-y-4">
              {(day.stations || day.activities || []).map((station, si) => {
                const stationName = getStationName(station, lang)
                const stationDescription = getStationDescription(station, lang)
                const stationCity = station.city || dayCity || selected?.city
                const stationCategory = getCategoryLabel(station.category, lang)

                return (
                  <div
                    key={`${di}-${si}-${stationName}`}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
                  >
                    <div className="flex sm:block items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#E6F2EE] text-[#006A4E] border border-[#D4AF37]/35 rounded-full flex items-center justify-center text-xs font-bold">
                        {si + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <div
                            className="font-semibold text-[#333333] text-sm sm:text-base"
                            dir="auto"
                          >
                            {stationName}
                          </div>

                          {station.time && (
                            <div className="text-xs text-[#006A4E] font-medium mt-0.5" dir="auto">
                              {station.time}
                            </div>
                          )}

                          {stationCategory && (
                            <div className="text-xs text-stone-400 mt-0.5" dir="auto">
                              {stationCategory}
                            </div>
                          )}
                        </div>

                        <a
                          href={buildMapsUrl(station, stationCity)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto justify-center flex-shrink-0 text-xs text-[#006A4E] hover:text-[#004D39] border border-[#D4AF37]/45 rounded-lg px-3 py-2 flex items-center gap-1 transition-colors hover:bg-[#FBF6E3]"
                          dir="auto"
                        >
                          📍 {text.openInMaps}
                        </a>
                      </div>

                      {stationDescription && (
                        <p
                          className="text-sm text-stone-500 mt-2 leading-relaxed"
                          dir="auto"
                        >
                          {stationDescription}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <button onClick={() => navigate('/planner')} className="btn-outline justify-center">
          {t('backToPlanner')}
        </button>

        <button
          onClick={() =>
            generatePDF(
              {
                ...selected,
                city: cityDisplay,
                cities: plan?.cities || [],
                startDate: plan?.startDate || plan?.start_date || '',
                endDate: plan?.endDate || plan?.end_date || '',
                numberOfPeople: plan?.numberOfPeople || plan?.number_of_people || '',
                travelerName,
              },
              plan,
              itinerary
            )
          }
          className="btn-outline justify-center flex items-center gap-2"
        >
          📄 {t('generatePDF')}
        </button>

        <button
          onClick={() => {
            sessionStorage.setItem(
              'currentTrip',
              JSON.stringify({
                tripData: {
                  ...selected,
                  city: cityDisplay,
                  cities: plan?.cities || [],
                },
                plan,
              })
            )
            navigate('/map')
          }}
          className="btn-primary justify-center flex items-center gap-2"
        >
          🗺️ {t('map')}
        </button>
      </div>
    </div>
  )
}
