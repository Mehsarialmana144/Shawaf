import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import SelectionCard from '../components/SelectionCard'

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

export default function StepTwo({ data, onChange, onBack, onGenerate }) {
  const { t } = useLang()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        data.accommodation ? `Accommodation: ${data.accommodation}` : '',
        data.tripType ? `Trip type: ${data.tripType}` : '',
      ].filter(Boolean)

      const payload = {
        city: data.city,
        budget: data.budget,
        days,
        travelWith: data.travelWith,
        interests: data.interests,
        tripStyle: data.activityLevel,
        hasCar:
          data.transportation === 'rentalCar' ||
          data.transportation === 'privateDriver',
        preferredTime: data.preferredTime,
        notes: notesParts.join(' | '),
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
        throw new Error(result?.error || 'Edge Function request failed')
      }

      if (!result) {
        throw new Error('No itinerary was returned from the Edge Function.')
      }

      if (user) {
        const { error: saveError } = await supabase.from('trips').insert([
          {
            user_id: user.id,
            city: data.city,
            budget: data.budget,
            days,
            travel_with: data.travelWith,
            interests: data.interests || [],
            trip_style: data.activityLevel,
            has_car:
              data.transportation === 'rentalCar' ||
              data.transportation === 'privateDriver',
            preferred_time: data.preferredTime,
            notes: notesParts.join(' | '),
            ai_plan: result,
          },
        ])

        if (saveError) {
          console.error('Trip save error:', saveError)
        }
      }

      onGenerate(result)
    } catch (err) {
      console.error('Generate itinerary error:', err)
      setError(err.message || 'Failed to send a request to the Edge Function')
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

  const accommodations = [
    { key: 'Budget Hotel', label: t('budgetHotel'), emoji: '🏨' },
    { key: 'Boutique Hotel', label: t('boutiqueHotel'), emoji: '🏩' },
    { key: '5-Star Hotel', label: t('fiveStarHotel'), emoji: '⭐' },
    { key: 'Resort', label: t('resort'), emoji: '🏝️' },
    { key: 'Vacation Rental', label: t('vacationRental'), emoji: '🏠' },
  ]

  const transports = [
    { key: 'rentalCar', label: t('rentalCar'), emoji: '🚗' },
    { key: 'taxiRide', label: t('taxiRide'), emoji: '🚕' },
    { key: 'publicTransport', label: t('publicTransport'), emoji: '🚌' },
    { key: 'privateDriver', label: t('privateDriver'), emoji: '🚘' },
  ]

  const times = [
    { key: 'Morning', label: t('morning') },
    { key: 'Afternoon', label: t('afternoon') },
    { key: 'Evening', label: t('evening') },
    { key: 'No Preference', label: t('noPreference') },
  ]

  const companions = [
    { key: 'Alone', label: t('alone'), emoji: '🧍' },
    { key: 'Friends', label: t('friends'), emoji: '👫' },
    { key: 'Family', label: t('familyGroup'), emoji: '👨‍👩‍👧' },
    { key: 'Family with Kids', label: t('familyKids'), emoji: '👶' },
  ]

  return (
    <div>
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-orange-700 mb-3">
          <span>🗺️</span> {t('tripSummary')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-stone-500">{t('destinationCityLabel')}</span>{' '}
            <strong>{data.city}</strong>
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
        </div>
      </div>

      <Section icon="💵" title={t('budgetRange')}>
        <div className="grid grid-cols-3 gap-3 mb-4">
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
        <div className="flex justify-between text-xs text-stone-400 mb-1">
          <span>SAR 1,000</span>
          <span>SAR 5,000</span>
        </div>
        <input
          type="range"
          min={1000}
          max={5000}
          step={100}
          value={data.budgetAmount || 2000}
          onChange={(e) => onChange({ budgetAmount: Number(e.target.value) })}
          className="w-full accent-orange-500"
        />
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
        <div className="grid grid-cols-4 gap-2">
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

      <Section icon="🏨" title={t('accommodationType')}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {accommodations.map((a) => (
            <SelectionCard
              key={a.key}
              emoji={a.emoji}
              label={a.label}
              selected={data.accommodation === a.key}
              onClick={() => onChange({ accommodation: a.key })}
            />
          ))}
        </div>
      </Section>

      <Section icon="🚗" title={t('transportation')}>
        <div className="grid grid-cols-2 gap-3">
          {transports.map((tr) => (
            <SelectionCard
              key={tr.key}
              emoji={tr.emoji}
              label={tr.label}
              wide
              selected={data.transportation === tr.key}
              onClick={() => onChange({ transportation: tr.key })}
            />
          ))}
        </div>
      </Section>

      <Section icon="🕐" title={t('preferredTime')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {times.map((ti) => (
            <SelectionCard
              key={ti.key}
              emoji={
                ti.key === 'Morning'
                  ? '🌅'
                  : ti.key === 'Afternoon'
                  ? '☀️'
                  : ti.key === 'Evening'
                  ? '🌇'
                  : '🌐'
              }
              label={ti.label}
              selected={data.preferredTime === ti.key}
              onClick={() => onChange({ preferredTime: ti.key })}
            />
          ))}
        </div>
      </Section>

      <Section icon="👥" title={t('travelWith')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {companions.map((c) => (
            <SelectionCard
              key={c.key}
              emoji={c.emoji}
              label={c.label}
              selected={data.travelWith === c.key}
              onClick={() => onChange({ travelWith: c.key })}
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

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-outline flex-shrink-0">
          {t('back')}
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 btn-primary justify-center py-4 rounded-2xl text-base disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('generating')}
            </span>
          ) : (
            t('generateItinerary')
          )}
        </button>
      </div>
    </div>
  )
}