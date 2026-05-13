import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useLang } from '../context/LanguageContext'

const CITY_COORDS = {
  Riyadh: [24.7136, 46.6753],
  Jeddah: [21.4858, 39.1925],
  Mecca: [21.3891, 39.8579],
  Medina: [24.5247, 39.5692],
  Dammam: [26.4207, 50.0888],
  'Al-Khobar': [26.2172, 50.1971],
  Dhahran: [26.2361, 50.0393],
  'Al-Ahsa': [25.3831, 49.5867],
  'Al-Ula': [26.6085, 37.9232],
  NEOM: [28.0339, 35.1389],
  Abha: [18.2164, 42.5053],
  Taif: [21.2854, 40.426],
  Yanbu: [24.0895, 38.0618],
  Tabuk: [28.3835, 36.5662],
  Hail: [27.5114, 41.7208],
  Najran: [17.5656, 44.2289],
  Jizan: [16.8892, 42.5511],
  Diriyah: [24.737, 46.5752],
  Buraidah: [26.3592, 43.9818],
  Jubail: [27.0046, 49.646],
  'Al-Baha': [20.0129, 41.4677],
  Sakaka: [29.9697, 40.2064],
  'Hafar Al-Batin': [28.4328, 45.9708],
  KAEC: [22.4057, 39.0811],
}

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

const AR_CITY_TO_EN = Object.fromEntries(
  Object.entries(CITY_LABELS_AR).map(([en, ar]) => [ar, en])
)

