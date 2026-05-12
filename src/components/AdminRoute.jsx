import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const { lang } = useLang()

  const isArabic = lang === 'ar'

  const text = {
    unauthorizedTitle: isArabic ? 'غير مصرح بالدخول' : 'Unauthorized Access',
    unauthorizedMessage: isArabic
      ? 'ليس لديك صلاحية للوصول إلى لوحة تحكم الأدمن.'
      : 'You do not have permission to access the admin dashboard.',
    backHome: isArabic ? 'العودة للرئيسية' : 'Back to Home',
  }

  const [checkingRole, setCheckingRole] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminRole = async () => {
      if (loading) return

      if (!user) {
        setIsAdmin(false)
        setCheckingRole(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Admin role check error:', error)
        setIsAdmin(false)
      } else {
        setIsAdmin(data?.role === 'admin')
      }

      setCheckingRole(false)
    }

    checkAdminRole()
  }, [user, loading])

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-8 max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>

          <h1 className="text-xl font-bold text-stone-900 mb-2">
            {text.unauthorizedTitle}
          </h1>

          <p className="text-stone-500 text-sm mb-5">
            {text.unauthorizedMessage}
          </p>

          <Link to="/" className="btn-primary">
            {text.backHome}
          </Link>
        </div>
      </div>
    )
  }

  return children
}