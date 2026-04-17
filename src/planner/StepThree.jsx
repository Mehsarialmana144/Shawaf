import { useState } from 'react'
import html2pdf from 'html2pdf.js'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { generatePDF } from '../utils/pdf'

function daysBetween(start, end) {
  if (!start || !end) return 1
  const diff = new Date(end) - new Date(start)
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

function buildMapsUrl(placeName, city) {
  const query = encodeURIComponent(`${placeName}, ${city}, Saudi Arabia`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

export default function StepThree({ tripData, plan, onBack, onRegenerate }) {
  const { t } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState('')

  const handleDownloadPDF = () => {
    const element = document.getElementById('trip-pdf')
    if (!element) return
    html2pdf()
      .set({
        margin: 0.5,
        filename: `Shawaf-${tripData.city || 'trip'}-itinerary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      })
      .from(element)
      .save()
  }

  if (!plan) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <p className="text-stone-500">{t('generating')}</p>
      </div>
    )
  }

  const days = daysBetween(tripData.startDate, tripData.endDate)
  const itinerary = plan.itinerary || plan.days || []

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const { error: dbError } = await supabase.from('trips').insert({
        user_id: user.id,
        city: tripData.city,
        budget: tripData.budget,
        days,
        travel_with: tripData.travelWith,
        interests: tripData.interests,
        trip_style: tripData.activityLevel,
        has_car: tripData.transportation === 'rentalCar' || tripData.transportation === 'privateDriver',
        preferred_time: tripData.preferredTime,
        notes: tripData.notes || '',
        ai_plan: plan,
      })
      if (dbError) throw dbError
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Failed to save trip')
    } finally {
      setSaving(false)
    }
  }

  const handleRegenerate = async () => {
    setRegenerating(true)
    setError('')
    setSaved(false)
    try {
      const payload = {
        city: tripData.city,
        budget: tripData.budget,
        days,
        travelWith: tripData.travelWith,
        interests: tripData.interests,
        tripStyle: tripData.activityLevel,
        hasCar: tripData.transportation === 'rentalCar' || tripData.transportation === 'privateDriver',
        preferredTime: tripData.preferredTime,
        notes: tripData.notes || '',
      }
      const { data: fnData, error: fnError } = await supabase.functions.invoke('generate-trip', {
        body: payload,
      })
      if (fnError) throw fnError
      onRegenerate(fnData)
    } catch (err) {
      setError(err.message || 'Failed to regenerate')
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div>
      <div id="trip-pdf" className="bg-white p-8 rounded-2xl">

        {/* Summary card */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-5">
          <h3 className="flex items-center gap-2 font-semibold text-orange-700 mb-3">
            <span>🗺️</span> {t('tripSummary')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div><span className="text-stone-500">{t('destinationCityLabel')}</span> <strong>{tripData.city}</strong></div>
            <div><span className="text-stone-500">{t('startDateLabel')}</span> <strong>{tripData.startDate}</strong></div>
            <div><span className="text-stone-500">{t('endDateLabel')}</span> <strong>{tripData.endDate}</strong></div>
            <div><span className="text-stone-500">{t('numberOfPeopleLabel')}</span> <strong>{tripData.numberOfPeople}</strong></div>
          </div>
        </div>

        {/* Itinerary days */}
        {itinerary.map((day, di) => (
          <div key={di} className="card p-6 mb-4">
            <h3 className="font-bold text-stone-900 text-lg mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {di + 1}
              </span>
              {t('day')} {di + 1}
              {day.theme && <span className="text-sm font-normal text-stone-500 ms-2">— {day.theme}</span>}
            </h3>
            <div className="space-y-4">
              {(day.stations || day.activities || []).map((station, si) => (
                <div key={si} className="flex gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {si + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-stone-900 text-sm">
                          {station.name || station.place || station.title}
                        </div>
                        {station.time && (
                          <div className="text-xs text-orange-500 font-medium mt-0.5">{station.time}</div>
                        )}
                      </div>
                      <a
                        href={buildMapsUrl(station.name || station.place || station.title, tripData.city)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-xs text-orange-500 hover:text-orange-700 border border-orange-200 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-colors hover:bg-orange-50"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {t('openInMaps')}
                      </a>
                    </div>
                    <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
                      {station.description || station.desc || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 mt-4">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4 mt-4">
          ✓ {t('tripSaved')}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button onClick={onBack} className="btn-outline">{t('backToPlanner')}</button>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="btn-outline flex items-center gap-2 disabled:opacity-60"
        >
          {regenerating ? (
            <span className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
          ) : '🔄'} {t('regenerate')}
        </button>
        <button onClick={handleDownloadPDF} className="btn-outline flex items-center gap-2">
          📄 {t('generatePDF')}
        </button>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="btn-primary flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saved ? '✓' : '💾'} {saving ? t('saving') : t('saveTrip')}
        </button>
      </div>

      {/* Map CTA */}
      <div className="card p-5 mt-5 flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-stone-900">🗺️ {t('mapTitle')}</div>
          <div className="text-sm text-stone-500 mt-0.5">{tripData.city}</div>
        </div>
        <button
          onClick={() => {
            sessionStorage.setItem('currentTrip', JSON.stringify({ tripData, plan }))
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