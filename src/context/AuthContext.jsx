import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    ),
  ])
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null)
      return null
    }

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('id, full_name, email, role, created_at')
          .eq('id', currentUser.id)
          .maybeSingle(),
        8000
      )

      if (error) {
        console.error('Fetch profile error:', error)
        setProfile(null)
        return null
      }

      setProfile(data)
      return data
    } catch (err) {
      console.error('Fetch profile timeout/error:', err)
      return null
    }
  }

  const loadAuth = async ({ showLoading = false } = {}) => {
    if (showLoading) setLoading(true)

    try {
      const {
        data: { session },
      } = await withTimeout(supabase.auth.getSession(), 8000)

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user)
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error('Auth load error:', err)

      if (showLoading) {
        setSession(null)
        setUser(null)
        setProfile(null)
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const safeSetAuthState = async (nextSession) => {
      if (!mounted) return

      setSession(nextSession)
      setUser(nextSession?.user ?? null)

      if (nextSession?.user) {
        await fetchProfile(nextSession.user)
      } else {
        setProfile(null)
      }

      if (mounted) setLoading(false)
    }

    const initialLoad = async () => {
      setLoading(true)

      try {
        const {
          data: { session },
        } = await withTimeout(supabase.auth.getSession(), 8000)

        if (!mounted) return

        await safeSetAuthState(session)
      } catch (err) {
        console.error('Initial auth error:', err)

        if (!mounted) return

        setSession(null)
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    }

    initialLoad()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      await safeSetAuthState(session)
    })

    const handlePageShow = () => {
      if (!mounted) return
      loadAuth({ showLoading: false })
    }

    const handleVisibilityChange = () => {
      if (!mounted) return

      if (document.visibilityState === 'visible') {
        loadAuth({ showLoading: false })
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      subscription.unsubscribe()
      window.removeEventListener('pageshow', handlePageShow)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const signUp = async ({ email, password, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    const createdUser = data?.user

    if (createdUser) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: createdUser.id,
            full_name: fullName || '',
            email: createdUser.email,
            role: 'user',
          },
          { onConflict: 'id' }
        )

      if (profileError) throw profileError
    }

    if (data?.session) {
      setSession(data.session)
      setUser(data.session.user)
      await fetchProfile(data.session.user)
      setLoading(false)
      return data
    }

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (!signInError && signInData?.session) {
      setSession(signInData.session)
      setUser(signInData.session.user)
      await fetchProfile(signInData.session.user)
      setLoading(false)
      return signInData
    }

    setLoading(false)
    return data
  }

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    setSession(data.session)
    setUser(data.user)
    await fetchProfile(data.user)
    setLoading(false)

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    setSession(null)
    setUser(null)
    setProfile(null)
    setLoading(false)
  }

  const isAdmin = profile?.role === 'admin'

  const value = {
    user,
    session,
    profile,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut,
    fetchProfile,
    refreshAuth: () => loadAuth({ showLoading: false }),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}