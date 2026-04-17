import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

// Approximate coordinates for major Saudi cities
const CITY_COORDS = {
  'Riyadh':   [24.6877, 46.7219],
  'Jeddah':   [21.4858, 39.1925],
  'Mecca':    [21.3891, 39.8579],
  'Medina':   [24.5247, 39.5692],
  'Dammam':   [26.4207, 50.0888],
  'Al-Ula':   [26.6239, 37.9216],
  'NEOM':     [28.0339, 35.1389],
  'Abha':     [18.2164, 42.5053],
  'Taif':     [21.2854, 40.4146],
  'Yanbu':    [24.0895, 38.0618],
  'Tabuk':    [28.3838, 36.5550],
  'Hail':     [27.5114, 41.6906],
  'Najran':   [17.4924, 44.1277],
  'Jizan':    [16.8892, 42.5511],
  'Al-Ahsa':  [25.3831, 49.5867],
}

const CATEGORY_COLORS = {
  Landmark:    '#3B82F6',
  Museum:      '#8B5CF6',
  Historical:  '#F97316',
  Heritage:    '#10B981',
  Entertainment: '#EC4899',
  Shopping:    '#F59E0B',
  Culture:     '#6366F1',
  Outdoor:     '#14B8A6',
  Natural:     '#22C55E',
}

const LEGEND = [
  { type: 'Landmark', color: '#3B82F6' },
  { type: 'Museum', color: '#8B5CF6' },
  { type: 'Historical', color: '#F97316' },
  { type: 'Heritage', color: '#10B981' },
  { type: 'Entertainment', color: '#EC4899' },
  { type: 'Shopping', color: '#F59E0B' },
  { type: 'Culture', color: '#6366F1' },
  { type: 'Outdoor', color: '#14B8A6' },
  { type: 'Natural', color: '#22C55E' },
]

export default function MapPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  const [tripData, setTripData] = useState(null)
  const [plan, setPlan] = useState(null)
  const [selectedDay, setSelectedDay] = useState('all')
  const [mapReady, setMapReady] = useState(false)

  // Load trip from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('currentTrip')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTripData(parsed.tripData)
        setPlan(parsed.plan)
      } catch (_) {}
    }
  }, [])

  // Init Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then(L => {
      const city = tripData?.city || 'Riyadh'
      const center = CITY_COORDS[city] || [24.6877, 46.7219]

      const map = L.map(mapRef.current).setView(center, 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      mapInstanceRef.current = map
      setMapReady(true)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [tripData])

  // Draw markers when plan/day filter changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !plan) return

    import('leaflet').then(L => {
      // Clear old markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      const itinerary = plan.itinerary || plan.days || []
      const city = tripData?.city || 'Riyadh'
      const cityCenter = CITY_COORDS[city] || [24.6877, 46.7219]
      let num = 0

      itinerary.forEach((day, di) => {
        if (selectedDay !== 'all' && di + 1 !== Number(selectedDay)) return
        const stations = day.stations || day.activities || []
        stations.forEach((station) => {
          num++
          // Use provided coords or generate slight offset from city center
          const lat = station.lat || (cityCenter[0] + (Math.random() - 0.5) * 0.06)
          const lng = station.lng || (cityCenter[1] + (Math.random() - 0.5) * 0.06)

          const color = CATEGORY_COLORS[station.category] || '#EA580C'
          const icon = L.divIcon({
            html: `<div style="width:32px;height:32px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:13px;">${num}</div>`,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })

          const marker = L.marker([lat, lng], { icon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="min-width:180px">
                <div style="font-weight:600;font-size:14px;margin-bottom:4px">${station.name || station.place || station.title || ''}</div>
                ${station.time ? `<div style="color:#ea580c;font-size:12px;margin-bottom:4px">${station.time}</div>` : ''}
                <div style="color:#666;font-size:12px">${station.description || ''}</div>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((station.name || '') + ', ' + city + ', Saudi Arabia')}" target="_blank" style="color:#ea580c;font-size:12px;display:block;margin-top:6px">📍 Open in Google Maps</a>
              </div>
            `)
          markersRef.current.push(marker)
        })
      })
    })
  }, [mapReady, plan, selectedDay, tripData])

  const itinerary = plan?.itinerary || plan?.days || []
  const days = itinerary.length

  // Flat list of attractions for sidebar
  const allStations = itinerary.flatMap((day, di) =>
    (day.stations || day.activities || []).map(s => ({
      ...s,
      dayNum: di + 1,
      time: s.time || '',
    }))
  ).filter(s => selectedDay === 'all' || s.dayNum === Number(selectedDay))

  if (!plan) {
    return (
      <div className="py-20 px-4 text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">{t('noTripData')}</h2>
        <button onClick={() => navigate('/planner')} className="btn-primary mt-4">
          {t('tripPlanner')}
        </button>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Left sidebar */}
      <div className="w-72 flex-shrink-0 bg-white border-e border-stone-200 overflow-y-auto p-4 space-y-4">
        <div>
          <h2 className="font-bold text-stone-900 text-lg">{t('mapTitle')}</h2>
          <p className="text-sm text-stone-500">{tripData?.city} · {days} {days === 1 ? 'day' : 'days'}</p>
        </div>

        {/* Day filter */}
        <div className="card p-4">
          <h3 className="text-xs font-semibold text-stone-500 uppercase mb-3">{t('filterByDay')}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedDay === 'all'
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {t('allAttractions')}
            </button>
            {Array.from({ length: days }, (_, i) => i + 1).map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedDay === d
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-stone-200 text-stone-600 hover:border-orange-300'
                }`}
              >
                {t('day')} {d}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="card p-4">
          <h3 className="text-xs font-semibold text-stone-500 uppercase mb-3">{t('legend')}</h3>
          <div className="space-y-1.5">
            {LEGEND.map(({ type, color }) => (
              <div key={type} className="flex items-center gap-2 text-xs text-stone-600">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* Attractions list */}
        <div className="card p-4">
          <h3 className="text-xs font-semibold text-stone-500 uppercase mb-3">
            {allStations.length} {t('attractions')}
          </h3>
          <div className="space-y-3">
            {allStations.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-stone-800 text-xs leading-tight truncate">
                    {s.name || s.place || s.title}
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    {t('day')} {s.dayNum}{s.time ? ` · ${s.time}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 flex flex-col">
        {/* Map toolbar */}
        <div className="bg-white border-b border-stone-200 px-4 py-2 flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
            🗺️ Map
          </button>
          <button className="flex items-center gap-1.5 border border-stone-200 text-stone-600 px-3 py-1.5 rounded-lg text-sm hover:border-stone-400 transition-colors">
            🛰️ Satellite
          </button>
        </div>
        <div ref={mapRef} className="flex-1" style={{ minHeight: 0 }} />
      </div>
    </div>
  )
}
