import { useLang } from '../context/LanguageContext'
import SelectionCard from '../components/SelectionCard'

const CITIES = [
  'Riyadh',
  'Diriyah',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Al-Khobar',
  'Dhahran',
  'Al-Ahsa',
  'Al-Ula',
  'Abha',
  'Taif',
  'Yanbu',
  'Tabuk',
  'Hail',
  'Najran',
  'Jizan',
  'Buraidah',
  'Jubail',
  'Al-Baha',
  'Sakaka',
  'Hafar Al-Batin',
  'KAEC',
]

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

const TRIP_TYPES = [
  { key: 'cultural', emoji: '🏛️' },
  { key: 'adventure', emoji: '⛰️' },
  { key: 'relaxation', emoji: '🌴' },
  { key: 'religious', emoji: '🕌' },
  { key: 'business', emoji: '💼' },
  { key: 'family', emoji: '👨‍👩‍👧' },
]

function getCityLabel(city, lang) {
  if (!city) return ''
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
}

function daysBetween(start, end) {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

export default function StepOne({ data, onChange, onNext }) {
  const { t, lang } = useLang()

  const isArabic = lang === 'ar'

  const text = {
    selectCity: isArabic ? 'اختر مدينة...' : 'Select a city...',
    cityHelp: isArabic
      ? 'يمكنك اختيار مدينة واحدة أو أكثر للرحلة. الحد الأقصى 3 مدن.'
      : 'Select one or more cities for your trip. Maximum 3 cities.',
    selectedCities: isArabic ? 'المدن المختارة:' : 'Selected cities:',
    removeCity: isArabic ? 'حذف المدينة' : 'Remove city',
    maxCitiesAlert: isArabic
      ? 'يمكن اختيار 3 مدن كحد أقصى للرحلة الواحدة.'
      : 'You can select up to 3 cities only.',
    selectCityAlert: isArabic
      ? 'يرجى اختيار مدينة واحدة على الأقل.'
      : t('searchCity'),
    selectDatesAlert: isArabic
      ? 'يرجى اختيار تاريخ البداية والنهاية.'
      : 'Please select dates',
    selectTripTypeAlert: isArabic
      ? 'يرجى اختيار نوع الرحلة.'
      : 'Please select a trip type',
  }

  const days = daysBetween(data.startDate, data.endDate)
  const selectedCities = data.cities || (data.city ? [data.city] : [])

  const addCity = (city) => {
    if (!city) return

    if (selectedCities.includes(city)) return

    if (selectedCities.length >= 3) {
      alert(text.maxCitiesAlert)
      return
    }

    const updatedCities = [...selectedCities, city]

    onChange({
      cities: updatedCities,
      city: updatedCities[0] || '',
    })
  }

  const removeCity = (city) => {
    const updatedCities = selectedCities.filter((item) => item !== city)

    onChange({
      cities: updatedCities,
      city: updatedCities[0] || '',
    })
  }

  const handleNext = () => {
    if (selectedCities.length === 0) return alert(text.selectCityAlert)
    if (!data.startDate || !data.endDate) return alert(text.selectDatesAlert)
    if (!data.tripType) return alert(text.selectTripTypeAlert)

    onNext()
  }

  const availableCities = CITIES.filter((city) => !selectedCities.includes(city))

  return (
    <div className="card p-8">
      <h2 className="text-xl font-bold text-stone-900 mb-1">
        {t('planNewTrip')}
      </h2>

      <p className="text-sm text-stone-500 mb-7">{t('step1Sub')}</p>

      {/* Destination Cities */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
          <span className="text-orange-500">📍</span> {t('destinationCity')}
        </label>

        <p className="text-xs text-stone-400 mb-3">
          {text.cityHelp}
        </p>

        <div className="relative">
          <select
            className="input-field appearance-none pr-10"
            value=""
            onChange={(e) => addCity(e.target.value)}
          >
            <option value="">{text.selectCity}</option>

            {availableCities.map((city) => (
              <option key={city} value={city}>
                {getCityLabel(city, lang)}
              </option>
            ))}
          </select>

          <svg
            className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {selectedCities.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-stone-500 mb-2">
              {text.selectedCities}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedCities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 rounded-full px-3 py-1.5 text-sm"
                  dir="auto"
                >
                  {getCityLabel(city, lang)}

                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    className="text-orange-500 hover:text-red-500 font-bold leading-none"
                    title={text.removeCity}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <span>📅</span> {t('startDate')}
          </label>

          <input
            type="date"
            className="input-field"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
            <span>📅</span> {t('endDate')}
          </label>

          <input
            type="date"
            className="input-field"
            value={data.endDate}
            min={data.startDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </div>
      </div>

      {/* Day count badge */}
      {days > 0 && (
        <div className="mb-5 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5 text-sm text-orange-700 font-medium">
          {t('tripDayCount', days)}
        </div>
      )}

      {/* Number of People */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
          <span>👥</span> {t('numberOfPeople')}
        </label>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              onChange({
                numberOfPeople: Math.max(1, data.numberOfPeople - 1),
              })
            }
            className="w-10 h-10 border-2 border-stone-200 rounded-full text-stone-600 font-bold text-xl flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors"
          >
            -
          </button>

          <span className="text-2xl font-bold text-stone-900 w-8 text-center">
            {data.numberOfPeople}
          </span>

          <button
            type="button"
            onClick={() =>
              onChange({
                numberOfPeople: Math.min(20, data.numberOfPeople + 1),
              })
            }
            className="w-10 h-10 border-2 border-stone-200 rounded-full text-stone-600 font-bold text-xl flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Trip Type */}
      <div className="mb-8">
        <label className="text-sm font-semibold text-stone-700 block mb-3">
          {t('tripType')}
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TRIP_TYPES.map(({ key, emoji }) => (
            <SelectionCard
              key={key}
              emoji={emoji}
              label={t(key)}
              selected={data.tripType === key}
              onClick={() => onChange({ tripType: key })}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full btn-primary justify-center py-4 rounded-2xl text-base"
      >
        {t('configureTrip')}
      </button>
    </div>
  )
}