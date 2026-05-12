import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { generatePDF } from '../utils/pdf'

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
  if (!city) return ''
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
}

function getCategoryLabel(category, lang) {
  if (!category) return ''
  return lang === 'ar' ? CATEGORY_LABELS_AR[category] || category : category
}

function getBudgetLabel(budget, lang) {
  if (!budget) return ''
  return lang === 'ar' ? BUDGET_LABELS_AR[budget] || budget : budget
}

function getStyleLabel(style, lang) {
  if (!style) return ''
  return lang === 'ar' ? STYLE_LABELS_AR[style] || style : style
}

function getStationName(station, lang = 'en') {
  if (lang === 'ar') {
    return (
      station?.name_ar ||
      station?.arabic_name ||
      station?.place_name_ar ||
      station?.title_ar ||
      station?.name ||
      station?.place_name ||
      station?.place ||
      station?.title ||
      'معلم'
    )
  }

  return (
    station?.name ||
    station?.place_name ||
    station?.place ||
    station?.title ||
    'Attraction'
  )
}

function getStationDescription(station, lang = 'en') {
  if (lang === 'ar') {
    return (
      station?.description_ar ||
      station?.arabic_description ||
      station?.desc_ar ||
      station?.description ||
      station?.desc ||
      ''
    )
  }

  return station?.description || station?.desc || ''
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
  const plan = trip?.ai_plan
  const cities =
    plan?.cities?.length
      ? plan.cities
      : Array.isArray(trip?.cities) && trip.cities.length
      ? trip.cities
      : trip?.city
      ? [trip.city]
      : []

  if (!cities.length) return ''

  return cities
    .map((city) => getCityLabel(city, lang))
    .join(lang === 'ar' ? ' ← ' : ' → ')
}

function getDayCity(day, index, trip) {
  const plan = trip?.ai_plan

  return (
    day?.city ||
    plan?.cities?.[index] ||
    trip?.city ||
    ''
  )
}

export default function Itinerary() {
  const { user } = useAuth()
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!trips.length) {
    return (
      <div className="py-20 px-4 text-center">
        <div className="text-6xl mb-4">🗺️</div>

        <h2 className="text-xl font-bold text-stone-900 mb-2">
          {t('noTripsYet')}
        </h2>

        <button onClick={() => navigate('/planner')} className="btn-primary mt-4">
          {t('startFirstTrip')}
        </button>
      </div>
    )
  }

  const plan = selected?.ai_plan
  const itinerary = plan?.itinerary || plan?.days || []
  const cityDisplay = getCitiesDisplay(selected, lang)

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto">
      {trips.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-3 mb-6">
          {trips.map((trip) => {
            const tripCityDisplay = getCitiesDisplay(trip, lang)

            return (
              <button
                key={trip.id}
                onClick={() => setSelected(trip)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  selected?.id === trip.id
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-orange-300'
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

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-5">
        <h3 className="flex items-center gap-2 font-semibold text-orange-700 mb-3">
          <span>🗺️</span> {text.tripSummary}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="sm:col-span-2">
            <span className="text-stone-500">{text.destination}:</span>{' '}
            <strong dir="auto">{cityDisplay}</strong>
          </div>

          <div>
            <span className="text-stone-500">{text.days}:</span>{' '}
            <strong>{selected?.days}</strong>
          </div>

          <div>
            <span className="text-stone-500">{text.budget}:</span>{' '}
            <strong>{getBudgetLabel(selected?.budget, lang)}</strong>
          </div>

          <div>
            <span className="text-stone-500">{text.style}:</span>{' '}
            <strong>{getStyleLabel(selected?.trip_style, lang)}</strong>
          </div>
        </div>
      </div>

      {itinerary.map((day, di) => {
        const dayCity = getDayCity(day, di, selected)
        const dayCityLabel = getCityLabel(dayCity, lang)

        return (
          <div key={di} className="card p-6 mb-4">
            <h3 className="font-bold text-stone-900 text-lg mb-4 flex items-center gap-2 flex-wrap">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {di + 1}
              </span>

              {t('day')} {di + 1}

              {dayCityLabel && (
                <span className="text-sm font-semibold text-orange-600" dir="auto">
                  ({dayCityLabel})
                </span>
              )}

             {(lang === 'ar' ? day.theme_ar || day.theme : day.theme) && (
  <span className="text-sm font-normal text-stone-500 ms-1" dir="auto">
    — {lang === 'ar' ? day.theme_ar || day.theme : day.theme}
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
                    className="flex gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {si + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div
                            className="font-semibold text-stone-900 text-sm"
                            dir="auto"
                          >
                            {stationName}
                          </div>

                          {station.time && (
                            <div className="text-xs text-orange-500 font-medium mt-0.5">
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
                          className="flex-shrink-0 text-xs text-orange-500 hover:text-orange-700 border border-orange-200 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-colors hover:bg-orange-50"
                        >
                          📍 {text.openInMaps}
                        </a>
                      </div>

                      <p
                        className="text-sm text-stone-500 mt-1.5 leading-relaxed"
                        dir="auto"
                      >
                        {stationDescription}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="flex flex-wrap gap-3 mt-2">
        <button onClick={() => navigate('/planner')} className="btn-outline">
          {t('backToPlanner')}
        </button>

        <button
          onClick={() =>
            generatePDF(
              {
                city: cityDisplay,
                numberOfPeople: '',
              },
              plan,
              itinerary
            )
          }
          className="btn-outline flex items-center gap-2"
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
          className="btn-primary flex items-center gap-2"
        >
          🗺️ {t('map')}
        </button>
      </div>
    </div>
  )
}