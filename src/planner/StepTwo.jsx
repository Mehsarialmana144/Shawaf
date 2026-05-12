import { useEffect, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import SelectionCard from '../components/SelectionCard'

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

function getCityLabel(city, lang) {
  if (!city) return ''
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
}

function daysBetween(start, end) {
  if (!start || !end) return 1
  const diff = new Date(end) - new Date(start)
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

function Section({ icon, title, children }) {
  return (
    <div className="card p-6 mb-4">
      <h3 className="flex items-center gap-2 font-semibold text-stone-900 text-base mb-4">
        <span className="text-orange-500">{icon}</span> {title}
      </h3>
      {children}
    </div>
  )
}

function LoadingExperience({ isArabic }) {
  const messages = isArabic
    ? [
        'نختار أفضل الأماكن حسب تفضيلاتك...',
        'نرتب الأيام حسب المدن والمسار...',
        'نتأكد من أوقات العمل والإحداثيات...',
        'نجهز لك خطة رحلة ممتعة...',
      ]
    : [
        'Choosing the best places for your preferences...',
        'Arranging days based on your city route...',
        'Checking opening hours and coordinates...',
        'Preparing a fun travel plan for you...',
      ]

  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2500)

    return () => clearInterval(timer)
  }, [messages.length])

  return (
    <div className="card p-8 text-center overflow-hidden relative">
      <div className="absolute inset-x-0 top-10 h-20 pointer-events-none">
        <div className="animate-[fly_3.2s_ease-in-out_infinite] text-4xl">
          ✈️
        </div>
      </div>

      <style>
        {`
          @keyframes fly {
            0% { transform: translateX(-45%) translateY(10px) rotate(-8deg); opacity: 0.4; }
            25% { transform: translateX(-15%) translateY(-8px) rotate(4deg); opacity: 1; }
            50% { transform: translateX(15%) translateY(4px) rotate(-3deg); opacity: 1; }
            75% { transform: translateX(35%) translateY(-10px) rotate(6deg); opacity: 1; }
            100% { transform: translateX(60%) translateY(8px) rotate(-6deg); opacity: 0.4; }
          }
        `}
      </style>

      <div className="pt-24">
        <div className="flex justify-center gap-3 mb-5 text-3xl">
          <span className="animate-bounce">🧳</span>
          <span className="animate-bounce [animation-delay:150ms]">🗺️</span>
          <span className="animate-bounce [animation-delay:300ms]">🏝️</span>
          <span className="animate-bounce [animation-delay:450ms]">☕</span>
        </div>

        <h3 className="text-xl font-bold text-stone-900 mb-2">
          {isArabic ? 'جاري توليد خطة الرحلة' : 'Generating Your Itinerary'}
        </h3>

        <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed min-h-[44px]">
          {messages[messageIndex]}
        </p>

        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
            <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-pulse [animation-delay:200ms]" />
            <span className="w-2.5 h-2.5 bg-orange-300 rounded-full animate-pulse [animation-delay:400ms]" />
          </div>
        </div>

        <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 text-xs text-orange-700">
          {isArabic
            ? 'قد يستغرق ذلك عدة ثوانٍ لأن شواف يختار الأماكن المناسبة ويوازن بين المدن والوقت.'
            : 'This may take a few seconds while Shawaf balances places, cities, and timing.'}
        </div>
      </div>
    </div>
  )
}

