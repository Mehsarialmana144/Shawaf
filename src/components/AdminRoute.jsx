import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function AdminRoute({ children }) {
  const { user, profile, isAdmin, loading, fetchProfile } = useAuth()
  const { lang } = useLang()
  const [profileTimedOut, setProfileTimedOut] = useState(false)

  const isArabic = lang === 'ar'

  useEffect(() => {
    let timer

    if (user && !profile && !loading) {
      fetchProfile?.(user)

      timer = setTimeout(() => {
        setProfileTimedOut(true)
      }, 8000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [user, profile, loading, fetchProfile])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (!profile && !profileTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-500" dir="auto">
            {isArabic ? 'جاري تحميل بيانات الحساب...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}