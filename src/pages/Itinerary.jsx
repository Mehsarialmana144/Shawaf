import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { generatePDF } from '../utils/pdf'

function buildMapsUrl(placeName, city) {
  const query = encodeURIComponent(`${placeName}, ${city}, Saudi Arabia`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

export default function Itinerary() {
  const { user } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTrips(data || [])
        if (data && data.length > 0) setSelected(data[0])
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
        <h2 className="text-xl font-bold text-stone-900 mb-2">{t('noTripsYet')}</h2>
        <button onClick={() => navigate('/planner')} className="btn-primary mt-4">
          {t('startFirstTrip')}
        </button>
      </div>
    )
  }

  const plan = selected?.ai_plan
  const itinerary = plan?.itinerary || plan?.days || []

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto">
      {/* Trip selector */}
      {trips.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-3 mb-6">
          {trips.map(trip => (
            <button
              key={trip.id}
              onClick={() => setSelected(trip)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                selected?.id === trip.id
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-orange-300'
              }`}
            >
              {trip.city} · {trip.days}d
            </button>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-5">
        <h3 className="flex items-center gap-2 font-semibold text-orange-700 mb-3">
          <span>🗺️</span> {t('tripSummary')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div><span className="text-stone-500">{t('destinationCityLabel')}</span> <strong>{selected?.city}</strong></div>
          <div><span className="text-stone-500">Days:</span> <strong>{selected?.days}</strong></div>
          <div><span className="text-stone-500">Budget:</span> <strong>{selected?.budget}</strong></div>
          <div><span className="text-stone-500">Style:</span> <strong>{selected?.trip_style}</strong></div>
        </div>
      </div>

      {/* Days */}
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
                      {station.time && <div className="text-xs text-orange-500 font-medium mt-0.5">{station.time}</div>}
                    </div>
                    <a
                      href={buildMapsUrl(station.name || station.place || station.title, selected?.city)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-xs text-orange-500 hover:text-orange-700 border border-orange-200 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-colors hover:bg-orange-50"
                    >
                      📍 {t('openInMaps')}
                    </a>
                  </div>
                  <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">{station.description || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-2">
        <button onClick={() => navigate('/planner')} className="btn-outline">{t('backToPlanner')}</button>
        <button
          onClick={() => generatePDF({ city: selected?.city, numberOfPeople: '' }, plan, itinerary)}
          className="btn-outline flex items-center gap-2"
        >
          📄 {t('generatePDF')}
        </button>
        <button
          onClick={() => {
            sessionStorage.setItem('currentTrip', JSON.stringify({ tripData: selected, plan }))
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
