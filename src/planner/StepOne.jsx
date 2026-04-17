import { useLang } from '../context/LanguageContext'
import SelectionCard from '../components/SelectionCard'

const CITIES = [
  'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam',
  'Al-Ula', 'NEOM', 'Abha', 'Taif', 'Yanbu',
  'Tabuk', 'Hail', 'Najran', 'Jizan', 'Al-Ahsa',
]

const TRIP_TYPES = [
  { key: 'cultural', emoji: '🏛️' },
  { key: 'adventure', emoji: '⛰️' },
  { key: 'relaxation', emoji: '🌴' },
  { key: 'religious', emoji: '🕌' },
  { key: 'business', emoji: '💼' },
  { key: 'family', emoji: '👨‍👩‍👧' },
]

function daysBetween(start, end) {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

export default function StepOne({ data, onChange, onNext }) {
  const { t } = useLang()

  const days = daysBetween(data.startDate, data.endDate)

  const handleNext = () => {
    if (!data.city) return alert(t('searchCity'))
    if (!data.startDate || !data.endDate) return alert('Please select dates')
    if (!data.tripType) return alert('Please select a trip type')
    onNext()
  }

  return (
    <div className="card p-8">
      <h2 className="text-xl font-bold text-stone-900 mb-1">{t('planNewTrip')}</h2>
      <p className="text-sm text-stone-500 mb-7">{t('step1Sub')}</p>

      {/* Destination City */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
          <span className="text-orange-500">📍</span> {t('destinationCity')}
        </label>
        <div className="relative">
          <select
            className="input-field appearance-none pr-10"
            value={data.city}
            onChange={e => onChange({ city: e.target.value })}
          >
            <option value="">{t('searchCity')}</option>
            {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
          <svg className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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
            onChange={e => onChange({ startDate: e.target.value })}
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
            onChange={e => onChange({ endDate: e.target.value })}
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
            onClick={() => onChange({ numberOfPeople: Math.max(1, data.numberOfPeople - 1) })}
            className="w-10 h-10 border-2 border-stone-200 rounded-full text-stone-600 font-bold text-xl flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors"
          >
            -
          </button>
          <span className="text-2xl font-bold text-stone-900 w-8 text-center">{data.numberOfPeople}</span>
          <button
            type="button"
            onClick={() => onChange({ numberOfPeople: Math.min(20, data.numberOfPeople + 1) })}
            className="w-10 h-10 border-2 border-stone-200 rounded-full text-stone-600 font-bold text-xl flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Trip Type */}
      <div className="mb-8">
        <label className="text-sm font-semibold text-stone-700 block mb-3">{t('tripType')}</label>
        <div className="grid grid-cols-3 gap-3">
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
