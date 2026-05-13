import { useLang } from '../context/LanguageContext'
import SelectionCard from '../components/SelectionCard'

const CITIES = [
  'Riyadh',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Al-Khobar',
  'Dhahran',
  'Al-Ahsa',
  'Al-Ula',
  'NEOM',
  'Abha',
  'Taif',
  'Yanbu',
  'Tabuk',
  'Hail',
  'Najran',
  'Jizan',
  'Diriyah',
  'Buraidah',
  'Jubail',
  'Al-Baha',
  'Sakaka',
  'Hafar Al-Batin',
  'KAEC',
]

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

  const selectedCities = data.cities?.length
    ? data.cities
    : data.city
    ? [data.city]
    : []

  const days = daysBetween(data.startDate, data.endDate)

  const text = {
    destinationCity: isArabic ? 'مدينة الوجهة' : 'Destination City',
    chooseCity: isArabic ? 'اختر مدينة...' : 'Choose a city...',
    selectedCities: isArabic ? 'المدن المختارة' : 'Selected Cities',
    multiCityHint: isArabic
      ? 'يمكنك اختيار مدينة واحدة أو أكثر للرحلة. سيتم ترتيب الرحلة حسب ترتيب اختيارك.'
      : 'You can choose one or more cities. The trip will follow the order you select.',
    removeCity: isArabic ? 'حذف المدينة' : 'Remove city',
    alreadySelected: isArabic
      ? 'هذه المدينة مختارة بالفعل.'
      : 'This city is already selected.',
    cityRequired: isArabic
      ? 'الرجاء اختيار مدينة واحدة على الأقل.'
      : 'Please select at least one destination city.',
    datesRequired: isArabic
      ? 'الرجاء اختيار تاريخ البداية والنهاية.'
      : 'Please select start and end dates.',
    tripTypeRequired: isArabic
      ? 'الرجاء اختيار نوع الرحلة.'
      : 'Please select a trip type.',
    daysLessThanCities: isArabic
      ? 'عدد الأيام يجب أن يكون مساويًا أو أكثر من عدد المدن المختارة.'
      : 'The number of days should be at least the number of selected cities.',
  }

  const addCity = (city) => {
    if (!city) return

    if (selectedCities.includes(city)) {
      alert(text.alreadySelected)
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
    if (!selectedCities.length) {
      alert(text.cityRequired)
      return
    }

    if (!data.startDate || !data.endDate) {
      alert(text.datesRequired)
      return
    }

    if (days > 0 && selectedCities.length > days) {
      alert(text.daysLessThanCities)
      return
    }

    if (!data.tripType) {
      alert(text.tripTypeRequired)
      return
    }

    onNext()
  }

  return (
    <div className="card w-full p-5 sm:p-8 overflow-hidden">
      <div className="mb-7 text-start">
        <h2
          className="text-xl sm:text-2xl font-bold text-[#333333] mb-1 leading-tight"
          dir="auto"
        >
          {t('planNewTrip')}
        </h2>

        <p
          className="text-sm sm:text-base text-stone-500 leading-relaxed"
          dir="auto"
        >
          {t('step1Sub')}
        </p>
      </div>

      {/* Destination City Dropdown */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#333333] mb-2">
          <span className="text-[#006A4E]">📍</span>
          <span dir="auto">{text.destinationCity}</span>
        </label>

        <p className="text-xs text-stone-400 mb-3 leading-relaxed" dir="auto">
          {text.multiCityHint}
        </p>

        <div className="relative">
          <select
            className="input-field appearance-none pe-10 ps-4 text-sm sm:text-base min-h-[52px]"
            value=""
            onChange={(e) => addCity(e.target.value)}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <option value="">{text.chooseCity}</option>

            {CITIES.map((city) => (
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
          <div className="mt-4 bg-[#F5F5F0] border border-[#DDD8C8] rounded-2xl p-3">
            <div
              className="text-xs font-semibold text-stone-500 mb-2"
              dir="auto"
            >
              {text.selectedCities}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedCities.map((city, index) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-2 bg-white border border-[#D4AF37]/40 text-[#006A4E] rounded-full px-3 py-1.5 text-xs font-medium"
                  dir="auto"
                >
                  <span>
                    {index + 1}. {getCityLabel(city, lang)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    className="text-stone-400 hover:text-red-500"
                    aria-label={text.removeCity}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
        <div className="min-w-0">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#333333] mb-2">
            <span>📅</span>
            <span dir="auto">{t('startDate')}</span>
          </label>

          <input
            type="date"
            className="input-field min-h-[52px]"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </div>

        <div className="min-w-0">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#333333] mb-2">
            <span>📅</span>
            <span dir="auto">{t('endDate')}</span>
          </label>

          <input
            type="date"
            className="input-field min-h-[52px]"
            value={data.endDate}
            min={data.startDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </div>
      </div>

      {days > 0 && (
        <div
          className="mb-5 bg-[#E6F2EE] border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-[#006A4E] font-medium leading-relaxed"
          dir="auto"
        >
          {t('tripDayCount', days)}
        </div>
      )}

      {/* Number of People */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#333333] mb-3">
          <span>👥</span>
          <span dir="auto">{t('numberOfPeople')}</span>
        </label>

        <div className="flex items-center justify-center sm:justify-start gap-4">
          <button
            type="button"
            onClick={() =>
              onChange({
                numberOfPeople: Math.max(1, data.numberOfPeople - 1),
              })
            }
            className="w-11 h-11 border-2 border-stone-200 rounded-full text-stone-600 font-bold text-xl flex items-center justify-center hover:border-[#D4AF37] hover:text-[#006A4E] transition-colors"
            aria-label={
              isArabic ? 'تقليل عدد الأشخاص' : 'Decrease number of people'
            }
          >
            -
          </button>

          <span className="text-2xl font-bold text-[#333333] w-10 text-center">
            {data.numberOfPeople}
          </span>

          <button
            type="button"
            onClick={() =>
              onChange({
                numberOfPeople: Math.min(20, data.numberOfPeople + 1),
              })
            }
            className="w-11 h-11 border-2 border-stone-200 rounded-full text-stone-600 font-bold text-xl flex items-center justify-center hover:border-[#D4AF37] hover:text-[#006A4E] transition-colors"
            aria-label={
              isArabic ? 'زيادة عدد الأشخاص' : 'Increase number of people'
            }
          >
            +
          </button>
        </div>
      </div>

      {/* Trip Type */}
      <div className="mb-8">
        <label
          className="text-sm font-semibold text-[#333333] block mb-3"
          dir="auto"
        >
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
        type="button"
        onClick={handleNext}
        className="w-full btn-primary justify-center py-4 rounded-2xl text-sm sm:text-base"
      >
        {t('configureTrip')}
      </button>
    </div>
  )
}