export default function StepTwo({ data, onChange, onBack, onGenerate }) {
  const { t, lang } = useLang()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isArabic = lang === 'ar'

  const text = {
    days: isArabic ? 'الأيام' : 'Days',
    multiCityRoute: isArabic
      ? 'سيتم ترتيب الرحلة حسب هذا المسار:'
      : 'Multi-city route will follow this order:',
    validation: isArabic
      ? 'يرجى اختيار مدينة واحدة على الأقل، والميزانية، ومستوى النشاط، ونوع نشاط واحد على الأقل.'
      : 'Please select at least one city, budget, activity level, and one activity type.',
    generateFailed: isArabic
      ? 'فشل إرسال الطلب لتوليد الرحلة.'
      : 'Failed to send a request to the Edge Function',
    requestFailed: isArabic
      ? 'فشل طلب توليد الرحلة.'
      : 'Edge Function request failed',
    noResult: isArabic
      ? 'لم يتم إرجاع جدول رحلة.'
      : 'No itinerary was returned from the Edge Function.',
  }

  const selectedCities = data.cities?.length
    ? data.cities
    : data.city
    ? [data.city]
    : []

  const primaryCity = selectedCities[0] || data.city || ''

  const cityDisplay = selectedCities
    .map((city) => getCityLabel(city, lang))
    .join(isArabic ? ' ← ' : ' → ')

  const toggleInterest = (interest) => {
    const current = data.interests || []

    onChange({
      interests: current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest],
    })
  }

  const days = daysBetween(data.startDate, data.endDate)

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    try {
      const notesParts = [
        data.notes || '',
        data.numberOfPeople ? `Number of people: ${data.numberOfPeople}` : '',
        selectedCities.length > 1
          ? `Multi-city route order: ${selectedCities.join(' -> ')}`
          : '',
      ].filter(Boolean)

      const payload = {
        city: primaryCity,
        cities: selectedCities,
        budget: data.budget,
        days,
        travelWith: data.travelWith || 'General',
        interests: data.interests || [],
        tripStyle: data.activityLevel,
        hasCar: false,
        preferredTime: 'No Preference',
        notes: notesParts.join(' | '),
        numberOfPeople: data.numberOfPeople,
        accommodation: 'Not specified',
        tripType: data.tripType || 'Leisure',
      }

      const response = await fetch(
        'https://esrnnyucvsmalldcxzns.supabase.co/functions/v1/Generate-trip',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || text.requestFailed)
      }

      if (!result) {
        throw new Error(text.noResult)
      }

      onGenerate(result)
    } catch (err) {
      console.error('Generate itinerary error:', err)
      setError(err.message || text.generateFailed)
    } finally {
      setLoading(false)
    }
  }

  const budgets = [
    { key: 'Budget', emoji: '💰' },
    { key: 'Mid-Range', emoji: '💳' },
    { key: 'Luxury', emoji: '💎' },
  ]

  const levels = [
    { key: 'Low', emoji: '🚶' },
    { key: 'Moderate', emoji: '🚴' },
    { key: 'High', emoji: '🏃' },
  ]

  const activityTypes = [
    { key: 'Sightseeing', label: t('sightseeing'), emoji: '🗺️' },
    { key: 'Local Dining', label: t('localDining'), emoji: '🍽️' },
    { key: 'Shopping', label: t('shopping'), emoji: '🛍️' },
    { key: 'Museums', label: t('museums'), emoji: '🏛️' },
    { key: 'Nature & Parks', label: t('natureParks'), emoji: '🌿' },
    { key: 'Sports & Adventure', label: t('sportsAdventure'), emoji: '🏄' },
    { key: 'Entertainment', label: t('entertainment'), emoji: '🎡' },
    { key: 'Photography Spots', label: t('photography'), emoji: '📸' },
  ]

  const canGenerate =
    selectedCities.length > 0 &&
    data.startDate &&
    data.endDate &&
    data.budget &&
    data.activityLevel &&
    (data.interests || []).length > 0

  if (loading) {
    return <LoadingExperience isArabic={isArabic} />
  }

  return (
    <div>
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-orange-700 mb-3">
          <span>🗺️</span> {t('tripSummary')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
          <div className="sm:col-span-2">
            <span className="text-stone-500">{t('destinationCityLabel')}</span>{' '}
            <strong dir="auto">{cityDisplay}</strong>
          </div>

          <div>
            <span className="text-stone-500">{t('startDateLabel')}</span>{' '}
            <strong>{data.startDate}</strong>
          </div>

          <div>
            <span className="text-stone-500">{t('endDateLabel')}</span>{' '}
            <strong>{data.endDate}</strong>
          </div>

          <div>
            <span className="text-stone-500">{t('numberOfPeopleLabel')}</span>{' '}
            <strong>{data.numberOfPeople}</strong>
          </div>

          <div>
            <span className="text-stone-500">{text.days}:</span>{' '}
            <strong>{days}</strong>
          </div>
        </div>

        {selectedCities.length > 1 && (
          <div className="mt-3 text-xs text-orange-700 bg-white border border-orange-100 rounded-xl px-3 py-2">
            {text.multiCityRoute}{' '}
            <strong dir="auto">{cityDisplay}</strong>
          </div>
        )}
      </div>

      <Section icon="💵" title={t('budgetRange')}>
        <div className="grid grid-cols-3 gap-3">
          {budgets.map((b) => (
            <SelectionCard
              key={b.key}
              emoji={b.emoji}
              label={t(
                b.key === 'Budget'
                  ? 'budget'
                  : b.key === 'Mid-Range'
                  ? 'midRange'
                  : 'luxury'
              )}
              selected={data.budget === b.key}
              onClick={() => onChange({ budget: b.key })}
            />
          ))}
        </div>
      </Section>

      <Section icon="⚡" title={t('activityLevel')}>
        <div className="grid grid-cols-3 gap-3">
          {levels.map((l) => (
            <SelectionCard
              key={l.key}
              emoji={l.emoji}
              label={t(l.key.toLowerCase())}
              selected={data.activityLevel === l.key}
              onClick={() => onChange({ activityLevel: l.key })}
            />
          ))}
        </div>
      </Section>

      <Section icon="🎯" title={t('activityTypes')}>
        <p className="text-xs text-stone-400 mb-3">{t('selectAllInterest')}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {activityTypes.map((a) => (
            <SelectionCard
              key={a.key}
              emoji={a.emoji}
              label={a.label}
              selected={(data.interests || []).includes(a.key)}
              onClick={() => toggleInterest(a.key)}
            />
          ))}
        </div>
      </Section>

      <div className="card p-6 mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-stone-900 text-base mb-3">
          <span className="text-orange-500">📝</span> {t('additionalNotes')}
        </h3>

        <textarea
          className="input-field resize-none h-24"
          placeholder={t('notesPlaceholder')}
          value={data.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      {!canGenerate && (
        <div className="bg-orange-50 border border-orange-100 text-orange-700 px-4 py-3 rounded-xl text-sm mb-4">
          {text.validation}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-outline flex-shrink-0">
          {t('back')}
        </button>

        <button
          onClick={handleGenerate}
          disabled={loading || !canGenerate}
          className="flex-1 btn-primary justify-center py-4 rounded-2xl text-base disabled:opacity-60"
        >
          {t('generateItinerary')}
        </button>
      </div>
    </div>
  )
}