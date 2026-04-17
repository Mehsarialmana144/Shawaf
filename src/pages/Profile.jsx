import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function Profile() {
  const { user, signOut } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ full_name: '', email: '' })
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('trips').select('id,city,days,budget,created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]).then(([{ data: p }, { data: tr }]) => {
      if (p) setProfile(p)
      setTrips(tr || [])
      setLoading(false)
    })
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: profile.full_name, email: user.email })
    setSaving(false)
    if (!error) setSaveMsg(t('profileUpdated'))
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this trip?')) return
    await supabase.from('trips').delete().eq('id', id)
    setTrips(prev => prev.filter(tr => tr.id !== id))
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-10 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">{t('myProfile')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="md:col-span-1">
          <div className="card p-6 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <div className="font-bold text-stone-900 mb-0.5">{profile.full_name || user.email?.split('@')[0]}</div>
            <div className="text-sm text-stone-500 mb-5">{user.email}</div>
            <div className="text-sm text-stone-400">{trips.length} {t('savedTrips')}</div>

            <button
              onClick={handleSignOut}
              className="mt-5 w-full btn-outline text-sm py-2 text-red-500 border-red-200 hover:bg-red-50"
            >
              {t('signOut')}
            </button>
          </div>
        </div>

        {/* Edit profile + trips */}
        <div className="md:col-span-2 space-y-5">
          {/* Edit profile */}
          <div className="card p-6">
            <h2 className="font-semibold text-stone-900 mb-4">{t('updateProfile')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t('fullName')}</label>
                <input
                  type="text"
                  className="input-field"
                  value={profile.full_name || ''}
                  onChange={e => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t('emailAddress')}</label>
                <input type="email" className="input-field bg-stone-50" value={user.email} disabled />
              </div>
            </div>
            {saveMsg && (
              <div className="mt-3 text-sm text-green-600 font-medium">{saveMsg}</div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 btn-primary disabled:opacity-60"
            >
              {saving ? '...' : t('updateProfile')}
            </button>
          </div>

          {/* Saved trips */}
          <div className="card p-6">
            <h2 className="font-semibold text-stone-900 mb-4">{t('savedTrips')}</h2>
            {trips.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="text-stone-500 text-sm mb-4">{t('noTripsYet')}</p>
                <button onClick={() => navigate('/planner')} className="btn-primary text-sm">
                  {t('startFirstTrip')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map(trip => (
                  <div key={trip.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <div>
                      <div className="font-medium text-stone-900 text-sm">{trip.city}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {trip.days} days · {trip.budget} · {new Date(trip.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sessionStorage.setItem('currentTrip', JSON.stringify({ tripData: trip, plan: trip.ai_plan }))
                          navigate('/itinerary')
                        }}
                        className="text-xs text-orange-500 hover:text-orange-700 border border-orange-200 rounded-lg px-3 py-1.5 transition-colors hover:bg-orange-50"
                      >
                        {t('viewItinerary')}
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="text-xs text-red-400 hover:text-red-600 border border-red-100 rounded-lg px-3 py-1.5 transition-colors hover:bg-red-50"
                      >
                        {t('deleteTrip')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