const CATEGORY_COLORS = {
  Landmark: '#006A4E',
  Museum: '#D4AF37',
  Historical: '#004D39',
  Heritage: '#6FAE9B',
  Entertainment: '#B89122',
  Shopping: '#8A6F18',
  Culture: '#2E7D67',
  Outdoor: '#4F9D84',
  Natural: '#1D6B54',
  Restaurant: '#A17E20',
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

const LEGEND = [
  { type: 'Landmark', color: '#006A4E' },
  { type: 'Museum', color: '#D4AF37' },
  { type: 'Historical', color: '#004D39' },
  { type: 'Heritage', color: '#6FAE9B' },
  { type: 'Entertainment', color: '#B89122' },
  { type: 'Shopping', color: '#8A6F18' },
  { type: 'Culture', color: '#2E7D67' },
  { type: 'Outdoor', color: '#4F9D84' },
  { type: 'Natural', color: '#1D6B54' },
  { type: 'Restaurant', color: '#A17E20' },
]

const FALLBACK_OFFSETS = [
  [0.012, 0.01],
  [-0.01, 0.014],
  [0.016, -0.012],
  [-0.014, -0.008],
  [0.006, 0.02],
  [-0.018, 0.006],
  [0.022, -0.004],
  [-0.006, -0.02],
  [0.028, 0.018],
  [-0.024, -0.018],
]

function isInsideSaudi(lat, lng) {
  return lat >= 16 && lat <= 33 && lng >= 34 && lng <= 56
}

function getCityKey(city) {
  if (!city) return ''

  const clean = String(city).trim()

  if (CITY_COORDS[clean]) return clean
  if (AR_CITY_TO_EN[clean]) return AR_CITY_TO_EN[clean]

  const firstPart = clean
    .split(/[→←]/)
    .map((item) => item.trim())
    .filter(Boolean)[0]

  if (CITY_COORDS[firstPart]) return firstPart
  if (AR_CITY_TO_EN[firstPart]) return AR_CITY_TO_EN[firstPart]

  return clean
}

function getCityLabel(city, lang) {
  if (!city) return ''
  const key = getCityKey(city)
  return lang === 'ar' ? CITY_LABELS_AR[key] || city : key || city
}

function getCategoryLabel(category, lang) {
  if (!category) return ''
  return lang === 'ar' ? CATEGORY_LABELS_AR[category] || category : category
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
  const value =
    station?.lat ??
    station?.latitude ??
    station?.location?.lat ??
    station?.coordinates?.lat

  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function getStationLng(station) {
  const value =
    station?.lng ??
    station?.longitude ??
    station?.location?.lng ??
    station?.coordinates?.lng

  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function hasRealCoordinates(station) {
  const lat = getStationLat(station)
  const lng = getStationLng(station)

  if (lat === null || lng === null) return false
  return isInsideSaudi(lat, lng)
}

function getFallbackPosition(station) {
  const cityKey = getCityKey(station.dayCity || station.city)
  const center = CITY_COORDS[cityKey] || CITY_COORDS.Riyadh
  const offsetIndex =
    ((Number(station.dayNum) || 1) * 3 + (Number(station.stationNum) || 1)) %
    FALLBACK_OFFSETS.length

  const [latOffset, lngOffset] = FALLBACK_OFFSETS[offsetIndex]

  return [center[0] + latOffset, center[1] + lngOffset]
}

function getMarkerPosition(station) {
  const lat = getStationLat(station)
  const lng = getStationLng(station)

  if (lat !== null && lng !== null && isInsideSaudi(lat, lng)) {
    return [lat, lng]
  }

  return getFallbackPosition(station)
}

function buildGoogleMapsUrl(station) {
  const lat = getStationLat(station)
  const lng = getStationLng(station)

  if (lat !== null && lng !== null && isInsideSaudi(lat, lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  const name =
    station?.name ||
    station?.place_name ||
    station?.place ||
    station?.title ||
    'Attraction'

  const city = station?.dayCity || station?.city || ''
  const q = encodeURIComponent(`${name}, ${city}, Saudi Arabia`)

  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

function createNumberIcon(number, category, estimated = false) {
  const color = estimated ? '#78716C' : CATEGORY_COLORS[category] || '#006A4E'

  return L.divIcon({
    html: `
      <div style="
        width:32px;
        height:32px;
        background:${color};
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-weight:bold;
        font-size:13px;
        opacity:${estimated ? '0.85' : '1'};
      ">
        ${number}
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function FitMapToMarkers({ stations, city }) {
  const map = useMap()

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()

      const validPositions = stations.map(getMarkerPosition)

      if (validPositions.length > 0) {
        const bounds = L.latLngBounds(validPositions)

        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 14,
        })
      } else {
        const cityKey = getCityKey(city)
        const center = CITY_COORDS[cityKey] || CITY_COORDS.Riyadh
        map.setView(center, 11)
      }
    }, 250)
  }, [map, stations, city])

  return null
}

export default function MapPage() {
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [tripData, setTripData] = useState(null)
  const [plan, setPlan] = useState(null)
  const [selectedDay, setSelectedDay] = useState('all')

  const isArabic = lang === 'ar'

  const text = {
    mapped: isArabic ? 'معالم على الخريطة' : 'mapped',
    estimated: isArabic ? 'نقاط تقديرية' : 'estimated points',
    daySingular: isArabic ? 'يوم' : 'day',
    dayPlural: isArabic ? 'أيام' : 'days',
    openInGoogleMaps: isArabic ? 'فتح في خرائط Google' : 'Open in Google Maps',
    estimatedPoint: isArabic
      ? 'هذه نقطة تقديرية لأن النشاط لا يحتوي على إحداثيات دقيقة.'
      : 'Estimated point because this activity has no exact coordinates.',
    mapProvider: isArabic
      ? 'Leaflet / OpenStreetMap · تفتح خرائط Google خارجيًا'
      : 'Leaflet / OpenStreetMap · Google Maps opens externally',
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('currentTrip')

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTripData(parsed.tripData)
        setPlan(parsed.plan)
      } catch (error) {
        console.error('Failed to load current trip:', error)
      }
    }
  }, [])

  const itinerary = plan?.itinerary || plan?.days || []
  const days = itinerary.length

  const selectedCities =
    plan?.cities?.length
      ? plan.cities
      : tripData?.cities?.length
      ? tripData.cities
      : tripData?.city
      ? [tripData.city]
      : []

  const cityDisplay = selectedCities.length
    ? selectedCities
        .map((city) => getCityLabel(city, lang))
        .join(isArabic ? ' ← ' : ' → ')
    : getCityLabel(tripData?.city || plan?.city || 'Riyadh', lang)

  const primaryCity = getCityKey(
    selectedCities[0] || tripData?.city || plan?.city || 'Riyadh'
  )

  const center = CITY_COORDS[primaryCity] || CITY_COORDS.Riyadh

  const allStations = useMemo(() => {
    return itinerary
      .flatMap((day, dayIndex) => {
        const stations = day.stations || day.activities || []
        const dayCity = day?.city || selectedCities[dayIndex] || primaryCity

        return stations.map((station, stationIndex) => ({
          ...station,
          dayNum: dayIndex + 1,
          stationNum: stationIndex + 1,
          dayCity,
          displayName: getStationName(station, lang),
          displayDescription: getStationDescription(station, lang),
          displayCategory: getCategoryLabel(station.category, lang),
        }))
      })
      .filter(
        (station) =>
          selectedDay === 'all' || station.dayNum === Number(selectedDay)
      )
  }, [itinerary, selectedDay, selectedCities, primaryCity, lang])

  const mappedStations = allStations
  const estimatedStations = allStations.filter((station) => !hasRealCoordinates(station))

  if (!plan) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#F5F5F0]">
        <div className="card p-6 sm:p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">🗺️</div>

          <h2
            className="text-xl sm:text-2xl font-bold text-[#333333] mb-2"
            dir="auto"
          >
            {t('noTripData')}
          </h2>

          <button
            onClick={() => navigate('/planner')}
            className="btn-primary mt-4 justify-center"
          >
            {t('tripPlanner')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#F5F5F0] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 lg:gap-6 min-h-[calc(100vh-130px)]">
          <aside className="bg-white border border-[#DDD8C8] rounded-2xl overflow-hidden lg:max-h-[calc(100vh-150px)] lg:overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <h2 className="font-bold text-[#333333] text-lg" dir="auto">
                  {t('mapTitle')}
                </h2>

                <p className="text-sm text-stone-500" dir="auto">
                  {cityDisplay} · {days}{' '}
                  {days === 1 ? text.daySingular : text.dayPlural}
                </p>

                <p className="text-xs text-stone-400 mt-1" dir="auto">
                  {mappedStations.length} {text.mapped} ·{' '}
                  {estimatedStations.length} {text.estimated}
                </p>
              </div>

              <div className="card p-4">
                <h3
                  className="text-xs font-semibold text-stone-500 uppercase mb-3"
                  dir="auto"
                >
                  {t('filterByDay')}
                </h3>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedDay('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedDay === 'all'
                        ? 'bg-[#006A4E] text-white border-[#006A4E]'
                        : 'border-stone-200 text-stone-600 hover:border-[#D4AF37] hover:bg-[#FBF6E3]'
                    }`}
                  >
                    {t('allAttractions')}
                  </button>

                  {Array.from({ length: days }, (_, index) => index + 1).map(
                    (day) => {
                      const dayData = itinerary[day - 1]
                      const dayCity = dayData?.city || selectedCities[day - 1] || ''
                      const dayCityLabel = getCityLabel(dayCity, lang)

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selectedDay === day
                              ? 'bg-[#006A4E] text-white border-[#006A4E]'
                              : 'border-stone-200 text-stone-600 hover:border-[#D4AF37] hover:bg-[#FBF6E3]'
                          }`}
                          dir="auto"
                        >
                          {t('day')} {day}
                          {dayCityLabel ? ` (${dayCityLabel})` : ''}
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              <div className="card p-4">
                <h3
                  className="text-xs font-semibold text-stone-500 uppercase mb-3"
                  dir="auto"
                >
                  {t('legend')}
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {LEGEND.map(({ type, color }) => (
                    <div
                      key={type}
                      className="flex items-center gap-2 text-xs text-stone-600 min-w-0"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />

                      <span dir="auto" className="truncate">
                        {getCategoryLabel(type, lang)}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 text-xs text-stone-600 min-w-0">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 bg-stone-500" />
                    <span dir="auto" className="truncate">
                      {text.estimated}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h3
                  className="text-xs font-semibold text-stone-500 uppercase mb-3"
                  dir="auto"
                >
                  {allStations.length} {t('attractions')}
                </h3>

                <div className="space-y-3 max-h-[360px] lg:max-h-none overflow-y-auto pe-1">
                  {allStations.map((station, index) => {
                    const estimated = !hasRealCoordinates(station)
                    const dayCityLabel = getCityLabel(station.dayCity, lang)

                    return (
                      <div
                        key={`${station.dayNum}-${index}`}
                        className="flex items-start gap-2.5"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            estimated
                              ? 'bg-stone-100 text-stone-500'
                              : 'bg-[#E6F2EE] text-[#006A4E] border border-[#D4AF37]/35'
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div
                            className="font-medium text-[#333333] text-xs leading-tight"
                            dir="auto"
                          >
                            {station.displayName}
                          </div>

                          <div
                            className="text-xs text-stone-400 mt-0.5"
                            dir="auto"
                          >
                            {t('day')} {station.dayNum}
                            {dayCityLabel ? ` (${dayCityLabel})` : ''}
                            {station.time ? ` · ${station.time}` : ''}
                          </div>

                          {station.displayCategory && (
                            <div
                              className="text-xs text-stone-400 mt-0.5"
                              dir="auto"
                            >
                              {station.displayCategory}
                            </div>
                          )}

                          {estimated && (
                            <div
                              className="text-xs text-stone-400 mt-1"
                              dir="auto"
                            >
                              {text.estimatedPoint}
                            </div>
                          )}

                          <a
                            href={buildGoogleMapsUrl(station)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#006A4E] hover:text-[#004D39] mt-1 inline-block"
                            dir="auto"
                          >
                            {text.openInGoogleMaps}
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          <section className="bg-white border border-[#DDD8C8] rounded-2xl overflow-hidden min-w-0 flex flex-col min-h-[520px]">
            <div className="bg-white border-b border-[#DDD8C8] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 bg-[#006A4E] text-white px-3 py-1.5 rounded-lg text-sm font-medium w-fit">
                🗺️ {t('map')}
              </div>

              <div className="text-xs text-stone-400" dir="auto">
                {text.mapProvider}
              </div>
            </div>

            <div className="flex-1 min-h-[460px] relative" dir="ltr">
              <MapContainer
                center={center}
                zoom={11}
                scrollWheelZoom
                className="absolute inset-0 z-0"
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 0,
                }}
              >
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitMapToMarkers stations={mappedStations} city={primaryCity} />

                {mappedStations.map((station, index) => {
                  const [lat, lng] = getMarkerPosition(station)
                  const estimated = !hasRealCoordinates(station)
                  const dayCityLabel = getCityLabel(station.dayCity, lang)

                  return (
                    <Marker
                      key={`${station.dayNum}-${index}-${station.displayName}`}
                      position={[lat, lng]}
                      icon={createNumberIcon(
                        index + 1,
                        station.category,
                        estimated
                      )}
                    >
                      <Popup>
                        <div
                          className="min-w-[200px]"
                          dir={isArabic ? 'rtl' : 'ltr'}
                        >
                          <div className="font-semibold text-sm mb-1" dir="auto">
                            {station.displayName}
                          </div>

                          <div
                            className="text-xs text-stone-500 mb-1"
                            dir="auto"
                          >
                            {t('day')} {station.dayNum}
                            {dayCityLabel ? ` (${dayCityLabel})` : ''}
                          </div>

                          {station.time && (
                            <div className="text-xs text-[#006A4E] mb-1">
                              {station.time}
                            </div>
                          )}

                          {station.displayCategory && (
                            <div
                              className="text-xs text-stone-500 mb-1"
                              dir="auto"
                            >
                              {station.displayCategory}
                            </div>
                          )}

                          {estimated && (
                            <div
                              className="text-xs text-stone-400 mb-1"
                              dir="auto"
                            >
                              {text.estimatedPoint}
                            </div>
                          )}

                          <div
                            className="text-xs text-stone-600 leading-relaxed"
                            dir="auto"
                          >
                            {station.displayDescription}
                          </div>

                          <a
                            href={buildGoogleMapsUrl(station)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#006A4E] mt-2 inline-block"
                            dir="auto"
                          >
                            📍 {text.openInGoogleMaps}
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}