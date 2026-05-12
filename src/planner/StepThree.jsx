import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { exportItineraryPdf } from '../utils/exportItineraryPdf'

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

function daysBetween(start, end) {
  if (!start || !end) return 1
  const diff = new Date(end) - new Date(start)
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

function getCityLabel(city, lang) {
  if (!city) return ''
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
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

  const placeName = station?.name || station?.place_name || getStationName(station)
  const query = encodeURIComponent(`${placeName}, ${city}, Saudi Arabia`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function getStationsFromDay(day) {
  return day?.stations || day?.activities || []
}

function attractionToStation(attraction, oldStation, index) {
  return {
    order: oldStation?.order || index + 1,
    id: attraction.id,
    place_name: attraction.name,
    name: attraction.name,
    name_ar: attraction.name_ar || null,
    address: `${attraction.name}, ${attraction.city}, Saudi Arabia`,
    time: oldStation?.time || '',
    description: attraction.description || oldStation?.description || '',
    description_ar:
      attraction.description_ar ||
      oldStation?.description_ar ||
      null,
    category: attraction.category,
    city: attraction.city,
    duration: attraction.estimated_duration
      ? `${Math.max(1, Math.round(Number(attraction.estimated_duration) / 60))} hours`
      : oldStation?.duration || '',
    lat: attraction.latitude,
    lng: attraction.longitude,
    latitude: attraction.latitude,
    longitude: attraction.longitude,
    opening_time: attraction.opening_time,
    closing_time: attraction.closing_time,
    estimated_duration: attraction.estimated_duration,
    price_range: attraction.price_range,
    availability_type: attraction.availability_type,
    source_url: attraction.source_url,
    source: 'database',
  }
}

export default function StepThree({ tripData, plan, onBack, onRegenerate }) {
  const { t, lang } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()

  const isArabic = lang === 'ar'

  const text = {
    regenerateDay: isArabic ? 'إعادة توليد اليوم' : 'Regenerate Day',
    regenerating: isArabic ? 'جاري التوليد...' : 'Regenerating...',
    editTime: isArabic ? 'تعديل الوقت' : 'Edit Time',
    replaceActivity: isArabic ? 'استبدال النشاط' : 'Replace Activity',
    replacing: isArabic ? 'جاري الاستبدال...' : 'Replacing...',
    removeActivity: isArabic ? 'حذف النشاط' : 'Remove Activity',
    openInMaps: isArabic ? 'فتح في خرائط Google' : t('openInMaps'),
    saved: isArabic ? 'تم الحفظ' : 'Saved',
    tripSaved: isArabic ? 'تم حفظ الرحلة بنجاح' : t('tripSaved'),
    savedSuccess: isArabic ? 'تم حفظ الرحلة بنجاح.' : 'Trip saved successfully.',
    removeConfirm: isArabic
      ? 'هل تريد حذف هذا النشاط من جدول الرحلة؟'
      : 'Remove this activity from the itinerary?',
    enterNewTime: isArabic ? 'أدخل الوقت الجديد:' : 'Enter the new time:',
    timeRequired: isArabic ? 'لا يمكن ترك الوقت فارغًا.' : 'Time cannot be empty.',
    mustSignIn: isArabic
      ? 'يجب تسجيل الدخول لحفظ الرحلة.'
      : 'You must be signed in to save this trip.',
    noReplacement: isArabic
      ? 'لم يتم العثور على بديل مناسب لهذه المدينة.'
      : 'No replacement attraction found for this city.',
    noRegeneratedDay: isArabic
      ? 'لم يتم إرجاع يوم جديد.'
      : 'No regenerated day was returned.',
    replaceFailed: isArabic ? 'فشل استبدال النشاط.' : 'Failed to replace activity.',
    regenerateFailed: isArabic ? 'فشل إعادة توليد هذا اليوم.' : 'Failed to regenerate this day.',
    saveFailed: isArabic ? 'فشل حفظ الرحلة.' : 'Failed to save trip',
    pdfFailed: isArabic
      ? 'فشل توليد ملف PDF. تأكد من وجود ملف الخط داخل public/fonts.'
      : 'Failed to generate PDF. Make sure the font file exists in public/fonts.',
  }

  const [localPlan, setLocalPlan] = useState(plan)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedTripId, setSavedTripId] = useState(null)
  const [busyAction, setBusyAction] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setLocalPlan(plan)
    setSaved(false)
    setSavedTripId(null)
    setError('')
  }, [plan])

  if (!localPlan) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <p className="text-stone-500">{t('generating')}</p>
      </div>
    )
  }

  const days = daysBetween(tripData.startDate, tripData.endDate)
  const itinerary = localPlan.itinerary || localPlan.days || []

  const selectedCities =
    localPlan?.cities?.length
      ? localPlan.cities
      : tripData?.cities?.length
      ? tripData.cities
      : tripData?.city
      ? [tripData.city]
      : []

  const cityDisplay = selectedCities.length
    ? selectedCities.map((city) => getCityLabel(city, lang)).join(isArabic ? ' ← ' : ' → ')
    : getCityLabel(tripData.city, lang)

  const handleDownloadPDF = async () => {
    try {
      setError('')

      await exportItineraryPdf({
        tripData: {
          ...tripData,
          city: cityDisplay,
          cities: selectedCities,
        },
        plan: localPlan,
        lang,
      })
    } catch (err) {
      console.error('PDF export error:', err)
      setError(text.pdfFailed)
    }
  }

  const updatePlanWithItinerary = (updatedItinerary) => {
    const updatedPlan = {
      ...localPlan,
      days: updatedItinerary,
      itinerary: updatedItinerary,
    }

    setLocalPlan(updatedPlan)
    setSaved(false)
    setSavedTripId(null)

    if (onRegenerate) {
      onRegenerate(updatedPlan)
    }
  }

  const getUsedStationNames = () => {
    return new Set(
      itinerary
        .flatMap((day) => getStationsFromDay(day))
        .map((station) =>
          normalize(station?.name || station?.place_name || getStationName(station))
        )
    )
  }

  const handleRemoveActivity = (dayIndex, stationIndex) => {
    const confirmed = confirm(text.removeConfirm)
    if (!confirmed) return

    const updatedItinerary = itinerary.map((day, currentDayIndex) => {
      if (currentDayIndex !== dayIndex) return day

      const stations = getStationsFromDay(day)
      const updatedStations = stations
        .filter((_, currentStationIndex) => currentStationIndex !== stationIndex)
        .map((station, index) => ({
          ...station,
          order: index + 1,
        }))

      return {
        ...day,
        stations: updatedStations,
      }
    })

    updatePlanWithItinerary(updatedItinerary)
  }

  const handleEditTime = (dayIndex, stationIndex) => {
    const stations = getStationsFromDay(itinerary[dayIndex])
    const station = stations[stationIndex]
    const currentTime = station?.time || ''

    const newTime = prompt(text.enterNewTime, currentTime)

    if (newTime === null) return

    if (!newTime.trim()) {
      setError(text.timeRequired)
      return
    }

    const updatedItinerary = itinerary.map((day, currentDayIndex) => {
      if (currentDayIndex !== dayIndex) return day

      const currentStations = getStationsFromDay(day)

      const updatedStations = currentStations.map((item, currentStationIndex) => {
        if (currentStationIndex !== stationIndex) return item

        return {
          ...item,
          time: newTime.trim(),
        }
      })

      return {
        ...day,
        stations: updatedStations,
      }
    })

    updatePlanWithItinerary(updatedItinerary)
  }

  const handleReplaceActivity = async (dayIndex, stationIndex) => {
    const day = itinerary[dayIndex]
    const stations = getStationsFromDay(day)
    const oldStation = stations[stationIndex]

    if (!oldStation) return

    const dayCity =
      day?.city ||
      oldStation?.city ||
      selectedCities[dayIndex] ||
      selectedCities[0] ||
      tripData.city

    const actionKey = `replace-${dayIndex}-${stationIndex}`

    setBusyAction(actionKey)
    setError('')

    try {
      const oldCategory = oldStation.category
      const usedNames = getUsedStationNames()

      let query = supabase
        .from('attractions')
        .select(
          'id, name, name_ar, city, category, description, description_ar, opening_time, closing_time, estimated_duration, latitude, longitude, price_range, availability_type, source_url, status'
        )
        .eq('status', 'active')
        .ilike('city', dayCity)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .limit(80)

      if (oldCategory) {
        query = query.eq('category', oldCategory)
      }

      let { data, error: dbError } = await query

      if (dbError) throw dbError

      let candidates = (data || []).filter((attraction) => {
        const candidateName = normalize(attraction.name)
        const oldName = normalize(
          oldStation?.name || oldStation?.place_name || getStationName(oldStation)
        )
        return candidateName !== oldName && !usedNames.has(candidateName)
      })

      if (candidates.length === 0 && oldCategory) {
        const fallback = await supabase
          .from('attractions')
          .select(
            'id, name, name_ar, city, category, description, description_ar, opening_time, closing_time, estimated_duration, latitude, longitude, price_range, availability_type, source_url, status'
          )
          .eq('status', 'active')
          .ilike('city', dayCity)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .limit(80)

        if (fallback.error) throw fallback.error

        candidates = (fallback.data || []).filter((attraction) => {
          const candidateName = normalize(attraction.name)
          const oldName = normalize(
            oldStation?.name || oldStation?.place_name || getStationName(oldStation)
          )
          return candidateName !== oldName && !usedNames.has(candidateName)
        })
      }

      if (candidates.length === 0) {
        throw new Error(`${text.noReplacement} ${getCityLabel(dayCity, lang)}`)
      }

      const replacement = candidates[Math.floor(Math.random() * candidates.length)]

      const updatedItinerary = itinerary.map((currentDay, currentDayIndex) => {
        if (currentDayIndex !== dayIndex) return currentDay

        const currentStations = getStationsFromDay(currentDay)

        const updatedStations = currentStations.map((station, currentStationIndex) => {
          if (currentStationIndex !== stationIndex) return station
          return attractionToStation(replacement, oldStation, currentStationIndex)
        })

        return {
          ...currentDay,
          stations: updatedStations,
        }
      })

      updatePlanWithItinerary(updatedItinerary)
    } catch (err) {
      console.error('Replace activity error:', err)
      setError(err.message || text.replaceFailed)
    } finally {
      setBusyAction('')
    }
  }

  const handleRegenerateDay = async (dayIndex) => {
    const day = itinerary[dayIndex]
    const dayCity = day?.city || selectedCities[dayIndex] || selectedCities[0] || tripData.city

    const currentDayPlaceNames = getStationsFromDay(day)
      .map((station) => station?.name || station?.place_name || station?.title || station?.place)
      .filter(Boolean)

    const actionKey = `regenerate-day-${dayIndex}`
    setBusyAction(actionKey)
    setError('')

    try {
      const payload = {
        city: dayCity,
        cities: [dayCity],
        budget: tripData.budget,
        days: 1,
        travelWith: tripData.travelWith || 'General',
        interests: tripData.interests || [],
        tripStyle: tripData.activityLevel,
        hasCar: false,
        preferredTime: 'No Preference',
        notes: `${tripData.notes || ''} Regenerate only day ${
          dayIndex + 1
        } for ${dayCity}. Keep all activities in ${dayCity}. Do not repeat these current places: ${currentDayPlaceNames.join(
          ', '
        )}. Choose different attractions from the database if possible.`,
        numberOfPeople: tripData.numberOfPeople,
        accommodation: 'Not specified',
        tripType: 'Leisure',
      }

      const { data: fnData, error: fnError } = await supabase.functions.invoke(
        'Generate-trip',
        {
          body: payload,
        }
      )

      if (fnError) throw fnError

      const newItinerary = fnData?.itinerary || fnData?.days || []
      const newDay = newItinerary[0]

      if (!newDay) {
        throw new Error(text.noRegeneratedDay)
      }

      const updatedDay = {
        ...newDay,
        day: dayIndex + 1,
        city: dayCity,
      }

      const updatedItinerary = itinerary.map((currentDay, currentDayIndex) => {
        if (currentDayIndex !== dayIndex) return currentDay
        return updatedDay
      })

      updatePlanWithItinerary(updatedItinerary)
    } catch (err) {
      console.error('Regenerate day error:', err)
      setError(err.message || text.regenerateFailed)
    } finally {
      setBusyAction('')
    }
  }

  const handleSave = async () => {
    if (saving || saved) return

    if (!user) {
      setError(text.mustSignIn)
      return
    }

    setSaving(true)
    setError('')

    try {
      const { data: insertedTrip, error: dbError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          city: cityDisplay,
          budget: tripData.budget,
          days,
          travel_with: tripData.travelWith || 'General',
          interests: tripData.interests || [],
          trip_style: tripData.activityLevel,
          has_car: false,
          preferred_time: 'No Preference',
          notes: tripData.notes || '',
          ai_plan: localPlan,
        })
        .select('id')
        .single()

      if (dbError) throw dbError

      setSavedTripId(insertedTrip?.id || null)
      setSaved(true)
    } catch (err) {
      console.error('Save trip error:', err)
      setError(err.message || text.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div id="trip-pdf" className="bg-white p-8 rounded-2xl">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-5">
          <h3 className="flex items-center gap-2 font-semibold text-orange-700 mb-3">
            <span>🗺️</span> {t('tripSummary')}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="sm:col-span-2">
              <span className="text-stone-500">{t('destinationCityLabel')}</span>{' '}
              <strong dir="auto">{cityDisplay}</strong>
            </div>

            <div>
              <span className="text-stone-500">{t('startDateLabel')}</span>{' '}
              <strong>{tripData.startDate}</strong>
            </div>

            <div>
              <span className="text-stone-500">{t('endDateLabel')}</span>{' '}
              <strong>{tripData.endDate}</strong>
            </div>

            <div>
              <span className="text-stone-500">{t('numberOfPeopleLabel')}</span>{' '}
              <strong>{tripData.numberOfPeople}</strong>
            </div>
          </div>
        </div>

        {itinerary.map((day, di) => {
          const dayCity = day?.city || selectedCities[di] || selectedCities[0] || tripData.city
          const dayCityLabel = getCityLabel(dayCity, lang)
          const dayTheme = lang === 'ar' ? day.theme_ar || day.theme : day.theme

          return (
            <div key={di} className="card p-6 mb-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2 flex-wrap">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {di + 1}
                  </span>

                  {t('day')} {di + 1}

                  {dayCityLabel && (
                    <span className="text-sm font-semibold text-orange-600" dir="auto">
                      ({dayCityLabel})
                    </span>
                  )}

                  {dayTheme && (
                    <span className="text-sm font-normal text-stone-500 ms-1" dir="auto">
                      — {dayTheme}
                    </span>
                  )}
                </h3>

                <button
                  type="button"
                  onClick={() => handleRegenerateDay(di)}
                  disabled={busyAction === `regenerate-day-${di}`}
                  className="text-xs border border-orange-200 text-orange-600 hover:bg-orange-50 rounded-full px-3 py-1.5 transition-colors disabled:opacity-60"
                >
                  {busyAction === `regenerate-day-${di}`
                    ? text.regenerating
                    : `🔄 ${text.regenerateDay}`}
                </button>
              </div>

              <div className="space-y-4">
                {getStationsFromDay(day).map((station, si) => {
                  const stationName = getStationName(station, lang)
                  const stationDescription = getStationDescription(station, lang)
                  const stationCategory = getCategoryLabel(station.category, lang)
                  const replaceKey = `replace-${di}-${si}`

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
                            href={buildMapsUrl(station, dayCity)}
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

                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => handleEditTime(di, si)}
                            className="text-xs border border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-600 rounded-full px-3 py-1.5 transition-colors"
                          >
                            ✏️ {text.editTime}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReplaceActivity(di, si)}
                            disabled={busyAction === replaceKey}
                            className="text-xs border border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-600 rounded-full px-3 py-1.5 transition-colors disabled:opacity-60"
                          >
                            {busyAction === replaceKey
                              ? text.replacing
                              : `🔁 ${text.replaceActivity}`}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(di, si)}
                            className="text-xs border border-red-200 text-red-500 hover:bg-red-50 rounded-full px-3 py-1.5 transition-colors"
                          >
                            🗑️ {text.removeActivity}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 mt-4">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4 mt-4">
          ✓ {text.tripSaved}
          {savedTripId && (
            <span className="text-xs block mt-1 text-green-600">
              {text.savedSuccess}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <button onClick={onBack} className="btn-outline">
          {t('backToPlanner')}
        </button>

        <button
          onClick={handleDownloadPDF}
          className="btn-outline flex items-center gap-2"
        >
          📄 {t('generatePDF')}
        </button>

        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="btn-primary flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            '✓'
          ) : (
            '💾'
          )}{' '}
          {saving ? t('saving') : saved ? text.saved : t('saveTrip')}
        </button>
      </div>

      <div className="card p-5 mt-5 flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-stone-900">🗺️ {t('mapTitle')}</div>
          <div className="text-sm text-stone-500 mt-0.5" dir="auto">
            {cityDisplay}
          </div>
        </div>

        <button
          onClick={() => {
            sessionStorage.setItem(
              'currentTrip',
              JSON.stringify({
                tripData: { ...tripData, city: cityDisplay, cities: selectedCities },
                plan: localPlan,
              })
            )
            navigate('/map')
          }}
          className="btn-primary text-sm py-2 px-4"
        >
          {t('map')} →
        </button>
      </div>
    </div>
  )
}