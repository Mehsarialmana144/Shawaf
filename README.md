# Shawaf – شوّاف Full Source README

This README is a complete source reference for the Shawaf project. It includes the project overview, file structure, and the full content of every uploaded source file so the project can be reviewed from this single file.

> ملاحظة: هذا الملف طويل لأنه يحتوي كل الملفات البرمجية كاملة داخل Code Blocks.

## Project Summary

Shawaf is a React + Vite travel planning web app for Saudi tourism. It supports Arabic and English, user authentication through Supabase, AI itinerary generation through a Supabase Edge Function, saved trips, map visualization using Leaflet/OpenStreetMap, external Google Maps links, PDF export, user issue reports, and an admin dashboard for managing attractions, reports, and analytics.

## Main Stack

- React + Vite
- React Router
- Tailwind CSS
- Supabase Auth, Database, and Edge Functions
- Leaflet / OpenStreetMap for map display
- Google Maps external search links
- Recharts for admin analytics
- jsPDF / html2canvas style PDF utilities, depending on the uploaded implementation

## Important App Flow

1. User opens the site through `App.jsx` routes.
2. `LanguageContext.jsx` controls Arabic/English translations and page direction.
3. `AuthContext.jsx` controls Supabase auth, profile loading, admin role checks, and sign out.
4. Protected pages are wrapped by `ProtectedRoute.jsx`.
5. Admin pages are wrapped by `AdminRoute.jsx`.
6. Trip planning starts in `Planner.jsx` and moves through `StepOne.jsx`, `StepTwo.jsx`, and `StepThree.jsx`.
7. `StepTwo.jsx` calls the Supabase Edge Function `Generate-trip`.
8. `StepThree.jsx` displays, edits, regenerates, replaces, removes, saves, and exports the generated plan.
9. Saved trips are shown in `Itinerary.jsx` and `Profile.jsx`.
10. `MapPage.jsx` visualizes trip activities on a Leaflet map and opens Google Maps externally.
11. Admin pages manage attractions, user reports, dashboard stats, and analytics.

## File Structure

```text
src/
├── App.jsx
├── main.jsx
├── index.css
├── context/
│   ├── AuthContext.jsx
│   └── LanguageContext.jsx
├── components/
│   ├── ProtectedRoute.jsx
│   ├── AdminRoute.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── StepIndicator.jsx
│   └── SelectionCard.jsx
├── pages/
│   ├── Home.jsx
│   ├── SignIn.jsx
│   ├── SignUp.jsx
│   ├── ResetPassword.jsx
│   ├── UpdatePassword.jsx
│   ├── Planner.jsx
│   ├── Itinerary.jsx
│   ├── MapPage.jsx
│   ├── Profile.jsx
│   ├── ReportIssue.jsx
│   ├── Admin.jsx
│   ├── AdminAttractions.jsx
│   ├── AdminReports.jsx
│   └── AdminAnalytics.jsx
├── planner/
│   ├── StepOne.jsx
│   ├── StepTwo.jsx
│   └── StepThree.jsx
├── utils/
│   ├── itineraryDisplay.js
│   ├── exportItineraryPdf.js
│   ├── mapHelpers.js
│   ├── pdf.js
│   └── translations.js
└── lib/
    └── supabase.js
```

## Full Source Code

---

## `App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ResetPassword from './pages/ResetPassword'
import UpdatePassword from './pages/UpdatePassword'
import Planner from './pages/Planner'
import Itinerary from './pages/Itinerary'
import MapPage from './pages/MapPage'
import Profile from './pages/Profile'
import ReportIssue from './pages/ReportIssue'

import Admin from './pages/Admin'
import AdminAttractions from './pages/AdminAttractions'
import AdminReports from './pages/AdminReports'
import AdminAnalytics from './pages/AdminAnalytics'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[#F5F5F0] text-[#333333] overflow-x-hidden">
            <Navbar />

            <main className="flex-1 w-full overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/report-issue" element={<ReportIssue />} />

                <Route
                  path="/planner"
                  element={
                    <ProtectedRoute>
                      <Planner />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/itinerary"
                  element={
                    <ProtectedRoute>
                      <Itinerary />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/map"
                  element={
                    <ProtectedRoute>
                      <MapPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/attractions"
                  element={
                    <AdminRoute>
                      <AdminAttractions />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/reports"
                  element={
                    <AdminRoute>
                      <AdminReports />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/analytics"
                  element={
                    <AdminRoute>
                      <AdminAnalytics />
                    </AdminRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
```

---

## `main.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

```

---

## `index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Shawaf Brand Guidelines */
    --brand-green: #006A4E;
    --brand-green-dark: #004D39;
    --brand-green-soft: #E6F2EE;

    --brand-charcoal: #333333;
    --brand-charcoal-soft: #4B4B4B;

    --brand-offwhite: #F5F5F0;
    --brand-white: #FFFFFF;

    --brand-gold: #D4AF37;
    --brand-gold-dark: #B89122;
    --brand-gold-soft: #FBF6E3;

    --brand-border: #DDD8C8;
    --brand-muted: #78716C;
  }

  html,
  body,
  #root {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    background-color: var(--brand-offwhite);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html[dir='rtl'] {
    direction: rtl;
  }

  html[dir='ltr'] {
    direction: ltr;
  }

  html[dir="rtl"] body {
    font-family: 'Cairo', 'Tajawal', system-ui, sans-serif;
  }

  html[dir="ltr"] body {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  }

  body {
    background-color: var(--brand-offwhite);
    color: var(--brand-charcoal);
    font-family: 'Cairo', 'Inter', system-ui, sans-serif;
  }

  ::selection {
    background-color: var(--brand-gold);
    color: var(--brand-charcoal);
  }

  a {
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
  }

  main {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  img,
  svg,
  video,
  canvas {
    max-width: 100%;
  }

  input,
  select,
  textarea {
    max-width: 100%;
    font-size: 16px;
  }

  /* Keep technical values readable */
  input[type='email'],
  input[type='password'],
  input[type='url'],
  input[type='tel'],
  input[type='time'],
  input[type='date'],
  code,
  pre {
    direction: ltr;
    text-align: left;
  }

  /* Let mixed Arabic/English text choose its own direction */
  [dir='auto'] {
    unicode-bidi: plaintext;
  }

  /* Safe text wrapping without breaking brand words like Shawaf */
  p,
  li,
  td,
  th,
  textarea {
    overflow-wrap: anywhere;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  button,
  a,
  label,
  span {
    overflow-wrap: normal;
  }
}

@layer components {
  .btn-primary {
    @apply text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 inline-flex items-center gap-2 shadow-sm;
    background-color: var(--brand-green);
    border: 1px solid var(--brand-green);
  }

  .btn-primary:hover {
    background-color: var(--brand-green-dark);
    border-color: var(--brand-green-dark);
    box-shadow: 0 8px 20px rgba(0, 106, 78, 0.18);
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .btn-outline {
    @apply font-medium px-6 py-2.5 rounded-full transition-all duration-200 inline-flex items-center gap-2;
    color: var(--brand-charcoal);
    border: 1px solid var(--brand-border);
    background-color: var(--brand-white);
  }

  .btn-outline:hover {
    color: var(--brand-green);
    border-color: var(--brand-gold);
    background-color: var(--brand-gold-soft);
    box-shadow: 0 6px 16px rgba(212, 175, 55, 0.14);
  }

  .card {
    @apply bg-white rounded-2xl border shadow-sm;
    border-color: var(--brand-border);
  }

  .card:hover {
    box-shadow: 0 10px 28px rgba(51, 51, 51, 0.06);
  }

  .input-field {
    @apply w-full border rounded-xl px-4 py-3 text-stone-800 focus:outline-none transition-all;
    border-color: var(--brand-border);
    background-color: var(--brand-white);
    color: var(--brand-charcoal);
  }

  .input-field:focus {
    border-color: var(--brand-green);
    box-shadow: 0 0 0 3px rgba(0, 106, 78, 0.16);
  }

  .section-title {
    @apply text-3xl font-bold text-center;
    color: var(--brand-charcoal);
  }

  .section-divider {
    @apply w-12 h-1 mx-auto mt-3 mb-10 rounded-full;
    background-color: var(--brand-gold);
  }
}

/* Leaflet fix */
.leaflet-container {
  height: 100%;
  width: 100%;
  border-radius: 12px;
}

/* Keep Leaflet map stable in Arabic mode */
.leaflet-container,
.leaflet-container * {
  direction: ltr;
}

.leaflet-popup-content {
  direction: inherit;
}

/* Step progress line */
.step-line {
  flex: 1;
  height: 2px;
  background: var(--brand-border);
}

.step-line.active {
  background: var(--brand-green);
}

/* Selection card selected state */
.sel-card-selected {
  border-color: var(--brand-green);
  background-color: var(--brand-green-soft);
  color: var(--brand-green);
}

/* Brand utility helpers */
.brand-bg {
  background-color: var(--brand-green);
}

.brand-bg-dark {
  background-color: var(--brand-green-dark);
}

.brand-bg-soft {
  background-color: var(--brand-green-soft);
}

.brand-bg-gold {
  background-color: var(--brand-gold);
}

.brand-text {
  color: var(--brand-green);
}

.brand-text-dark {
  color: var(--brand-green-dark);
}

.brand-text-gold {
  color: var(--brand-gold);
}

.brand-text-charcoal {
  color: var(--brand-charcoal);
}

.brand-border {
  border-color: var(--brand-border);
}

.brand-border-green {
  border-color: var(--brand-green);
}

.brand-border-gold {
  border-color: var(--brand-gold);
}

/* Automatic override for old orange Tailwind classes */
.bg-orange-50 {
  background-color: var(--brand-green-soft) !important;
}

.bg-orange-100 {
  background-color: var(--brand-gold-soft) !important;
}

.bg-orange-200 {
  background-color: #EFE1A8 !important;
}

.bg-orange-300 {
  background-color: #E5CB6D !important;
}

.bg-orange-400 {
  background-color: var(--brand-gold) !important;
}

.bg-orange-500,
.bg-orange-600 {
  background-color: var(--brand-green) !important;
}

.bg-orange-700,
.bg-orange-800,
.hover\:bg-orange-700:hover,
.hover\:bg-orange-600:hover {
  background-color: var(--brand-green-dark) !important;
}

.text-orange-50,
.text-orange-100 {
  color: var(--brand-green-soft) !important;
}

.text-orange-300,
.text-orange-400 {
  color: var(--brand-gold) !important;
}

.text-orange-500,
.text-orange-600,
.text-orange-700 {
  color: var(--brand-green) !important;
}

.hover\:text-orange-600:hover,
.hover\:text-orange-700:hover,
.hover\:text-orange-500:hover {
  color: var(--brand-green-dark) !important;
}

.border-orange-100,
.border-orange-200,
.border-orange-300 {
  border-color: rgba(212, 175, 55, 0.45) !important;
}

.border-orange-400,
.border-orange-500,
.border-orange-600 {
  border-color: var(--brand-green) !important;
}

.hover\:border-orange-300:hover,
.hover\:border-orange-400:hover,
.hover\:border-orange-500:hover {
  border-color: var(--brand-gold) !important;
}

.ring-orange-400,
.focus\:ring-orange-400:focus {
  --tw-ring-color: rgba(0, 106, 78, 0.25) !important;
}

.accent-orange-500 {
  accent-color: var(--brand-green) !important;
}

.shadow-orange-200 {
  --tw-shadow-color: rgba(212, 175, 55, 0.28) !important;
}

.hover\:shadow-orange-500\/30:hover {
  --tw-shadow-color: rgba(0, 106, 78, 0.24) !important;
}

/* Gradients and hero visual helpers */
.brand-hero-gradient {
  background:
    radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.22), transparent 32%),
    radial-gradient(circle at 80% 30%, rgba(0, 106, 78, 0.32), transparent 34%),
    linear-gradient(135deg, #002F24 0%, #006A4E 48%, #0B3B2F 100%);
}

.brand-card-gradient {
  background:
    linear-gradient(135deg, rgba(0, 106, 78, 0.96), rgba(0, 77, 57, 0.96)),
    radial-gradient(circle at top right, rgba(212, 175, 55, 0.22), transparent 38%);
}

.brand-gold-gradient {
  background: linear-gradient(135deg, #D4AF37 0%, #F2D978 45%, #B89122 100%);
}

/* RTL adjustments */
[dir="rtl"] .rtl-flip {
  transform: scaleX(-1);
}

/* Tables should stay clean in both languages */
table {
  border-collapse: collapse;
}

/* Better Arabic rendering */
html[lang='ar'] body {
  font-family: 'Cairo', 'Inter', system-ui, sans-serif;
}

/* Better English rendering */
html[lang='en'] body {
  font-family: 'Inter', system-ui, sans-serif;
}

/* Scrollbar styling aligned with brand */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--brand-offwhite);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 106, 78, 0.35);
  border-radius: 999px;
  border: 2px solid var(--brand-offwhite);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 106, 78, 0.55);
}

/* Mobile / Tablet responsive safety */
@media (max-width: 768px) {
  body {
    font-size: 15px;
  }

  nav {
    max-width: 100vw;
    overflow-x: hidden;
  }

  .section-title {
    font-size: 1.75rem;
    line-height: 2.2rem;
  }

  .card {
    border-radius: 1rem;
    max-width: 100%;
  }

  .btn-primary,
  .btn-outline {
    justify-content: center;
    text-align: center;
    white-space: normal;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .input-field {
    font-size: 16px;
  }

  .grid {
    min-width: 0;
  }

  .step-line {
    width: 100%;
    min-width: 0;
  }

  table {
    min-width: 640px;
  }

  .overflow-x-auto {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .leaflet-container {
    min-height: 320px;
  }

  select.input-field,
  input.input-field,
  textarea.input-field {
    min-height: 52px;
  }
}

/* Extra small phones */
@media (max-width: 430px) {
  .btn-primary,
  .btn-outline {
    font-size: 0.875rem;
  }

  .section-title {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .input-field {
    padding-left: 0.9rem;
    padding-right: 0.9rem;
  }

  nav a {
    min-width: fit-content;
  }
}
```

---

## `context/AuthContext.jsx`

```jsx
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
```

---

## `context/LanguageContext.jsx`

```jsx
import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Nav
    home: 'Home',
    tripPlanner: 'Trip Planner',
    itinerary: 'Itinerary',
    map: 'Map',
    profile: 'Profile',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    arabic: 'عربي',
    english: 'English',

    // Hero
    heroTag: '⚡ AI-Powered Travel Planning',
    heroTitle: 'Plan Your Perfect Trip in Saudi Arabia with AI',
    heroBrand: 'Shawaf — شواف',
    heroSub:
      'Enjoy smart, personalized trip planning powered by the latest AI technology. Create detailed daily itineraries that match your preferences and budget across Saudi Arabia.',
    startPlanning: 'Start Planning Your Trip',
    learnMore: 'Learn More',
    rating: '4.9',
    ratingLabel: 'User Rating',
    cities: '30+',
    citiesLabel: 'Covered Cities',
    travelers: '12K+',
    travelersLabel: 'Happy Travelers',
    trips: '50K+',
    tripsLabel: 'Trips Generated',

    // Features
    whyChoose: 'Why Choose Shawaf?',
    feat1Title: 'AI-Powered Planning',
    feat1Desc:
      'Our advanced AI generates personalized itineraries based on your unique preferences, travel style, and budget.',
    feat2Title: 'Interactive Maps',
    feat2Desc:
      'Visualize your journey with integrated maps showing all attractions, distances, and optimal routes.',
    feat3Title: 'Smart Scheduling',
    feat3Desc:
      'Automatically optimize your schedule based on opening hours, travel times, and attraction priorities.',
    feat4Title: 'PDF Export',
    feat4Desc:
      'Download your complete itinerary as a beautifully formatted PDF to take offline anywhere.',
    feat5Title: 'Multi-City Trips',
    feat5Desc:
      'Plan complex multi-city journeys across Saudi Arabia with seamless city-to-city transitions.',
    feat6Title: '24/7 Available',
    feat6Desc:
      'Plan your dream trip anytime, anywhere. No waiting, no appointments needed.',

    // How it works
    howItWorks: 'How Shawaf Works',
    step1: 'Create Your Account',
    step1Desc: 'Sign up and set your personal interests and preferences.',
    step2: 'Build Your Trip',
    step2Desc: 'Add your destinations, dates, budget, and activity preferences.',
    step3: 'Generate Itinerary',
    step3Desc: 'Our AI instantly generates a detailed daily travel plan.',
    step4: 'Explore & Enjoy',
    step4Desc:
      'Use the interactive map, export PDF, and enjoy your next journey.',

    // Testimonials
    travelers_say: 'What Travelers Say',
    t1:
      '"Shawaf planned my 5-day Riyadh trip perfectly. The AI understood exactly what I wanted!"',
    t1Name: 'Khalid Al-Mansour',
    t1City: 'Riyadh',
    t2:
      '"The interactive map feature is amazing. I could see all my planned stops at a glance."',
    t2Name: 'Sara Al-Otaibi',
    t2City: 'Jeddah',
    t3:
      '"Generated a complete Al-Ula itinerary in seconds. Saved me hours of research!"',
    t3Name: 'Mohammed Bin Nasser',
    t3City: 'Al-Ula',

    // CTA
    ctaTitle: 'Ready to Explore Saudi Arabia?',
    ctaSub: 'Join thousands of travelers planning smart with Shawaf.',
    ctaBtn: 'Start Planning Your Trip',

    // Footer
    footerDesc:
      'AI-powered travel planning for Saudi Arabia. Aligned with Vision 2030.',
    vision2030: '✦ Aligned with Vision 2030',
    quickLinks: 'Quick Links',
    account: 'Account',
    contactUs: 'Contact Us',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',

    // Auth
    signInTitle: 'Sign In',
    signUpTitle: 'Create Account',
    emailAddress: 'Email Address',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    fullName: 'Full Name',

    // Planner
    planNewTrip: 'Plan a New Trip',
    step1Label: 'Trip Details',
    step2Label: 'Preferences',
    step3Label: 'Itinerary',
    step1Sub: 'Step 1 of 3: Basic trip information',
    step2Sub: 'Step 2 of 3: Your preferences',
    destinationCity: 'Destination City',
    searchCity: 'Search for a city...',
    startDate: 'Start Date',
    endDate: 'End Date',
    numberOfPeople: 'Number of People',
    tripType: 'Trip Type',
    configureTrip: 'Configure Trip',
    tripDayCount: (n) => `📅 ${n} day${n !== 1 ? 's' : ''} trip`,

    cultural: 'Cultural & Heritage',
    adventure: 'Adventure & Outdoor',
    relaxation: 'Relaxation & Leisure',
    religious: 'Religious & Spiritual',
    business: 'Business & Tourism',
    family: 'Family Trip',

    budgetRange: 'Budget Range',
    budget: 'Budget',
    midRange: 'Mid-Range',
    luxury: 'Luxury',
    activityLevel: 'Activity Level',
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    activityTypes: 'Activity Types',
    selectAllInterest: 'Select all that interest you',
    sightseeing: 'Sightseeing',
    localDining: 'Local Dining',
    shopping: 'Shopping',
    museums: 'Museums',
    natureParks: 'Nature & Parks',
    sportsAdventure: 'Sports & Adventure',
    entertainment: 'Entertainment',
    photography: 'Photography Spots',
    additionalNotes: 'Additional Notes',
    notesPlaceholder: 'Any special requirements or preferences...',
    generateItinerary: 'Generate Itinerary',
    back: 'Back',

    // Itinerary
    tripSummary: 'Trip Summary',
    destinationCityLabel: 'Destination City:',
    startDateLabel: 'Start Date:',
    endDateLabel: 'End Date:',
    numberOfPeopleLabel: 'Number of People:',
    generatePDF: 'Generate PDF',
    saveTrip: 'Save Trip',
    regenerate: 'Regenerate Plan',
    backToPlanner: 'Back to Planner',
    openInMaps: 'Open in Maps',
    generating: 'Generating your itinerary...',
    generatingDesc:
      'AI is crafting your perfect trip. This may take a few moments.',
    saving: 'Saving...',
    tripSaved: 'Trip saved successfully!',
    day: 'Day',

    // Map
    mapTitle: 'Trip Map Visualization',
    allAttractions: 'All Attractions',
    legend: 'Legend',
    attractions: 'Attractions',
    filterByDay: 'Filter by Day',
    noTripData: 'No trip data. Generate an itinerary first.',

    // Profile
    myProfile: 'My Profile',
    savedTrips: 'Saved Trips',
    updateProfile: 'Update Profile',
    noTripsYet: 'No saved trips yet.',
    startFirstTrip: 'Start Planning Your First Trip',
    viewItinerary: 'View Itinerary',
    deleteTrip: 'Delete',
    profileUpdated: 'Profile updated!',

    // Admin
    systemOverview: 'System Overview',
    activeTrips: 'Active Trips',
    aiAccuracy: 'AI Accuracy',
    newSignups: 'New Signups',
    totalRevenue: 'Total Revenue',
    analyticsTitle: 'Analytics — Trips Generated',
    recentActivity: 'Recent Activity',
    users: 'Users',
    name: 'Name',
    email: 'Email',
    trips_count: 'Trips',
    status: 'Status',
    active: 'Active',
    premium: 'Premium',
    inactive: 'Inactive',
  },

  ar: {
    // Nav
    home: 'الرئيسية',
    tripPlanner: 'تخطيط الرحلة',
    itinerary: 'جدول الرحلة',
    map: 'الخريطة',
    profile: 'الملف الشخصي',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    arabic: 'عربي',
    english: 'English',

    // Hero
    heroTag: '⚡ تخطيط سياحي بالذكاء الاصطناعي',
    heroTitle:
      'خطط لرحلتك المثالية في المملكة العربية السعودية بالذكاء الاصطناعي',
    heroBrand: 'Shawaf — شواف',
    heroSub:
      'استمتع بتخطيط سفر ذكي ومخصص بأحدث تقنيات الذكاء الاصطناعي. أنشئ جداول رحلات يومية تناسب تفضيلاتك وميزانيتك في المملكة العربية السعودية.',
    startPlanning: 'ابدأ تخطيط رحلتك',
    learnMore: 'اعرف المزيد',
    rating: '4.9',
    ratingLabel: 'تقييم المستخدمين',
    cities: '+30',
    citiesLabel: 'مدينة مشمولة',
    travelers: '+12K',
    travelersLabel: 'مسافر سعيد',
    trips: '+50K',
    tripsLabel: 'رحلة مُولَّدة',

    // Features
    whyChoose: 'لماذا تختار شواف؟',
    feat1Title: 'تخطيط بالذكاء الاصطناعي',
    feat1Desc:
      'يولّد الذكاء الاصطناعي خططًا مخصصة بناءً على تفضيلاتك وأسلوب رحلتك وميزانيتك.',
    feat2Title: 'خرائط تفاعلية',
    feat2Desc:
      'اعرض رحلتك على خريطة تفاعلية توضّح المعالم ومحطات الرحلة بسهولة.',
    feat3Title: 'جدولة ذكية',
    feat3Desc:
      'يساعدك شواف على ترتيب جدولك بناءً على أوقات الفتح ومدة الزيارة وأولوية الأماكن.',
    feat4Title: 'تصدير PDF',
    feat4Desc:
      'حمّل خطة رحلتك كملف PDF منسق للاحتفاظ بها واستخدامها لاحقًا.',
    feat5Title: 'رحلات متعددة المدن',
    feat5Desc:
      'خطط لرحلات تشمل أكثر من مدينة داخل المملكة مع ترتيب منطقي بين المدن.',
    feat6Title: 'متاح دائمًا',
    feat6Desc:
      'خطط لرحلتك في أي وقت ومن أي مكان بدون انتظار أو مواعيد.',

    // How it works
    howItWorks: 'كيف يعمل شواف؟',
    step1: 'إنشاء الحساب',
    step1Desc: 'أنشئ حسابك وابدأ بإدخال معلومات رحلتك.',
    step2: 'تحديد تفاصيل الرحلة',
    step2Desc:
      'اختر المدن، التواريخ، الميزانية، ومستوى النشاط المناسب لك.',
    step3: 'توليد جدول الرحلة',
    step3Desc:
      'يقوم الذكاء الاصطناعي بتوليد جدول يومي مناسب لتفضيلاتك.',
    step4: 'استكشف واستمتع',
    step4Desc:
      'استخدم الخريطة، عدّل الخطة، واحفظ جدول رحلتك بسهولة.',

    // Testimonials
    travelers_say: 'ماذا يقول المسافرون؟',
    t1:
      '"خطط شواف رحلتي في الرياض بشكل رائع، وكانت الخطة مناسبة جدًا لتفضيلاتي."',
    t1Name: 'خالد المنصور',
    t1City: 'الرياض',
    t2:
      '"ميزة الخريطة التفاعلية ممتازة. استطعت رؤية جميع محطات الرحلة بسهولة."',
    t2Name: 'سارة العتيبي',
    t2City: 'جدة',
    t3:
      '"أنشأ شواف جدول رحلة كامل للعلا خلال ثوانٍ ووفّر علي وقت البحث."',
    t3Name: 'محمد بن ناصر',
    t3City: 'العلا',

    // CTA
    ctaTitle: 'جاهز لاستكشاف المملكة؟',
    ctaSub: 'انضم إلى المسافرين الذين يخططون بذكاء مع شواف.',
    ctaBtn: 'ابدأ تخطيط رحلتك',

    // Footer
    footerDesc:
      'منصة تخطيط رحلات سياحية داخل المملكة العربية السعودية بالذكاء الاصطناعي، بما يتماشى مع رؤية 2030.',
    vision2030: '✦ متوافق مع رؤية 2030',
    quickLinks: 'روابط سريعة',
    account: 'الحساب',
    contactUs: 'تواصل معنا',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',

    // Auth
    signInTitle: 'تسجيل الدخول',
    signUpTitle: 'إنشاء حساب',
    emailAddress: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب بالفعل؟',
    fullName: 'الاسم الكامل',

    // Planner
    planNewTrip: 'خطط لرحلة جديدة',
    step1Label: 'تفاصيل الرحلة',
    step2Label: 'التفضيلات',
    step3Label: 'الخطة',
    step1Sub: 'الخطوة 1 من 3: معلومات الرحلة الأساسية',
    step2Sub: 'الخطوة 2 من 3: تفضيلات الرحلة',
    destinationCity: 'مدينة الوجهة',
    searchCity: 'ابحث عن مدينة...',
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    numberOfPeople: 'عدد الأشخاص',
    tripType: 'نوع الرحلة',
    configureTrip: 'متابعة إعداد الرحلة',
    tripDayCount: (n) => `📅 رحلة لمدة ${n} ${n === 1 ? 'يوم' : 'أيام'}`,

    cultural: 'ثقافية وتراثية',
    adventure: 'مغامرة وطبيعة',
    relaxation: 'استرخاء وترفيه',
    religious: 'دينية وروحانية',
    business: 'أعمال وسياحة',
    family: 'رحلة عائلية',

    budgetRange: 'نطاق الميزانية',
    budget: 'اقتصادي',
    midRange: 'متوسط',
    luxury: 'فاخر',
    activityLevel: 'مستوى النشاط',
    low: 'خفيف',
    moderate: 'متوسط',
    high: 'مكثف',
    activityTypes: 'أنواع الأنشطة',
    selectAllInterest: 'اختر كل ما يهمك',
    sightseeing: 'معالم سياحية',
    localDining: 'مطاعم محلية',
    shopping: 'تسوق',
    museums: 'متاحف',
    natureParks: 'طبيعة وحدائق',
    sportsAdventure: 'رياضة ومغامرة',
    entertainment: 'ترفيه',
    photography: 'أماكن تصوير',
    additionalNotes: 'ملاحظات إضافية',
    notesPlaceholder: 'أي متطلبات أو تفضيلات خاصة...',
    generateItinerary: 'توليد جدول الرحلة',
    back: 'رجوع',

    // Itinerary
    tripSummary: 'ملخص الرحلة',
    destinationCityLabel: 'مدينة الوجهة:',
    startDateLabel: 'تاريخ البداية:',
    endDateLabel: 'تاريخ النهاية:',
    numberOfPeopleLabel: 'عدد الأشخاص:',
    generatePDF: 'تحميل PDF',
    saveTrip: 'حفظ الرحلة',
    regenerate: 'إعادة توليد الخطة',
    backToPlanner: 'العودة للمخطط',
    openInMaps: 'فتح في الخرائط',
    generating: 'جارٍ توليد جدول الرحلة...',
    generatingDesc:
      'يقوم الذكاء الاصطناعي بإعداد رحلة مناسبة لك. قد يستغرق ذلك لحظات.',
    saving: 'جارٍ الحفظ...',
    tripSaved: 'تم حفظ الرحلة بنجاح!',
    day: 'اليوم',

    // Map
    mapTitle: 'خريطة الرحلة',
    allAttractions: 'جميع المعالم',
    legend: 'المفتاح',
    attractions: 'معالم',
    filterByDay: 'تصفية حسب اليوم',
    noTripData: 'لا توجد بيانات رحلة. أنشئ جدول رحلة أولًا.',

    // Profile
    myProfile: 'ملفي الشخصي',
    savedTrips: 'الرحلات المحفوظة',
    updateProfile: 'تحديث الملف الشخصي',
    noTripsYet: 'لا توجد رحلات محفوظة بعد.',
    startFirstTrip: 'ابدأ تخطيط أول رحلة',
    viewItinerary: 'عرض الجدول',
    deleteTrip: 'حذف',
    profileUpdated: 'تم تحديث الملف الشخصي!',

    // Admin
    systemOverview: 'نظرة عامة على النظام',
    activeTrips: 'الرحلات النشطة',
    aiAccuracy: 'دقة الذكاء الاصطناعي',
    newSignups: 'تسجيلات جديدة',
    totalRevenue: 'إجمالي الإيرادات',
    analyticsTitle: 'التحليلات — الرحلات المُولَّدة',
    recentActivity: 'النشاط الأخير',
    users: 'المستخدمون',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    trips_count: 'الرحلات',
    status: 'الحالة',
    active: 'نشط',
    premium: 'مميز',
    inactive: 'غير نشط',
  },
}

const LanguageContext = createContext({})

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const toggle = () => {
    setLang((current) => (current === 'en' ? 'ar' : 'en'))
  }

  const t = (key, ...args) => {
    const val = translations[lang]?.[key] ?? translations.en[key]

    if (typeof val === 'function') return val(...args)

    return val ?? key
  }

  const isRTL = lang === 'ar'

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
```

---

## `components/ProtectedRoute.jsx`

```jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const { lang } = useLang()

  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'تسجيل الدخول مطلوب' : 'Sign In Required',
    message: isArabic
      ? 'يجب تسجيل الدخول للوصول إلى هذه الصفحة.'
      : 'You need to sign in to access this page.',
    signIn: isArabic ? 'تسجيل الدخول' : 'Sign In',
    backHome: isArabic ? 'العودة للرئيسية' : 'Back to Home',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#F5F5F0]">
        <div className="card p-6 sm:p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">🔐</div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#333333] mb-2" dir="auto">
            {text.title}
          </h1>

          <p className="text-stone-500 text-sm sm:text-base mb-5 leading-relaxed" dir="auto">
            {text.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signin" className="btn-primary justify-center">
              {text.signIn}
            </Link>

            <Link to="/" className="btn-outline justify-center">
              {text.backHome}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
```

---

## `components/AdminRoute.jsx`

```jsx
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
```

---

## `components/Navbar.jsx`

```jsx
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 shrink-0 min-w-fit"
      aria-label="Go to home"
    >
      <img
        src="/brand/shawaf-logo.png"
        alt="Shawaf logo"
        className="w-11 h-11 object-contain shrink-0"
      />

      <div className="leading-none shrink-0">
        <div className="font-bold text-[#333333] text-base sm:text-lg leading-none whitespace-nowrap">
          Shawaf
        </div>
        <div className="text-xs text-stone-500 leading-none whitespace-nowrap mt-1">
          شواف
        </div>
      </div>
    </Link>
  )
}

export default function Navbar() {
  const { user, profile, signOut, isAdmin, loading } = useAuth()
  const { t, toggle, lang } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdminArea = location.pathname.startsWith('/admin')

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const adminLinks = [
    { path: '/admin', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard' },
    { path: '/admin/attractions', label: lang === 'ar' ? 'إدارة المعالم' : 'Attractions' },
    { path: '/admin/reports', label: lang === 'ar' ? 'بلاغات المستخدمين' : 'Reports' },
    { path: '/admin/analytics', label: lang === 'ar' ? 'الإحصائيات' : 'Analytics' },
  ]

  const userLinks = [
    { path: '/', label: t('home') },
    { path: '/planner', label: t('tripPlanner') },
    { path: '/itinerary', label: t('itinerary') },
    { path: '/map', label: t('map') },
    { path: '/profile', label: t('profile') },
  ]

  const navLinks = user
    ? isAdmin || isAdminArea
      ? adminLinks
      : userLinks
    : [{ path: '/', label: t('home') }]

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    ''

  const handleSignOut = async () => {
    await signOut()
    setMobileOpen(false)
    navigate('/')
  }

  const handleNavigate = () => {
    setMobileOpen(false)
  }

  return (
    <nav className="bg-white border-b border-[#DDD8C8] sticky top-0 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Logo />

        <div className="hidden lg:flex items-center gap-1">
          {!loading &&
            navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(path)
                    ? 'bg-[#006A4E] text-white'
                    : 'text-stone-600 hover:text-[#006A4E] hover:bg-[#E6F2EE]'
                }`}
              >
                {label}
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 hover:text-[#006A4E] transition-colors shrink-0"
            type="button"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
              />
            </svg>

            <span className="whitespace-nowrap">
              {lang === 'en' ? 'عربي' : 'English'}
            </span>
          </button>

          {loading ? (
            <div className="w-8 h-8 rounded-full border-2 border-[#006A4E] border-t-transparent animate-spin" />
          ) : user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-[#E6F2EE] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 hover:border-[#006A4E] transition-colors"
                title={t('profile')}
                aria-label={t('profile')}
              >
                <svg
                  className="w-5 h-5 text-[#006A4E]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </Link>

              <div className="hidden md:flex flex-col leading-tight max-w-[140px]">
                <Link
                  to="/profile"
                  className="text-sm font-medium text-stone-700 hover:text-[#006A4E] truncate"
                  dir="auto"
                >
                  {displayName}
                </Link>

                {isAdmin && (
                  <span className="text-xs font-semibold text-[#D4AF37]">
                    {lang === 'ar' ? 'أدمن' : 'Admin'}
                  </span>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 text-stone-500 hover:text-[#006A4E] transition-colors"
                title={t('signOut')}
                type="button"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/signin"
                className="text-sm font-medium text-stone-600 hover:text-[#006A4E] transition-colors whitespace-nowrap"
              >
                {t('signIn')}
              </Link>

              <Link
                to="/signup"
                className="btn-primary text-sm py-2 px-4 whitespace-nowrap"
              >
                {t('signUp')}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden w-9 h-9 rounded-xl border border-[#DDD8C8] text-[#333333] hover:text-[#006A4E] hover:border-[#D4AF37] flex items-center justify-center transition-colors shrink-0"
            aria-label={lang === 'ar' ? 'فتح القائمة' : 'Open menu'}
          >
            {mobileOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#DDD8C8] bg-white">
          <div className="px-3 py-3 space-y-2">
            {!loading &&
              navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={handleNavigate}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-[#006A4E] text-white'
                      : 'text-stone-600 hover:text-[#006A4E] hover:bg-[#E6F2EE]'
                  }`}
                  dir="auto"
                >
                  {label}
                </Link>
              ))}

            <div className="pt-2 border-t border-[#DDD8C8]">
              {user ? (
                <div className="space-y-3">
                  <Link
                    to="/profile"
                    onClick={handleNavigate}
                    className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#E6F2EE] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E6F2EE] border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-[#006A4E]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <div
                        className="text-sm font-medium text-[#333333] truncate"
                        dir="auto"
                      >
                        {displayName}
                      </div>

                      {isAdmin && (
                        <div className="text-xs font-semibold text-[#D4AF37]">
                          {lang === 'ar' ? 'أدمن' : 'Admin'}
                        </div>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-start px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    type="button"
                  >
                    {t('signOut')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    to="/signin"
                    onClick={handleNavigate}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:text-[#006A4E] hover:bg-[#E6F2EE] transition-colors"
                  >
                    {t('signIn')}
                  </Link>

                  <Link
                    to="/signup"
                    onClick={handleNavigate}
                    className="btn-primary justify-center text-sm py-3"
                  >
                    {t('signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
```

---

## `components/Footer.jsx`

```jsx
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

function Logo() {
  return (
    <div className="flex items-center gap-2.5 shrink-0 min-w-fit">
      <img
        src="/brand/shawaf-logo.png"
        alt="Shawaf logo"
        className="w-10 h-10 object-contain shrink-0"
      />

      <div className="leading-none shrink-0">
        <div className="font-bold text-[#333333] text-base leading-none whitespace-nowrap">
          Shawaf
        </div>
        <div className="text-xs text-stone-500 leading-none whitespace-nowrap mt-1">
          شواف
        </div>
      </div>
    </div>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="hover:text-[#006A4E] transition-colors"
      dir="auto"
    >
      {children}
    </Link>
  )
}

function ContactIcon({ children }) {
  return (
    <span className="w-7 h-7 bg-[#E6F2EE] border border-[#D4AF37]/30 rounded-lg flex items-center justify-center shrink-0 text-[#006A4E]">
      {children}
    </span>
  )
}

export default function Footer() {
  const { t, isRTL } = useLang()

  const text = {
    reportIssue: isRTL ? 'هل تواجه مشكلة؟' : 'Report an Issue',
    resetPassword: isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password',
    location: isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
  }

  return (
    <footer className="bg-white border-t border-[#DDD8C8] mt-14 sm:mt-20 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="min-w-0">
            <Logo />

            <p
              className="mt-4 text-sm text-stone-500 leading-relaxed max-w-sm"
              dir="auto"
            >
              {t('footerDesc')}
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm text-[#006A4E]">
              <ContactIcon>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                  />
                </svg>
              </ContactIcon>

              <span dir="auto">{t('vision2030')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('quickLinks')}
            </h3>

            <ul className="space-y-2 text-sm text-stone-500">
              <li>
                <FooterLink to="/">{t('home')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/planner">{t('tripPlanner')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/itinerary">{t('itinerary')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/map">{t('map')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/report-issue">{text.reportIssue}</FooterLink>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('account')}
            </h3>

            <ul className="space-y-2 text-sm text-stone-500">
              <li>
                <FooterLink to="/signup">{t('signUp')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/signin">{t('signIn')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/profile">{t('profile')}</FooterLink>
              </li>

              <li>
                <FooterLink to="/reset-password">{text.resetPassword}</FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('contactUs')}
            </h3>

            <ul className="space-y-3 text-sm text-stone-500">
              <li className="flex items-center gap-2 min-w-0">
                <ContactIcon>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </ContactIcon>

                <span className="truncate" dir="ltr">
                  info@shawaf.sa
                </span>
              </li>

              <li className="flex items-center gap-2 min-w-0">
                <ContactIcon>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </ContactIcon>

                <span dir="ltr">+966 11 123 4567</span>
              </li>

              <li className="flex items-center gap-2 min-w-0">
                <ContactIcon>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </ContactIcon>

                <span className="min-w-0" dir="auto">
                  {text.location}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#DDD8C8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <span className="text-center sm:text-start" dir="auto">
            © 2026 Shawaf — شواف
          </span>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <FooterLink to="#">{t('privacy')}</FooterLink>
            <FooterLink to="#">{t('terms')}</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

---

## `components/StepIndicator.jsx`

```jsx
import { useLang } from '../context/LanguageContext'

export default function StepIndicator({ currentStep }) {
  const { t } = useLang()

  const steps = [
    { num: 1, label: t('step1Label') },
    { num: 2, label: t('step2Label') },
    { num: 3, label: t('step3Label') },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-1 sm:px-4">
      <div className="flex items-start justify-between gap-1 sm:gap-3">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-start flex-1 min-w-0">
            <div className="flex flex-col items-center min-w-0 flex-shrink-0">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  step.num === currentStep || step.num < currentStep
                    ? 'bg-[#006A4E] border-[#006A4E] text-white'
                    : 'bg-white border-stone-300 text-stone-400'
                }`}
              >
                {step.num}
              </div>

              <span
                className={`mt-1.5 text-[11px] sm:text-xs font-medium text-center leading-tight max-w-[82px] sm:max-w-none ${
                  step.num === currentStep
                    ? 'text-[#006A4E]'
                    : step.num < currentStep
                    ? 'text-stone-600'
                    : 'text-stone-400'
                }`}
                dir="auto"
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 sm:mx-3 mt-[18px] rounded-full ${
                  step.num < currentStep ? 'bg-[#006A4E]' : 'bg-stone-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 
```

---

## `components/SelectionCard.jsx`

```jsx
export default function SelectionCard({
  emoji,
  label,
  selected,
  onClick,
  wide = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-w-0 flex items-center justify-center rounded-xl border-2 transition-all text-xs sm:text-sm font-medium cursor-pointer text-center
        ${wide ? 'flex-row gap-3 px-3 py-4' : 'flex-col gap-2 px-2.5 sm:px-3 py-4'}
        ${
          selected
            ? 'border-[#006A4E] bg-[#E6F2EE] text-[#006A4E] shadow-sm'
            : 'border-stone-200 bg-white text-stone-700 hover:border-[#D4AF37] hover:bg-[#FBF6E3]'
        }`}
    >
      <span className="text-xl leading-none shrink-0">{emoji}</span>

      <span
        className={`leading-snug min-w-0 ${
          selected ? 'text-[#006A4E]' : 'text-stone-700'
        }`}
        dir="auto"
      >
        {label}
      </span>
    </button>
  )
}
```

---

## `pages/Home.jsx`

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

function HeroSection() {
  const { t, isRTL } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()

  const arrow = isRTL ? '←' : '→'

  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 18% 25%, rgba(212, 175, 55, 0.24), transparent 32%), radial-gradient(circle at 82% 30%, rgba(255, 255, 255, 0.10), transparent 34%), linear-gradient(135deg, #002F24 0%, #006A4E 48%, #0B3B2F 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.28) 0%, transparent 42%), radial-gradient(circle at 80% 20%, rgba(245, 245, 240, 0.14) 0%, transparent 38%), linear-gradient(120deg, rgba(0, 47, 36, 0.45), rgba(0, 106, 78, 0.05))',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(45deg, rgba(255,255,255,0.35) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.35) 25%, transparent 25%)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-sm px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          {t('heroTag')}
        </div>

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
          style={{
            fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif',
          }}
          dir="auto"
        >
          {t('heroTitle')}
        </h1>

        <p className="text-[#D4AF37] text-xl font-semibold mb-6" dir="auto">
          {t('heroBrand')}
        </p>

        <p
          className="text-[#F5F5F0]/85 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          dir="auto"
        >
          {t('heroSub')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate(user ? '/planner' : '/signup')}
            className="bg-[#D4AF37] hover:bg-[#B89122] text-[#333333] font-semibold px-7 py-3.5 rounded-full transition-all shadow-lg hover:shadow-[#D4AF37]/30 flex items-center gap-2"
          >
            {t('startPlanning')} <span>{arrow}</span>
          </button>

          <button
            onClick={() =>
              document
                .getElementById('features')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="border border-[#F5F5F0]/40 hover:border-[#D4AF37] text-[#F5F5F0] hover:text-[#D4AF37] font-medium px-7 py-3.5 rounded-full transition-all backdrop-blur-sm"
          >
            {t('learnMore')}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { val: t('rating'), label: t('ratingLabel') },
            { val: t('cities'), label: t('citiesLabel') },
            { val: t('travelers'), label: t('travelersLabel') },
            { val: t('trips'), label: t('tripsLabel') },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border border-[#D4AF37]/25 rounded-2xl p-4"
            >
              <div className="text-2xl font-bold text-white" dir="auto">
                {stat.val}
              </div>
              <div className="text-xs text-[#F5F5F0]/65 mt-1" dir="auto">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const { t } = useLang()

  const features = [
    { icon: '⚡', title: t('feat1Title'), desc: t('feat1Desc') },
    { icon: '🗺️', title: t('feat2Title'), desc: t('feat2Desc') },
    { icon: '🕐', title: t('feat3Title'), desc: t('feat3Desc') },
    { icon: '📄', title: t('feat4Title'), desc: t('feat4Desc') },
    { icon: '✈️', title: t('feat5Title'), desc: t('feat5Desc') },
    { icon: '🎧', title: t('feat6Title'), desc: t('feat6Desc') },
  ]

  return (
    <section id="features" className="py-20 px-6 bg-[#F5F5F0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">{t('whyChoose')}</h2>
        <div className="section-divider" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#E6F2EE] border border-[#D4AF37]/30 rounded-xl flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>

              <h3 className="font-semibold text-[#333333] text-lg mb-2" dir="auto">
                {f.title}
              </h3>

              <p className="text-stone-500 text-sm leading-relaxed" dir="auto">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const { t, isRTL } = useLang()
  const { user } = useAuth()

  const steps = [
    { num: 1, title: t('step1'), desc: t('step1Desc') },
    { num: 2, title: t('step2'), desc: t('step2Desc') },
    { num: 3, title: t('step3'), desc: t('step3Desc') },
    { num: 4, title: t('step4'), desc: t('step4Desc') },
  ]

  const displayedSteps = isRTL ? [...steps].reverse() : steps

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">{t('howItWorks')}</h2>
        <div className="section-divider" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {displayedSteps.map((step, i) => (
            <div
              key={step.num}
              className="flex flex-col items-center text-center relative"
            >
              {i < displayedSteps.length - 1 && (
                <div className="hidden lg:block absolute top-6 start-[calc(50%+28px)] w-full h-0.5 bg-[#DDD8C8] z-0" />
              )}

              <div className="w-14 h-14 bg-[#006A4E] border border-[#D4AF37]/40 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg relative z-10 mb-4">
                {step.num}
              </div>

              <h3 className="font-semibold text-[#333333] mb-2" dir="auto">
                {step.title}
              </h3>

              <p className="text-sm text-stone-500 leading-relaxed" dir="auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to={user ? '/planner' : '/signup'} className="btn-primary">
            {t('ctaBtn')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const { t } = useLang()

  const testimonials = [
    { quote: t('t1'), name: t('t1Name'), city: t('t1City') },
    { quote: t('t2'), name: t('t2Name'), city: t('t2City') },
    { quote: t('t3'), name: t('t3Name'), city: t('t3City') },
  ]

  return (
    <section className="py-20 px-6 bg-[#F5F5F0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">{t('travelers_say')}</h2>
        <div className="section-divider" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="card p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < 4 ? 'text-[#D4AF37]' : 'text-[#D4AF37]/50'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p
                className="text-stone-600 text-sm leading-relaxed mb-5 italic"
                dir="auto"
              >
                {testimonial.quote}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#E6F2EE] border border-[#D4AF37]/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#006A4E]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>

                <div>
                  <div className="font-semibold text-[#333333] text-sm" dir="auto">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-stone-400" dir="auto">
                    {testimonial.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTABannerSection() {
  const { t, isRTL } = useLang()
  const { user } = useAuth()

  const arrow = isRTL ? '←' : '→'

  return (
    <section className="py-6 px-6 bg-[#F5F5F0]">
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-3xl px-8 py-14 text-center text-white border border-[#D4AF37]/35 shadow-xl overflow-hidden relative"
          style={{
            background:
              'radial-gradient(circle at 18% 25%, rgba(212, 175, 55, 0.22), transparent 34%), linear-gradient(135deg, #003B2D 0%, #006A4E 55%, #002F24 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                'linear-gradient(45deg, rgba(245,245,240,0.45) 25%, transparent 25%), linear-gradient(-45deg, rgba(245,245,240,0.45) 25%, transparent 25%)',
              backgroundSize: '70px 70px',
            }}
          />

          <div className="relative z-10">
            <div className="text-5xl mb-6">🏅</div>

            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{
                fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif',
              }}
              dir="auto"
            >
              {t('ctaTitle')}
            </h2>

            <p className="text-[#F5F5F0]/80 mb-8 text-base" dir="auto">
              {t('ctaSub')}
            </p>

            <Link
              to={user ? '/planner' : '/signup'}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B89122] text-[#333333] font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg"
            >
              {t('ctaBtn')} <span>{arrow}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTABannerSection />
    </>
  )
} 
```

---

## `pages/SignIn.jsx`

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function SignIn() {
  const { signIn } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const isArabic = lang === 'ar'
  const logoSrc = '/brand/shawaf-logo.png'

  const text = {
    subtitle: isArabic
      ? 'سجّل الدخول للمتابعة إلى شواف.'
      : 'Sign in to continue to Shawaf.',
    signInFailed: isArabic ? 'فشل تسجيل الدخول.' : 'Sign in failed',
    signingIn: isArabic ? 'جاري تسجيل الدخول...' : 'Signing in...',
    emailPlaceholder: isArabic ? 'example@email.com' : 'you@example.com',
    passwordPlaceholder: '••••••••',
    showPassword: isArabic ? 'إظهار كلمة المرور' : 'Show password',
    hidePassword: isArabic ? 'إخفاء كلمة المرور' : 'Hide password',
    arrow: isArabic ? '←' : '→',
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await signIn({ email, password })
      const currentUser = data?.user || data?.data?.user

      if (currentUser) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single()

        if (!profileError && profile?.role === 'admin') {
          navigate('/admin')
          return
        }
      }

      navigate('/planner')
    } catch (err) {
      setError(err.message || text.signInFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center px-4 py-10 sm:py-12 overflow-hidden">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-24 h-24 rounded-3xl bg-white/80 border border-[#D4AF37]/40 flex items-center justify-center shadow-lg mb-3 overflow-hidden">
          <img
            src={logoSrc}
            alt="Shawaf Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#333333] whitespace-nowrap">
          Shawaf
        </h1>
        <p className="text-stone-500 text-sm">شواف</p>
      </div>

      <div className="card w-full max-w-md p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#006A4E] text-xl">{text.arrow}</span>

          <h2 className="text-xl sm:text-2xl font-bold text-[#333333]" dir="auto">
            {t('signInTitle')}
          </h2>
        </div>

        <p className="text-stone-500 text-sm sm:text-base mb-6 leading-relaxed" dir="auto">
          {text.subtitle}
        </p>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {t('emailAddress')}
            </label>

            <input
              type="email"
              className="input-field"
              placeholder={text.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <div>
            <div className="flex flex-col xs:flex-row sm:flex-row sm:justify-between sm:items-center gap-1 mb-1.5">
              <label className="text-sm font-medium text-[#333333]" dir="auto">
                {t('password')}
              </label>

              <Link
                to="/reset-password"
                className="text-sm text-[#006A4E] hover:text-[#004D39] font-medium"
                dir="auto"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field pe-10"
                placeholder={text.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#006A4E]"
                aria-label={showPassword ? text.hidePassword : text.showPassword}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 01112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-[#006A4E]"
            />

            <label htmlFor="remember" className="text-sm text-stone-600" dir="auto">
              {t('rememberMe')}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3.5 rounded-xl text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2" dir="auto">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {text.signingIn}
              </span>
            ) : (
              <span dir="auto">
                {t('signIn')} {text.arrow}
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6" dir="auto">
          {t('noAccount')}{' '}
          <Link
            to="/signup"
            className="text-[#006A4E] font-semibold hover:text-[#004D39]"
          >
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## `pages/SignUp.jsx`

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function SignUp() {
  const { signUp, signIn } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const isArabic = lang === 'ar'
  const logoSrc = '/brand/shawaf-logo.png'

  const text = {
    subtitle: isArabic
      ? 'أنشئ حسابك وابدأ تخطيط رحلتك مع شواف.'
      : 'Create your account and start planning your trip with Shawaf.',
    fullNamePlaceholder: isArabic ? 'الاسم الكامل' : 'Ahmed Al-Rashid',
    emailPlaceholder: isArabic ? 'example@email.com' : 'you@example.com',
    passwordPlaceholder: '••••••••',
    showPassword: isArabic ? 'إظهار كلمة المرور' : 'Show password',
    hidePassword: isArabic ? 'إخفاء كلمة المرور' : 'Hide password',
    creating: isArabic ? 'جاري إنشاء الحساب...' : 'Creating account...',
    success: isArabic
      ? 'تم إنشاء الحساب بنجاح. يتم تحويلك الآن...'
      : 'Account created successfully. Redirecting...',
    signUpFailed: isArabic
      ? 'فشل إنشاء الحساب. إذا كان تأكيد البريد مفعّلًا في Supabase، عطّله للسماح بتسجيل الدخول مباشرة.'
      : 'Sign up failed. If email confirmation is enabled in Supabase, disable it to allow instant login.',
    arrow: isArabic ? '←' : '→',
  }

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signUp({ email, password, fullName })

      if (result?.session || result?.data?.session) {
        setSuccess(true)
        navigate('/planner')
        return
      }

      if (signIn) {
        await signIn({ email, password })
        setSuccess(true)
        navigate('/planner')
        return
      }

      setSuccess(true)
      navigate('/planner')
    } catch (err) {
      setError(err?.message || text.signUpFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center px-4 py-10 sm:py-12 overflow-hidden">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-24 h-24 rounded-3xl bg-white/80 border border-[#D4AF37]/40 flex items-center justify-center shadow-lg mb-3 overflow-hidden">
          <img
            src={logoSrc}
            alt="Shawaf Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#333333] whitespace-nowrap">
          Shawaf
        </h1>
        <p className="text-stone-500 text-sm">شواف</p>
      </div>

      <div className="card w-full max-w-md p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#D4AF37] text-xl"></span>

          <h2 className="text-xl sm:text-2xl font-bold text-[#333333]" dir="auto">
            {t('signUpTitle')}
          </h2>
        </div>

        <p className="text-stone-500 text-sm sm:text-base mb-6 leading-relaxed" dir="auto">
          {text.subtitle}
        </p>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="bg-[#E6F2EE] border border-[#006A4E]/20 text-[#006A4E] px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {text.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {t('fullName')}
            </label>

            <input
              type="text"
              className="input-field"
              placeholder={text.fullNamePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {t('emailAddress')}
            </label>

            <input
              type="email"
              className="input-field"
              placeholder={text.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {t('password')}
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field pe-10"
                placeholder={text.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                dir="ltr"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#006A4E]"
                aria-label={showPassword ? text.hidePassword : text.showPassword}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full btn-primary justify-center py-3.5 rounded-xl text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2" dir="auto">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {text.creating}
              </span>
            ) : (
              <span dir="auto">
                {t('signUp')} {text.arrow}
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6" dir="auto">
          {t('haveAccount')}{' '}
          <Link
            to="/signin"
            className="text-[#006A4E] font-semibold hover:text-[#004D39]"
          >
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## `pages/ResetPassword.jsx`

```jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

export default function ResetPassword() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'
  const logoSrc = '/brand/shawaf-logo.png'

  const text = {
    title: isArabic ? 'إعادة تعيين كلمة المرور' : 'Reset Password',
    subtitle: isArabic
      ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.'
      : 'Enter your email and we will send you a password reset link.',
    email: isArabic ? 'البريد الإلكتروني' : 'Email Address',
    emailPlaceholder: isArabic ? 'example@email.com' : 'you@example.com',
    sendLink: isArabic ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link',
    sending: isArabic ? 'جاري الإرسال...' : 'Sending...',
    success: isArabic
      ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
      : 'Password reset link has been sent to your email.',
    failed: isArabic
      ? 'فشل إرسال رابط إعادة تعيين كلمة المرور.'
      : 'Failed to send reset password email.',
    backToSignIn: isArabic ? 'العودة لتسجيل الدخول' : 'Back to Sign In',
  }

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const redirectTo = `${window.location.origin}/update-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) throw error

      setMessage(text.success)
    } catch (err) {
      setError(err.message || text.failed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center px-4 py-10 sm:py-12 overflow-hidden">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-24 h-24 rounded-3xl bg-white/80 border border-[#D4AF37]/40 flex items-center justify-center shadow-lg mb-3 overflow-hidden">
          <img
            src={logoSrc}
            alt="Shawaf Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#333333] whitespace-nowrap">
          Shawaf
        </h1>
        <p className="text-stone-500 text-sm">شواف</p>
      </div>

      <div className="card w-full max-w-md p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#006A4E] text-xl">↺</span>

          <h2 className="text-xl sm:text-2xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h2>
        </div>

        <p className="text-stone-500 text-sm sm:text-base mb-6 leading-relaxed" dir="auto">
          {text.subtitle}
        </p>

        {message && (
          <div
            className="bg-[#E6F2EE] border border-[#006A4E]/20 text-[#006A4E] px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {text.email}
            </label>

            <input
              type="email"
              className="input-field"
              placeholder={text.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3.5 rounded-xl text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2" dir="auto">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {text.sending}
              </span>
            ) : (
              text.sendLink
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6" dir="auto">
          <Link
            to="/signin"
            className="text-[#006A4E] font-semibold hover:text-[#004D39]"
          >
            {text.backToSignIn}
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## `pages/UpdatePassword.jsx`

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

export default function UpdatePassword() {
  const { lang } = useLang()
  const navigate = useNavigate()

  const isArabic = lang === 'ar'
  const logoSrc = '/brand/shawaf-logo.png'

  const text = {
    title: isArabic ? 'تحديث كلمة المرور' : 'Update Password',
    subtitle: isArabic
      ? 'أدخل كلمة المرور الجديدة لحسابك.'
      : 'Enter your new password for your account.',
    newPassword: isArabic ? 'كلمة المرور الجديدة' : 'New Password',
    confirmPassword: isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password',
    passwordPlaceholder: '••••••••',
    updatePassword: isArabic ? 'تحديث كلمة المرور' : 'Update Password',
    updating: isArabic ? 'جاري التحديث...' : 'Updating...',
    success: isArabic
      ? 'تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.'
      : 'Password updated successfully. You can sign in now.',
    failed: isArabic
      ? 'فشل تحديث كلمة المرور.'
      : 'Failed to update password.',
    passwordRequired: isArabic
      ? 'أدخل كلمة المرور الجديدة.'
      : 'Please enter a new password.',
    passwordShort: isArabic
      ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.'
      : 'Password must be at least 6 characters.',
    passwordMismatch: isArabic
      ? 'كلمتا المرور غير متطابقتين.'
      : 'Passwords do not match.',
    backToSignIn: isArabic ? 'العودة لتسجيل الدخول' : 'Back to Sign In',
    showPassword: isArabic ? 'إظهار كلمة المرور' : 'Show password',
    hidePassword: isArabic ? 'إخفاء كلمة المرور' : 'Hide password',
  }

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const validate = () => {
    if (!password.trim()) return text.passwordRequired
    if (password.length < 6) return text.passwordShort
    if (password !== confirmPassword) return text.passwordMismatch
    return ''
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const validationError = validate()

      if (validationError) {
        throw new Error(validationError)
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setMessage(text.success)
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/signin')
      }, 1500)
    } catch (err) {
      setError(err.message || text.failed)
    } finally {
      setLoading(false)
    }
  }

  const PasswordToggleIcon = ({ visible }) =>
    visible ? (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    ) : (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    )

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center px-4 py-10 sm:py-12 overflow-hidden">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-24 h-24 rounded-3xl bg-white/80 border border-[#D4AF37]/40 flex items-center justify-center shadow-lg mb-3 overflow-hidden">
          <img
            src={logoSrc}
            alt="Shawaf Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#333333] whitespace-nowrap">
          Shawaf
        </h1>
        <p className="text-stone-500 text-sm">شواف</p>
      </div>

      <div className="card w-full max-w-md p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#006A4E] text-xl">🔐</span>

          <h2 className="text-xl sm:text-2xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h2>
        </div>

        <p className="text-stone-500 text-sm sm:text-base mb-6 leading-relaxed" dir="auto">
          {text.subtitle}
        </p>

        {message && (
          <div
            className="bg-[#E6F2EE] border border-[#006A4E]/20 text-[#006A4E] px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4"
            dir="auto"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {text.newPassword}
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field pe-10"
                placeholder={text.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                dir="ltr"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#006A4E]"
                aria-label={showPassword ? text.hidePassword : text.showPassword}
              >
                <PasswordToggleIcon visible={showPassword} />
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#333333] mb-1.5"
              dir="auto"
            >
              {text.confirmPassword}
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-field pe-10"
                placeholder={text.passwordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                dir="ltr"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#006A4E]"
                aria-label={
                  showConfirmPassword ? text.hidePassword : text.showPassword
                }
              >
                <PasswordToggleIcon visible={showConfirmPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3.5 rounded-xl text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2" dir="auto">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {text.updating}
              </span>
            ) : (
              text.updatePassword
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6" dir="auto">
          <Link
            to="/signin"
            className="text-[#006A4E] font-semibold hover:text-[#004D39]"
          >
            {text.backToSignIn}
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## `pages/Planner.jsx`

```jsx
import { useState } from 'react'
import StepIndicator from '../components/StepIndicator'
import StepOne from '../planner/StepOne'
import StepTwo from '../planner/StepTwo'
import StepThree from '../planner/StepThree'

const initialTripData = {
  city: '',
  startDate: '',
  endDate: '',
  numberOfPeople: 2,
  tripType: '',
  budget: 'Mid-Range',
  budgetAmount: 2000,
  activityLevel: 'Moderate',
  interests: [],
  accommodation: '',
  transportation: '',
  preferredTime: 'No Preference',
  travelWith: 'Friends',
  notes: '',
}

export default function Planner() {
  const [step, setStep] = useState(1)
  const [tripData, setTripData] = useState(initialTripData)
  const [generatedPlan, setGeneratedPlan] = useState(null)

  const updateTripData = (updates) => {
    setTripData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      <StepIndicator currentStep={step} />

      <div className="w-full max-w-4xl mx-auto">
        {step === 1 && (
          <StepOne
            data={tripData}
            onChange={updateTripData}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepTwo
            data={tripData}
            onChange={updateTripData}
            onBack={() => setStep(1)}
            onGenerate={(plan) => {
              setGeneratedPlan({
                ...(plan || {}),
                city: plan?.city || tripData.city,
                cities: plan?.cities || tripData.cities || [],
                startDate: tripData.startDate,
                endDate: tripData.endDate,
                numberOfPeople: tripData.numberOfPeople,
                budget: tripData.budget,
              })
              setStep(3)
            }}
          />
        )}

        {step === 3 && (
          <StepThree
            tripData={tripData}
            plan={generatedPlan}
            onBack={() => setStep(2)}
            onRegenerate={(plan) => setGeneratedPlan(plan)}
          />
        )}
      </div>
    </div>
  )
}

```

---

## `pages/Itinerary.jsx`

```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { generatePDF } from '../utils/pdf'
import * as itineraryDisplay from '../utils/itineraryDisplay'

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

const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

const BUDGET_LABELS_AR = {
  Budget: 'اقتصادي',
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

const STYLE_LABELS_AR = {
  Low: 'خفيف',
  Moderate: 'متوسط',
  High: 'مكثف',
}

function getCityLabel(city, lang) {
  return itineraryDisplay.getCityLabel(city, lang)
}

function getCategoryLabel(category, lang) {
  return itineraryDisplay.getCategoryLabel(category, lang)
}

function getBudgetLabel(budget, lang) {
  return itineraryDisplay.getBudgetLabel(budget, lang)
}

function getStyleLabel(style, lang) {
  return itineraryDisplay.getStyleLabel(style, lang)
}

function getStationName(station, lang = 'en') {
  return itineraryDisplay.getStationName(station, lang)
}

function getStationDescription(station, lang = 'en') {
  return itineraryDisplay.getStationDescription(station, lang)
}

function getStationLat(station) {
  const value = station?.lat ?? station?.latitude
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function getStationLng(station) {
  const value = station?.lng ?? station?.longitude
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function buildMapsUrl(station, city) {
  const lat = getStationLat(station)
  const lng = getStationLng(station)

  if (lat !== null && lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  const placeName = getStationName(station)
  const query = encodeURIComponent(`${placeName}, ${city}, Saudi Arabia`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

function getCitiesDisplay(trip, lang = 'en') {
  return itineraryDisplay.getCitiesDisplay(trip, lang)
}

function getDayCity(day, index, trip) {
  const plan = trip?.ai_plan

  return day?.city || plan?.cities?.[index] || trip?.city || ''
}

function getTravelerName(profile, user, plan) {
  return (
    profile?.full_name ||
    profile?.email?.split('@')[0] ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    plan?.travelerName ||
    ''
  )
}

export default function Itinerary() {
  const { user, profile } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [trips, setTrips] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const isArabic = lang === 'ar'

  const text = {
    days: isArabic ? 'الأيام' : 'Days',
    dayShort: isArabic ? 'يوم' : 'd',
    budget: isArabic ? 'الميزانية' : 'Budget',
    style: isArabic ? 'النمط' : 'Style',
    openInMaps: isArabic ? 'فتح في خرائط Google' : 'Open in Maps',
    tripSummary: isArabic ? 'ملخص الرحلة' : t('tripSummary'),
    destination: isArabic ? 'مدينة الوجهة' : t('destinationCityLabel'),
  }

  useEffect(() => {
    if (!user) return

    supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Load saved trips error:', error)
        }

        setTrips(data || [])

        if (data && data.length > 0) {
          setSelected(data[0])
        }

        setLoading(false)
      })
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!trips.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#F5F5F0]">
        <div className="card p-6 sm:p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">🗺️</div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#333333] mb-2" dir="auto">
            {t('noTripsYet')}
          </h2>

          <button onClick={() => navigate('/planner')} className="btn-primary mt-4 justify-center">
            {t('startFirstTrip')}
          </button>
        </div>
      </div>
    )
  }

  const plan = selected?.ai_plan
  const itinerary = plan?.itinerary || plan?.days || []
  const cityDisplay = getCitiesDisplay(selected, lang)
  const travelerName = getTravelerName(profile, user, plan)

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      {trips.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
          {trips.map((trip) => {
            const tripCityDisplay = getCitiesDisplay(trip, lang)

            return (
              <button
                key={trip.id}
                onClick={() => setSelected(trip)}
                className={`flex-shrink-0 max-w-[260px] px-4 py-2 rounded-full text-sm font-medium border transition-all truncate ${
                  selected?.id === trip.id
                    ? 'bg-[#006A4E] text-white border-[#006A4E]'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-[#D4AF37] hover:bg-[#FBF6E3]'
                }`}
                dir="auto"
              >
                {tripCityDisplay} · {trip.days}
                {isArabic ? ` ${text.dayShort}` : text.dayShort}
              </button>
            )
          })}
        </div>
      )}

      <div className="bg-[#E6F2EE] border border-[#D4AF37]/40 rounded-2xl p-4 sm:p-5 mb-5">
        <h3 className="flex items-center gap-2 font-semibold text-[#006A4E] mb-3" dir="auto">
          <span>🗺️</span> {text.tripSummary}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="sm:col-span-2">
            <span className="text-stone-500">{text.destination}:</span>{' '}
            <strong className="text-[#333333]" dir="auto">
              {cityDisplay}
            </strong>
          </div>

          <div>
            <span className="text-stone-500">{text.days}:</span>{' '}
            <strong className="text-[#333333]">{selected?.days}</strong>
          </div>

          <div>
            <span className="text-stone-500">{text.budget}:</span>{' '}
            <strong className="text-[#333333]" dir="auto">
              {getBudgetLabel(selected?.budget, lang)}
            </strong>
          </div>

          <div>
            <span className="text-stone-500">{text.style}:</span>{' '}
            <strong className="text-[#333333]" dir="auto">
              {getStyleLabel(selected?.trip_style, lang)}
            </strong>
          </div>
        </div>
      </div>

      {itinerary.map((day, di) => {
        const dayCity = getDayCity(day, di, selected)
        const dayCityLabel = getCityLabel(dayCity, lang)
        const dayTheme = itineraryDisplay.getDayTheme(day, lang)

        return (
          <div key={di} className="card p-4 sm:p-6 mb-4 overflow-hidden">
            <h3 className="font-bold text-[#333333] text-base sm:text-lg mb-4 flex items-center gap-2 flex-wrap">
              <span className="w-8 h-8 bg-[#006A4E] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {di + 1}
              </span>

              <span dir="auto">
                {t('day')} {di + 1}
              </span>

              {dayCityLabel && (
                <span className="text-sm font-semibold text-[#006A4E]" dir="auto">
                  ({dayCityLabel})
                </span>
              )}

              {dayTheme && (
                <span className="text-sm font-normal text-stone-500 ms-1" dir="auto">
                  — {dayTheme}
                </span>
              )}
            </h3>

            <div className="space-y-4">
              {(day.stations || day.activities || []).map((station, si) => {
                const stationName = getStationName(station, lang)
                const stationDescription = getStationDescription(station, lang)
                const stationCity = station.city || dayCity || selected?.city
                const stationCategory = getCategoryLabel(station.category, lang)

                return (
                  <div
                    key={`${di}-${si}-${stationName}`}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
                  >
                    <div className="flex sm:block items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#E6F2EE] text-[#006A4E] border border-[#D4AF37]/35 rounded-full flex items-center justify-center text-xs font-bold">
                        {si + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <div
                            className="font-semibold text-[#333333] text-sm sm:text-base"
                            dir="auto"
                          >
                            {stationName}
                          </div>

                          {station.time && (
                            <div className="text-xs text-[#006A4E] font-medium mt-0.5" dir="auto">
                              {station.time}
                            </div>
                          )}

                          {stationCategory && (
                            <div className="text-xs text-stone-400 mt-0.5" dir="auto">
                              {stationCategory}
                            </div>
                          )}
                        </div>

                        <a
                          href={buildMapsUrl(station, stationCity)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto justify-center flex-shrink-0 text-xs text-[#006A4E] hover:text-[#004D39] border border-[#D4AF37]/45 rounded-lg px-3 py-2 flex items-center gap-1 transition-colors hover:bg-[#FBF6E3]"
                          dir="auto"
                        >
                          📍 {text.openInMaps}
                        </a>
                      </div>

                      {stationDescription && (
                        <p
                          className="text-sm text-stone-500 mt-2 leading-relaxed"
                          dir="auto"
                        >
                          {stationDescription}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <button onClick={() => navigate('/planner')} className="btn-outline justify-center">
          {t('backToPlanner')}
        </button>

        <button
          onClick={() =>
            generatePDF(
              {
                ...selected,
                city: cityDisplay,
                cities: plan?.cities || [],
                startDate: plan?.startDate || plan?.start_date || '',
                endDate: plan?.endDate || plan?.end_date || '',
                numberOfPeople: plan?.numberOfPeople || plan?.number_of_people || '',
                travelerName,
              },
              plan,
              itinerary
            )
          }
          className="btn-outline justify-center flex items-center gap-2"
        >
          📄 {t('generatePDF')}
        </button>

        <button
          onClick={() => {
            sessionStorage.setItem(
              'currentTrip',
              JSON.stringify({
                tripData: {
                  ...selected,
                  city: cityDisplay,
                  cities: plan?.cities || [],
                },
                plan,
              })
            )
            navigate('/map')
          }}
          className="btn-primary justify-center flex items-center gap-2"
        >
          🗺️ {t('map')}
        </button>
      </div>
    </div>
  )
}

```

---

## `pages/MapPage.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useLang } from '../context/LanguageContext'
import * as itineraryDisplay from '../utils/itineraryDisplay'

const CITY_COORDS = {
  Riyadh: [24.7136, 46.6753],
  Jeddah: [21.4858, 39.1925],
  Mecca: [21.3891, 39.8579],
  Medina: [24.5247, 39.5692],
  Dammam: [26.4207, 50.0888],
  'Al-Khobar': [26.2172, 50.1971],
  Dhahran: [26.2361, 50.0393],
  'Al-Ahsa': [25.3831, 49.5867],
  'Al-Ula': [26.6085, 37.9232],
  NEOM: [28.0339, 35.1389],
  Abha: [18.2164, 42.5053],
  Taif: [21.2854, 40.426],
  Yanbu: [24.0895, 38.0618],
  Tabuk: [28.3835, 36.5662],
  Hail: [27.5114, 41.7208],
  Najran: [17.5656, 44.2289],
  Jizan: [16.8892, 42.5511],
  Diriyah: [24.737, 46.5752],
  Buraidah: [26.3592, 43.9818],
  Jubail: [27.0046, 49.646],
  'Al-Baha': [20.0129, 41.4677],
  Sakaka: [29.9697, 40.2064],
  'Hafar Al-Batin': [28.4328, 45.9708],
  KAEC: [22.4057, 39.0811],
}

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

const AR_CITY_TO_EN = Object.fromEntries(
  Object.entries(CITY_LABELS_AR).map(([en, ar]) => [ar, en])
)

const CATEGORY_COLORS = {
  Landmark: '#006A4E',
  Museum: '#D4AF37',
  Historical: '#004D39',
  Heritage: '#6FAE9B',
  Entertainment: '#B89122',
  Shopping: '#8A6F18',
  Culture: '#2E7D67',
  Outdoor: '#4F9D84',
  Natural: '#1D6B54',
  Restaurant: '#A17E20',
}

const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

const LEGEND = [
  { type: 'Landmark', color: '#006A4E' },
  { type: 'Museum', color: '#D4AF37' },
  { type: 'Historical', color: '#004D39' },
  { type: 'Heritage', color: '#6FAE9B' },
  { type: 'Entertainment', color: '#B89122' },
  { type: 'Shopping', color: '#8A6F18' },
  { type: 'Culture', color: '#2E7D67' },
  { type: 'Outdoor', color: '#4F9D84' },
  { type: 'Natural', color: '#1D6B54' },
  { type: 'Restaurant', color: '#A17E20' },
]

const FALLBACK_OFFSETS = [
  [0.012, 0.01],
  [-0.01, 0.014],
  [0.016, -0.012],
  [-0.014, -0.008],
  [0.006, 0.02],
  [-0.018, 0.006],
  [0.022, -0.004],
  [-0.006, -0.02],
  [0.028, 0.018],
  [-0.024, -0.018],
]

function isInsideSaudi(lat, lng) {
  return lat >= 16 && lat <= 33 && lng >= 34 && lng <= 56
}

function getCityKey(city) {
  if (!city) return ''

  const clean = String(city).trim()

  if (CITY_COORDS[clean]) return clean
  if (AR_CITY_TO_EN[clean]) return AR_CITY_TO_EN[clean]

  const firstPart = clean
    .split(/[→←]/)
    .map((item) => item.trim())
    .filter(Boolean)[0]

  if (CITY_COORDS[firstPart]) return firstPart
  if (AR_CITY_TO_EN[firstPart]) return AR_CITY_TO_EN[firstPart]

  return clean
}

function getCityLabel(city, lang) {
  return itineraryDisplay.getCityLabel(city, lang)
}

function getCategoryLabel(category, lang) {
  return itineraryDisplay.getCategoryLabel(category, lang)
}

function getStationName(station, lang = 'en') {
  return itineraryDisplay.getStationName(station, lang)
}

function getStationDescription(station, lang = 'en') {
  return itineraryDisplay.getStationDescription(station, lang)
}

function getStationLat(station) {
  const value =
    station?.lat ??
    station?.latitude ??
    station?.location?.lat ??
    station?.coordinates?.lat

  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function getStationLng(station) {
  const value =
    station?.lng ??
    station?.longitude ??
    station?.location?.lng ??
    station?.coordinates?.lng

  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function hasRealCoordinates(station) {
  const lat = getStationLat(station)
  const lng = getStationLng(station)

  if (lat === null || lng === null) return false
  return isInsideSaudi(lat, lng)
}

function getFallbackPosition(station) {
  const cityKey = getCityKey(station.dayCity || station.city)
  const center = CITY_COORDS[cityKey] || CITY_COORDS.Riyadh
  const offsetIndex =
    ((Number(station.dayNum) || 1) * 3 + (Number(station.stationNum) || 1)) %
    FALLBACK_OFFSETS.length

  const [latOffset, lngOffset] = FALLBACK_OFFSETS[offsetIndex]

  return [center[0] + latOffset, center[1] + lngOffset]
}

function getMarkerPosition(station) {
  const lat = getStationLat(station)
  const lng = getStationLng(station)

  if (lat !== null && lng !== null && isInsideSaudi(lat, lng)) {
    return [lat, lng]
  }

  return getFallbackPosition(station)
}

function buildGoogleMapsUrl(station) {
  const lat = getStationLat(station)
  const lng = getStationLng(station)

  if (lat !== null && lng !== null && isInsideSaudi(lat, lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  const name =
    station?.name ||
    station?.place_name ||
    station?.place ||
    station?.title ||
    'Attraction'

  const city = station?.dayCity || station?.city || ''
  const q = encodeURIComponent(`${name}, ${city}, Saudi Arabia`)

  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

function createNumberIcon(number, category, estimated = false) {
  const color = estimated ? '#78716C' : CATEGORY_COLORS[category] || '#006A4E'

  return L.divIcon({
    html: `
      <div style="
        width:32px;
        height:32px;
        background:${color};
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-weight:bold;
        font-size:13px;
        opacity:${estimated ? '0.85' : '1'};
      ">
        ${number}
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function FitMapToMarkers({ stations, city }) {
  const map = useMap()

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()

      const validPositions = stations.map(getMarkerPosition)

      if (validPositions.length > 0) {
        const bounds = L.latLngBounds(validPositions)

        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 14,
        })
      } else {
        const cityKey = getCityKey(city)
        const center = CITY_COORDS[cityKey] || CITY_COORDS.Riyadh
        map.setView(center, 11)
      }
    }, 250)
  }, [map, stations, city])

  return null
}

export default function MapPage() {
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [tripData, setTripData] = useState(null)
  const [plan, setPlan] = useState(null)
  const [selectedDay, setSelectedDay] = useState('all')

  const isArabic = lang === 'ar'

  const text = {
    mapped: isArabic ? 'معالم على الخريطة' : 'mapped',
    estimated: isArabic ? 'نقاط تقديرية' : 'estimated points',
    daySingular: isArabic ? 'يوم' : 'day',
    dayPlural: isArabic ? 'أيام' : 'days',
    openInGoogleMaps: isArabic ? 'فتح في خرائط Google' : 'Open in Google Maps',
    estimatedPoint: isArabic
      ? 'هذه نقطة تقديرية لأن النشاط لا يحتوي على إحداثيات دقيقة.'
      : 'Estimated point because this activity has no exact coordinates.',
    mapProvider: isArabic
      ? 'Leaflet / OpenStreetMap · تفتح خرائط Google خارجيًا'
      : 'Leaflet / OpenStreetMap · Google Maps opens externally',
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('currentTrip')

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTripData(parsed.tripData)
        setPlan(parsed.plan)
      } catch (error) {
        console.error('Failed to load current trip:', error)
      }
    }
  }, [])

  const itinerary = plan?.itinerary || plan?.days || []
  const days = itinerary.length

  const selectedCities =
    plan?.cities?.length
      ? plan.cities
      : tripData?.cities?.length
      ? tripData.cities
      : tripData?.city
      ? [tripData.city]
      : []

  const cityDisplay = selectedCities.length
    ? selectedCities
        .map((city) => getCityLabel(city, lang))
        .join(isArabic ? ' ← ' : ' → ')
    : getCityLabel(tripData?.city || plan?.city || 'Riyadh', lang)

  const primaryCity = getCityKey(
    selectedCities[0] || tripData?.city || plan?.city || 'Riyadh'
  )

  const center = CITY_COORDS[primaryCity] || CITY_COORDS.Riyadh

  const allStations = useMemo(() => {
    return itinerary
      .flatMap((day, dayIndex) => {
        const stations = day.stations || day.activities || []
        const dayCity = day?.city || selectedCities[dayIndex] || primaryCity

        return stations.map((station, stationIndex) => ({
          ...station,
          dayNum: dayIndex + 1,
          stationNum: stationIndex + 1,
          dayCity,
          displayName: getStationName(station, lang),
          displayDescription: getStationDescription(station, lang),
          displayCategory: getCategoryLabel(station.category, lang),
        }))
      })
      .filter(
        (station) =>
          selectedDay === 'all' || station.dayNum === Number(selectedDay)
      )
  }, [itinerary, selectedDay, selectedCities, primaryCity, lang])

  const mappedStations = allStations
  const estimatedStations = allStations.filter((station) => !hasRealCoordinates(station))

  if (!plan) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#F5F5F0]">
        <div className="card p-6 sm:p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">🗺️</div>

          <h2
            className="text-xl sm:text-2xl font-bold text-[#333333] mb-2"
            dir="auto"
          >
            {t('noTripData')}
          </h2>

          <button
            onClick={() => navigate('/planner')}
            className="btn-primary mt-4 justify-center"
          >
            {t('tripPlanner')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#F5F5F0] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 lg:gap-6 min-h-[calc(100vh-130px)]">
          <aside className="bg-white border border-[#DDD8C8] rounded-2xl overflow-hidden lg:max-h-[calc(100vh-150px)] lg:overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <h2 className="font-bold text-[#333333] text-lg" dir="auto">
                  {t('mapTitle')}
                </h2>

                <p className="text-sm text-stone-500" dir="auto">
                  {cityDisplay} · {days}{' '}
                  {days === 1 ? text.daySingular : text.dayPlural}
                </p>

                <p className="text-xs text-stone-400 mt-1" dir="auto">
                  {mappedStations.length} {text.mapped} ·{' '}
                  {estimatedStations.length} {text.estimated}
                </p>
              </div>

              <div className="card p-4">
                <h3
                  className="text-xs font-semibold text-stone-500 uppercase mb-3"
                  dir="auto"
                >
                  {t('filterByDay')}
                </h3>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedDay('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedDay === 'all'
                        ? 'bg-[#006A4E] text-white border-[#006A4E]'
                        : 'border-stone-200 text-stone-600 hover:border-[#D4AF37] hover:bg-[#FBF6E3]'
                    }`}
                  >
                    {t('allAttractions')}
                  </button>

                  {Array.from({ length: days }, (_, index) => index + 1).map(
                    (day) => {
                      const dayData = itinerary[day - 1]
                      const dayCity = dayData?.city || selectedCities[day - 1] || ''
                      const dayCityLabel = getCityLabel(dayCity, lang)

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selectedDay === day
                              ? 'bg-[#006A4E] text-white border-[#006A4E]'
                              : 'border-stone-200 text-stone-600 hover:border-[#D4AF37] hover:bg-[#FBF6E3]'
                          }`}
                          dir="auto"
                        >
                          {t('day')} {day}
                          {dayCityLabel ? ` (${dayCityLabel})` : ''}
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              <div className="card p-4">
                <h3
                  className="text-xs font-semibold text-stone-500 uppercase mb-3"
                  dir="auto"
                >
                  {t('legend')}
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {LEGEND.map(({ type, color }) => (
                    <div
                      key={type}
                      className="flex items-center gap-2 text-xs text-stone-600 min-w-0"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />

                      <span dir="auto" className="truncate">
                        {getCategoryLabel(type, lang)}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 text-xs text-stone-600 min-w-0">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 bg-stone-500" />
                    <span dir="auto" className="truncate">
                      {text.estimated}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h3
                  className="text-xs font-semibold text-stone-500 uppercase mb-3"
                  dir="auto"
                >
                  {allStations.length} {t('attractions')}
                </h3>

                <div className="space-y-3 max-h-[360px] lg:max-h-none overflow-y-auto pe-1">
                  {allStations.map((station, index) => {
                    const estimated = !hasRealCoordinates(station)
                    const dayCityLabel = getCityLabel(station.dayCity, lang)

                    return (
                      <div
                        key={`${station.dayNum}-${index}`}
                        className="flex items-start gap-2.5"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            estimated
                              ? 'bg-stone-100 text-stone-500'
                              : 'bg-[#E6F2EE] text-[#006A4E] border border-[#D4AF37]/35'
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div
                            className="font-medium text-[#333333] text-xs leading-tight"
                            dir="auto"
                          >
                            {station.displayName}
                          </div>

                          <div
                            className="text-xs text-stone-400 mt-0.5"
                            dir="auto"
                          >
                            {t('day')} {station.dayNum}
                            {dayCityLabel ? ` (${dayCityLabel})` : ''}
                            {station.time ? ` · ${station.time}` : ''}
                          </div>

                          {station.displayCategory && (
                            <div
                              className="text-xs text-stone-400 mt-0.5"
                              dir="auto"
                            >
                              {station.displayCategory}
                            </div>
                          )}

                          {estimated && (
                            <div
                              className="text-xs text-stone-400 mt-1"
                              dir="auto"
                            >
                              {text.estimatedPoint}
                            </div>
                          )}

                          <a
                            href={buildGoogleMapsUrl(station)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#006A4E] hover:text-[#004D39] mt-1 inline-block"
                            dir="auto"
                          >
                            {text.openInGoogleMaps}
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          <section className="bg-white border border-[#DDD8C8] rounded-2xl overflow-hidden min-w-0 flex flex-col min-h-[520px]">
            <div className="bg-white border-b border-[#DDD8C8] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 bg-[#006A4E] text-white px-3 py-1.5 rounded-lg text-sm font-medium w-fit">
                🗺️ {t('map')}
              </div>

              <div className="text-xs text-stone-400" dir="auto">
                {text.mapProvider}
              </div>
            </div>

            <div className="flex-1 min-h-[460px] relative" dir="ltr">
              <MapContainer
                center={center}
                zoom={11}
                scrollWheelZoom
                className="absolute inset-0 z-0"
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 0,
                }}
              >
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitMapToMarkers stations={mappedStations} city={primaryCity} />

                {mappedStations.map((station, index) => {
                  const [lat, lng] = getMarkerPosition(station)
                  const estimated = !hasRealCoordinates(station)
                  const dayCityLabel = getCityLabel(station.dayCity, lang)

                  return (
                    <Marker
                      key={`${station.dayNum}-${index}-${station.displayName}`}
                      position={[lat, lng]}
                      icon={createNumberIcon(
                        index + 1,
                        station.category,
                        estimated
                      )}
                    >
                      <Popup>
                        <div
                          className="min-w-[200px]"
                          dir={isArabic ? 'rtl' : 'ltr'}
                        >
                          <div className="font-semibold text-sm mb-1" dir="auto">
                            {station.displayName}
                          </div>

                          <div
                            className="text-xs text-stone-500 mb-1"
                            dir="auto"
                          >
                            {t('day')} {station.dayNum}
                            {dayCityLabel ? ` (${dayCityLabel})` : ''}
                          </div>

                          {station.time && (
                            <div className="text-xs text-[#006A4E] mb-1">
                              {station.time}
                            </div>
                          )}

                          {station.displayCategory && (
                            <div
                              className="text-xs text-stone-500 mb-1"
                              dir="auto"
                            >
                              {station.displayCategory}
                            </div>
                          )}

                          {estimated && (
                            <div
                              className="text-xs text-stone-400 mb-1"
                              dir="auto"
                            >
                              {text.estimatedPoint}
                            </div>
                          )}

                          <div
                            className="text-xs text-stone-600 leading-relaxed"
                            dir="auto"
                          >
                            {station.displayDescription}
                          </div>

                          <a
                            href={buildGoogleMapsUrl(station)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#006A4E] mt-2 inline-block"
                            dir="auto"
                          >
                            📍 {text.openInGoogleMaps}
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

```

---

## `pages/Profile.jsx`

```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { generatePDF } from '../utils/pdf'
import * as itineraryDisplay from '../utils/itineraryDisplay'

const CITY_LABELS_AR = {
  Riyadh: 'الرياض',
  Diriyah: 'الدرعية',
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
  Buraidah: 'بريدة',
  Jubail: 'الجبيل',
  'Al-Baha': 'الباحة',
  Sakaka: 'سكاكا',
  'Hafar Al-Batin': 'حفر الباطن',
  KAEC: 'مدينة الملك عبدالله الاقتصادية',
}

const BUDGET_LABELS_AR = {
  Budget: 'اقتصادي',
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

function getCityLabel(city, lang) {
  return itineraryDisplay.getCityLabel(city, lang)
}

function getBudgetLabel(budget, lang) {
  return itineraryDisplay.getBudgetLabel(budget, lang)
}

function getTripCityDisplay(trip, lang) {
  return itineraryDisplay.getCitiesDisplay(trip, lang) || trip?.city || ''
}

function getTravelerName(profile, user, plan) {
  return (
    profile?.full_name ||
    profile?.email?.split('@')[0] ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    plan?.travelerName ||
    ''
  )
}

function formatDate(dateValue, lang) {
  if (!dateValue) return ''

  return new Date(dateValue).toLocaleDateString(
    lang === 'ar' ? 'ar-SA' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  )
}

export default function Profile() {
  const { user, signOut } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const isArabic = lang === 'ar'

  const text = {
    savedTripCount: isArabic ? 'رحلات محفوظة' : t('savedTrips'),
    deleteConfirm: isArabic
      ? 'هل تريد حذف هذه الرحلة؟'
      : 'Delete this trip?',
    saving: isArabic ? 'جاري الحفظ...' : 'Saving...',
    updateFailed: isArabic
      ? 'فشل تحديث الملف الشخصي.'
      : 'Failed to update profile.',
    deleteFailed: isArabic ? 'فشل حذف الرحلة.' : 'Failed to delete trip.',
    pdfFailed: isArabic ? 'فشل تحميل ملف PDF.' : 'Failed to download PDF.',
    noPlan: isArabic ? 'لا توجد خطة محفوظة لهذه الرحلة.' : 'No saved plan for this trip.',
    pdf: isArabic ? 'تحميل PDF' : 'PDF',
    generatingPdf: isArabic ? 'جاري التحميل...' : 'Generating...',
    days: isArabic ? 'أيام' : 'days',
    day: isArabic ? 'يوم' : 'day',
    view: t('viewItinerary'),
    delete: t('deleteTrip'),
  }

  const [profile, setProfile] = useState({ full_name: '', email: '' })
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pdfLoadingId, setPdfLoadingId] = useState(null)
  const [saveMsg, setSaveMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('trips')
        .select('id, city, days, budget, created_at, ai_plan')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]).then(
      ([{ data: p, error: profileError }, { data: tr, error: tripsError }]) => {
        if (profileError) {
          console.error('Load profile error:', profileError)
        }

        if (tripsError) {
          console.error('Load trips error:', tripsError)
        }

        if (p) setProfile(p)
        setTrips(tr || [])
        setLoading(false)
      }
    )
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    setError('')

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: profile.full_name,
      email: user.email,
      updated_at: new Date().toISOString(),
    })

    setSaving(false)

    if (error) {
      setError(error.message || text.updateFailed)
      return
    }

    setSaveMsg(t('profileUpdated'))
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!confirm(text.deleteConfirm)) return

    setError('')

    const { error } = await supabase.from('trips').delete().eq('id', id)

    if (error) {
      setError(error.message || text.deleteFailed)
      return
    }

    setTrips((prev) => prev.filter((tr) => tr.id !== id))
  }

  const handleDownloadPdf = async (trip) => {
    setError('')

    if (!trip?.ai_plan) {
      setError(text.noPlan)
      return
    }

    const itinerary = trip.ai_plan?.itinerary || trip.ai_plan?.days || []
    const cityDisplay = getTripCityDisplay(trip, lang)
    const travelerName = getTravelerName(profile, user, trip.ai_plan)

    setPdfLoadingId(trip.id)

    try {
      await generatePDF(
        {
          ...trip,
          city: cityDisplay,
          cities: trip.ai_plan?.cities || [],
          startDate: trip.ai_plan?.startDate || trip.ai_plan?.start_date || '',
          endDate: trip.ai_plan?.endDate || trip.ai_plan?.end_date || '',
          numberOfPeople:
            trip.ai_plan?.numberOfPeople || trip.ai_plan?.number_of_people || '',
          travelerName,
        },
        trip.ai_plan,
        itinerary,
        lang
      )
    } catch (err) {
      console.error('Saved trip PDF error:', err)
      setError(err.message || text.pdfFailed)
    } finally {
      setPdfLoadingId(null)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-6 sm:mb-8" dir="auto">
        {t('myProfile')}
      </h1>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5"
          dir="auto"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-1">
          <div className="card p-5 sm:p-6 text-center">
            <div className="w-20 h-20 bg-[#E6F2EE] border border-[#D4AF37]/35 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-[#006A4E]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>

            <div className="font-bold text-[#333333] mb-0.5 break-words" dir="auto">
              {profile.full_name || user.email?.split('@')[0]}
            </div>

            <div className="text-sm text-stone-500 mb-5 break-all" dir="ltr">
              {user.email}
            </div>

            <div className="text-sm text-stone-400" dir="auto">
              {trips.length} {text.savedTripCount}
            </div>

            <button
              onClick={handleSignOut}
              className="mt-5 w-full btn-outline justify-center text-sm py-2 text-red-500 border-red-200 hover:bg-red-50"
            >
              {t('signOut')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5 min-w-0">
          <div className="card p-5 sm:p-6">
            <h2 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('updateProfile')}
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-stone-700 mb-1"
                  dir="auto"
                >
                  {t('fullName')}
                </label>

                <input
                  type="text"
                  className="input-field"
                  value={profile.full_name || ''}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                  dir="auto"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-stone-700 mb-1"
                  dir="auto"
                >
                  {t('emailAddress')}
                </label>

                <input
                  type="email"
                  className="input-field bg-stone-50"
                  value={user.email}
                  disabled
                  dir="ltr"
                />
              </div>
            </div>

            {saveMsg && (
              <div className="mt-3 text-sm text-[#006A4E] font-medium" dir="auto">
                {saveMsg}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 btn-primary disabled:opacity-60 justify-center"
            >
              {saving ? text.saving : t('updateProfile')}
            </button>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="font-semibold text-[#333333] mb-4" dir="auto">
              {t('savedTrips')}
            </h2>

            {trips.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🗺️</div>

                <p className="text-stone-500 text-sm mb-4" dir="auto">
                  {t('noTripsYet')}
                </p>

                <button
                  onClick={() => navigate('/planner')}
                  className="btn-primary text-sm justify-center"
                >
                  {t('startFirstTrip')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => {
                  const cityDisplay = getTripCityDisplay(trip, lang)
                  const dayLabel = trip.days === 1 ? text.day : text.days

                  return (
                    <div
                      key={trip.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-[#F5F5F0] rounded-xl border border-[#DDD8C8]"
                    >
                      <div className="min-w-0 flex-1">
                        <div
                          className="font-medium text-[#333333] text-sm leading-relaxed"
                          dir="auto"
                        >
                          {cityDisplay}
                        </div>

                        <div
                          className="text-xs text-stone-400 mt-1 leading-relaxed"
                          dir="auto"
                        >
                          {trip.days} {dayLabel} ·{' '}
                          {getBudgetLabel(trip.budget, lang)} ·{' '}
                          {formatDate(trip.created_at, lang)}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            sessionStorage.setItem(
                              'currentTrip',
                              JSON.stringify({
                                tripData: {
                                  ...trip,
                                  city: cityDisplay,
                                  cities: trip.ai_plan?.cities || [],
                                },
                                plan: trip.ai_plan,
                              })
                            )
                            navigate('/itinerary')
                          }}
                          className="text-xs text-[#006A4E] hover:text-[#004D39] border border-[#D4AF37]/45 rounded-lg px-3 py-2 transition-colors hover:bg-[#FBF6E3]"
                        >
                          {text.view}
                        </button>

                        <button
                          onClick={() => handleDownloadPdf(trip)}
                          disabled={pdfLoadingId === trip.id}
                          className="text-xs text-[#006A4E] hover:text-[#004D39] border border-[#D4AF37]/45 rounded-lg px-3 py-2 transition-colors hover:bg-[#FBF6E3] disabled:opacity-60"
                        >
                          {pdfLoadingId === trip.id ? text.generatingPdf : text.pdf}
                        </button>

                        <button
                          onClick={() => handleDelete(trip.id)}
                          className="text-xs text-red-500 hover:text-red-600 border border-red-100 rounded-lg px-3 py-2 transition-colors hover:bg-red-50"
                        >
                          {text.delete}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

```

---

## `pages/ReportIssue.jsx`

```jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function ReportIssue() {
  const { user } = useAuth()
  const { lang } = useLang()

  const isArabic = lang === 'ar'

  const [reportType, setReportType] = useState('technical')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const text = {
    title: isArabic ? 'هل تواجه مشكلة؟' : 'Report an Issue',
    subtitle: isArabic
      ? 'إذا واجهت مشكلة في الخطة، الخريطة، معلومات الأماكن، أو الموقع بشكل عام، أرسل لنا بلاغًا وسيظهر للأدمن للمراجعة.'
      : 'If you face an issue with the itinerary, map, attraction information, or the website, submit a report and the admin will review it.',
    issueType: isArabic ? 'نوع المشكلة' : 'Issue Type',
    issueDescription: isArabic ? 'وصف المشكلة' : 'Issue Description',
    placeholder: isArabic
      ? 'اكتب تفاصيل المشكلة هنا...'
      : 'Describe the issue here...',
    submit: isArabic ? 'إرسال البلاغ' : 'Submit Report',
    submitting: isArabic ? 'جاري الإرسال...' : 'Submitting...',
    backHome: isArabic ? 'العودة للرئيسية' : 'Back to Home',
    messageRequired: isArabic
      ? 'اكتب وصف المشكلة أولًا.'
      : 'Please describe the issue.',
    success: isArabic
      ? 'تم إرسال البلاغ بنجاح. شكرًا لمساعدتك في تحسين شواف.'
      : 'Your report has been submitted successfully. Thank you for helping improve Shawaf.',
    failed: isArabic ? 'فشل إرسال البلاغ.' : 'Failed to submit report.',
    guestNote: isArabic
      ? 'ملاحظة: يمكنك إرسال البلاغ بدون تسجيل دخول، لكن تسجيل الدخول يساعد في ربط البلاغ بحسابك.'
      : 'Note: You can submit a report without signing in, but signing in helps link the report to your account.',
  }

  const reportTypes = [
    {
      value: 'technical',
      labelEn: 'Technical Issue',
      labelAr: 'مشكلة تقنية',
    },
    {
      value: 'itinerary',
      labelEn: 'Itinerary Issue',
      labelAr: 'مشكلة في الخطة',
    },
    {
      value: 'attraction',
      labelEn: 'Attraction Information Issue',
      labelAr: 'مشكلة في معلومات مكان',
    },
    {
      value: 'map',
      labelEn: 'Map or Location Issue',
      labelAr: 'مشكلة في الخريطة أو الموقع',
    },
    {
      value: 'other',
      labelEn: 'Other',
      labelAr: 'أخرى',
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    try {
      if (!message.trim()) {
        throw new Error(text.messageRequired)
      }

      const { error } = await supabase.from('user_reports').insert([
        {
          user_id: user?.id || null,
          trip_id: null,
          report_type: reportType,
          message: message.trim(),
          status: 'pending',
        },
      ])

      if (error) throw error

      setSuccess(text.success)
      setReportType('technical')
      setMessage('')
    } catch (err) {
      setError(err.message || text.failed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden">
      <div className="card p-5 sm:p-8">
        <div className="mb-6">
          <div className="w-14 h-14 bg-[#E6F2EE] border border-[#D4AF37]/35 rounded-2xl flex items-center justify-center text-3xl mb-4">
            🚩
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-500 mt-2 leading-relaxed" dir="auto">
            {text.subtitle}
          </p>
        </div>

        {success && (
          <div
            className="bg-[#E6F2EE] border border-[#006A4E]/20 text-[#006A4E] px-4 py-3 rounded-xl text-sm mb-5"
            dir="auto"
          >
            {success}
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5"
            dir="auto"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5" dir="auto">
              {text.issueType}
            </label>

            <select
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {isArabic ? type.labelAr : type.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5" dir="auto">
              {text.issueDescription}
            </label>

            <textarea
              className="input-field min-h-[150px] resize-none"
              placeholder={text.placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              dir="auto"
            />
          </div>

          {!user && (
            <div
              className="bg-[#FBF6E3] border border-[#D4AF37]/40 text-[#6B571B] px-4 py-3 rounded-xl text-sm leading-relaxed"
              dir="auto"
            >
              {text.guestNote}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center disabled:opacity-60"
            >
              {loading ? text.submitting : text.submit}
            </button>

            <Link to="/" className="btn-outline justify-center">
              {text.backHome}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
```

---

## `pages/Admin.jsx`

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

function StatCard({ icon, value, label }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold text-[#333333] mb-1">
        {value}
      </div>
      <div className="text-sm text-stone-500" dir="auto">
        {label}
      </div>
    </div>
  )
}

export default function Admin() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'لوحة تحكم الأدمن' : 'Admin Dashboard',
    subtitle: isArabic
      ? 'نظرة عامة على نشاط نظام شواف.'
      : 'Visual overview of Shawaf system activity.',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    totalUsers: isArabic ? 'إجمالي المستخدمين' : 'Total Users',
    savedTrips: isArabic ? 'الرحلات المحفوظة' : 'Saved Trips',
    attractions: isArabic ? 'المعالم' : 'Attractions',
    pendingReports: isArabic ? 'البلاغات المعلقة' : 'Pending Reports',
    monthlyTrips: isArabic ? 'الرحلات الشهرية' : 'Monthly Trips Overview',
    noData: isArabic ? 'لا توجد بيانات' : 'No Data',
    quickActions: isArabic ? 'إجراءات سريعة' : 'Quick Actions',
    manageAttractions: isArabic ? 'إدارة المعالم' : 'Manage Attractions',
    manageAttractionsDesc: isArabic
      ? 'إضافة أو تعديل أو تعطيل الأماكن السياحية.'
      : 'Add, edit, or disable tourist attractions.',
    userReports: isArabic ? 'بلاغات المستخدمين' : 'User Reports',
    userReportsDesc: isArabic
      ? 'مراجعة البلاغات وتحديث حالتها.'
      : 'Review reports and update their status.',
    analytics: isArabic ? 'التحليلات' : 'Analytics',
    analyticsDesc: isArabic
      ? 'عرض الرسوم البيانية والإحصاءات.'
      : 'View charts and system statistics.',
    open: isArabic ? 'فتح' : 'Open',
  }

  const [stats, setStats] = useState({
    users: 0,
    trips: 0,
    attractions: 0,
    reports: 0,
  })

  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)

    const [profilesRes, tripsRes, attractionsRes, reportsRes, tripsListRes] =
      await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('trips').select('id', { count: 'exact', head: true }),
        supabase.from('attractions').select('id', { count: 'exact', head: true }),
        supabase
          .from('user_reports')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('trips')
          .select('created_at')
          .order('created_at', { ascending: true }),
      ])

    setStats({
      users: profilesRes.count || 0,
      trips: tripsRes.count || 0,
      attractions: attractionsRes.count || 0,
      reports: reportsRes.count || 0,
    })

    const monthCounts = {}

    ;(tripsListRes.data || []).forEach((trip) => {
      const date = new Date(trip.created_at)

      const month = date.toLocaleString(isArabic ? 'ar-SA' : 'en', {
        month: 'short',
      })

      monthCounts[month] = (monthCounts[month] || 0) + 1
    })

    const data = Object.entries(monthCounts).map(([month, trips]) => ({
      month,
      trips,
    }))

    setChartData(data.length ? data : [{ month: text.noData, trips: 0 }])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const actionCards = [
    {
      title: text.manageAttractions,
      desc: text.manageAttractionsDesc,
      icon: '📍',
      to: '/admin/attractions',
    },
    {
      title: text.userReports,
      desc: text.userReportsDesc,
      icon: '📝',
      to: '/admin/reports',
    },
    {
      title: text.analytics,
      desc: text.analyticsDesc,
      icon: '📊',
      to: '/admin/analytics',
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h1>

          <p className="text-sm text-stone-500 mt-1 leading-relaxed" dir="auto">
            {text.subtitle}
          </p>
        </div>

        <button onClick={loadStats} className="btn-outline shrink-0">
          {text.refresh}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
        <StatCard icon="👥" value={stats.users} label={text.totalUsers} />
        <StatCard icon="🧳" value={stats.trips} label={text.savedTrips} />
        <StatCard icon="📍" value={stats.attractions} label={text.attractions} />
        <StatCard icon="📝" value={stats.reports} label={text.pendingReports} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="card p-4 sm:p-6 lg:col-span-2 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.monthlyTrips}
          </h2>

          <div className="h-64 sm:h-72 w-full min-w-0" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDD8C8" />
                <XAxis dataKey="month" stroke="#78716c" />
                <YAxis stroke="#78716c" />
                <Tooltip />
                <Bar dataKey="trips" fill="#006A4E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.quickActions}
          </h2>

          <div className="space-y-3">
            {actionCards.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="block border border-[#DDD8C8] rounded-2xl p-4 hover:border-[#D4AF37] hover:bg-[#FBF6E3] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0">{action.icon}</div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[#333333] text-sm" dir="auto">
                      {action.title}
                    </div>

                    <p className="text-xs text-stone-500 mt-1 leading-relaxed" dir="auto">
                      {action.desc}
                    </p>

                    <div className="text-xs text-[#006A4E] font-medium mt-2" dir="auto">
                      {text.open} {isArabic ? '←' : '→'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## `pages/AdminAttractions.jsx`

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

const emptyForm = {
  name: '',
  name_ar: '',
  city: '',
  category: '',
  description: '',
  description_ar: '',
  opening_time: '',
  closing_time: '',
  estimated_duration: '',
  latitude: '',
  longitude: '',
  price_range: '',
  availability_type: 'permanent',
  status: 'active',
}

const cities = [
  'Riyadh',
  'Diriyah',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Al-Khobar',
  'Dhahran',
  'Al-Ahsa',
  'Al-Ula',
  'Abha',
  'Taif',
  'Yanbu',
  'Tabuk',
  'Hail',
  'Najran',
  'Jizan',
  'Buraidah',
  'Jubail',
  'Al-Baha',
  'Sakaka',
  'Hafar Al-Batin',
  'KAEC',
]

const categories = [
  'Landmark',
  'Museum',
  'Historical',
  'Heritage',
  'Entertainment',
  'Shopping',
  'Culture',
  'Outdoor',
  'Natural',
  'Restaurant',
]

const CITY_LABELS_AR = {
  Riyadh: 'الرياض',
  Diriyah: 'الدرعية',
  Jeddah: 'جدة',
  Mecca: 'مكة',
  Medina: 'المدينة المنورة',
  Dammam: 'الدمام',
  'Al-Khobar': 'الخبر',
  Dhahran: 'الظهران',
  'Al-Ahsa': 'الأحساء',
  'Al-Ula': 'العلا',
  Abha: 'أبها',
  Taif: 'الطائف',
  Yanbu: 'ينبع',
  Tabuk: 'تبوك',
  Hail: 'حائل',
  Najran: 'نجران',
  Jizan: 'جازان',
  Buraidah: 'بريدة',
  Jubail: 'الجبيل',
  'Al-Baha': 'الباحة',
  Sakaka: 'سكاكا',
  'Hafar Al-Batin': 'حفر الباطن',
  KAEC: 'مدينة الملك عبدالله الاقتصادية',
}

const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

const STATUS_LABELS_AR = {
  active: 'نشط',
  inactive: 'غير نشط',
}

const AVAILABILITY_LABELS_AR = {
  permanent: 'دائم',
  seasonal: 'موسمي',
}

function getCityLabel(city, lang) {
  if (!city) return ''
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
}

function getCategoryLabel(category, lang) {
  if (!category) return ''
  return lang === 'ar' ? CATEGORY_LABELS_AR[category] || category : category
}

function getStatusLabel(status, lang) {
  if (!status) return ''
  return lang === 'ar' ? STATUS_LABELS_AR[status] || status : status
}

function getAvailabilityLabel(value, lang) {
  if (!value) return ''
  return lang === 'ar' ? AVAILABILITY_LABELS_AR[value] || value : value
}

function getDisplayName(item, lang) {
  if (lang === 'ar') return item.name_ar || item.name
  return item.name
}

export default function AdminAttractions() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'إدارة المعالم' : 'Manage Attractions',
    subtitle: isArabic
      ? 'إضافة أو تعديل أو تعطيل أو حذف المعالم المستخدمة في شواف.'
      : 'Add, edit, disable, or delete attractions used by Shawaf.',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    formTitleAdd: isArabic ? 'إضافة معلم جديد' : 'Add Attraction',
    formTitleEdit: isArabic ? 'تعديل المعلم' : 'Edit Attraction',
    attractions: isArabic ? 'المعالم' : 'Attractions',
    allCities: isArabic ? 'كل المدن' : 'All Cities',
    allStatus: isArabic ? 'كل الحالات' : 'All Status',
    active: isArabic ? 'نشط' : 'Active',
    inactive: isArabic ? 'غير نشط' : 'Inactive',
    name: isArabic ? 'الاسم الإنجليزي' : 'English Name',
    nameAr: isArabic ? 'الاسم العربي' : 'Arabic Name',
    city: isArabic ? 'المدينة' : 'City',
    category: isArabic ? 'التصنيف' : 'Category',
    description: isArabic ? 'الوصف الإنجليزي' : 'English Description',
    descriptionAr: isArabic ? 'الوصف العربي' : 'Arabic Description',
    openingTime: isArabic ? 'وقت الفتح' : 'Opening Time',
    closingTime: isArabic ? 'وقت الإغلاق' : 'Closing Time',
    duration: isArabic ? 'المدة بالدقائق' : 'Estimated Duration',
    latitude: isArabic ? 'خط العرض' : 'Latitude',
    longitude: isArabic ? 'خط الطول' : 'Longitude',
    priceRange: isArabic ? 'نطاق السعر' : 'Price Range',
    availability: isArabic ? 'نوع الإتاحة' : 'Availability Type',
    status: isArabic ? 'الحالة' : 'Status',
    hours: isArabic ? 'الساعات' : 'Hours',
    actions: isArabic ? 'الإجراءات' : 'Actions',
    save: isArabic ? 'حفظ' : 'Save',
    update: isArabic ? 'تحديث' : 'Update',
    saving: isArabic ? 'جاري الحفظ...' : 'Saving...',
    cancel: isArabic ? 'إلغاء' : 'Cancel',
    edit: isArabic ? 'تعديل' : 'Edit',
    delete: isArabic ? 'حذف' : 'Delete',
    disable: isArabic ? 'تعطيل' : 'Disable',
    activate: isArabic ? 'تفعيل' : 'Activate',
    noAttractions: isArabic ? 'لا توجد معالم.' : 'No attractions found.',
    noCoordinates: isArabic ? 'لا توجد إحداثيات' : 'No coordinates',
    notSet: isArabic ? 'غير محدد' : 'Not set',
    selectCity: isArabic ? 'اختر المدينة' : 'Select city',
    selectCategory: isArabic ? 'اختر التصنيف' : 'Select category',
    permanent: isArabic ? 'دائم' : 'Permanent',
    seasonal: isArabic ? 'موسمي' : 'Seasonal',
    nameRequired: isArabic ? 'اسم المعلم الإنجليزي مطلوب.' : 'English attraction name is required.',
    cityRequired: isArabic ? 'المدينة مطلوبة.' : 'City is required.',
    categoryRequired: isArabic ? 'التصنيف مطلوب.' : 'Category is required.',
    latNumber: isArabic ? 'خط العرض يجب أن يكون رقمًا.' : 'Latitude must be a number.',
    lngNumber: isArabic ? 'خط الطول يجب أن يكون رقمًا.' : 'Longitude must be a number.',
    durationNumber: isArabic
      ? 'المدة المتوقعة يجب أن تكون رقمًا.'
      : 'Estimated duration must be a number.',
    added: isArabic ? 'تمت إضافة المعلم بنجاح.' : 'Attraction added successfully.',
    updated: isArabic ? 'تم تحديث المعلم بنجاح.' : 'Attraction updated successfully.',
    deleted: isArabic ? 'تم حذف المعلم بنجاح.' : 'Attraction deleted successfully.',
    confirmDelete: isArabic
      ? 'هل تريد حذف هذا المعلم نهائيًا؟'
      : 'Delete this attraction permanently?',
  }

  const [attractions, setAttractions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [cityFilter, setCityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadAttractions()
  }, [])

  const loadAttractions = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('attractions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setAttractions(data || [])
    }

    setLoading(false)
  }

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setMessage('')
    setError('')
  }

  const validateForm = () => {
    if (!form.name.trim()) return text.nameRequired
    if (!form.city.trim()) return text.cityRequired
    if (!form.category.trim()) return text.categoryRequired
    if (form.latitude && Number.isNaN(Number(form.latitude))) return text.latNumber
    if (form.longitude && Number.isNaN(Number(form.longitude))) return text.lngNumber
    if (form.estimated_duration && Number.isNaN(Number(form.estimated_duration))) {
      return text.durationNumber
    }

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      setSaving(false)
      return
    }

    const payload = {
      name: form.name.trim(),
      name_ar: form.name_ar.trim() || null,
      city: form.city,
      category: form.category,
      description: form.description.trim() || null,
      description_ar: form.description_ar.trim() || null,
      opening_time: form.opening_time || null,
      closing_time: form.closing_time || null,
      estimated_duration: form.estimated_duration
        ? Number(form.estimated_duration)
        : null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      price_range: form.price_range.trim() || null,
      availability_type: form.availability_type,
      status: form.status,
      updated_at: new Date().toISOString(),
    }

    const result = editingId
      ? await supabase.from('attractions').update(payload).eq('id', editingId)
      : await supabase.from('attractions').insert([payload])

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    setMessage(editingId ? text.updated : text.added)
    resetForm()
    await loadAttractions()
    setSaving(false)
  }

  const handleEdit = (attraction) => {
    setEditingId(attraction.id)
    setForm({
      name: attraction.name || '',
      name_ar: attraction.name_ar || '',
      city: attraction.city || '',
      category: attraction.category || '',
      description: attraction.description || '',
      description_ar: attraction.description_ar || '',
      opening_time: attraction.opening_time || '',
      closing_time: attraction.closing_time || '',
      estimated_duration: attraction.estimated_duration || '',
      latitude: attraction.latitude || '',
      longitude: attraction.longitude || '',
      price_range: attraction.price_range || '',
      availability_type: attraction.availability_type || 'permanent',
      status: attraction.status || 'active',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm(text.confirmDelete)) return

    const { error } = await supabase.from('attractions').delete().eq('id', id)

    if (error) {
      setError(error.message)
      return
    }

    setMessage(text.deleted)
    await loadAttractions()
  }

  const handleToggleStatus = async (attraction) => {
    const newStatus = attraction.status === 'active' ? 'inactive' : 'active'

    const { error } = await supabase
      .from('attractions')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', attraction.id)

    if (error) {
      setError(error.message)
      return
    }

    await loadAttractions()
  }

  const filteredAttractions = attractions.filter((item) => {
    const cityMatch = cityFilter === 'all' || item.city === cityFilter
    const statusMatch = statusFilter === 'all' || item.status === statusFilter
    return cityMatch && statusMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h1>
          <p className="text-sm text-stone-500 mt-1 leading-relaxed" dir="auto">
            {text.subtitle}
          </p>
        </div>

        <button onClick={loadAttractions} className="btn-outline shrink-0">
          {text.refresh}
        </button>
      </div>

      {message && (
        <div className="bg-[#E6F2EE] border border-[#006A4E]/20 text-[#006A4E] px-4 py-3 rounded-xl text-sm mb-5" dir="auto">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5" dir="auto">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
        <form onSubmit={handleSubmit} className="card p-4 sm:p-6 space-y-4 min-w-0">
          <h2 className="font-semibold text-[#333333]" dir="auto">
            {editingId ? text.formTitleEdit : text.formTitleAdd}
          </h2>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.name}
            </label>
            <input
              className="input-field mt-1"
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.nameAr}
            </label>
            <input
              className="input-field mt-1"
              value={form.name_ar}
              onChange={(e) => updateForm('name_ar', e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.city}
            </label>
            <select
              className="input-field mt-1"
              value={form.city}
              onChange={(e) => updateForm('city', e.target.value)}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <option value="">{text.selectCity}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {getCityLabel(city, lang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.category}
            </label>
            <select
              className="input-field mt-1"
              value={form.category}
              onChange={(e) => updateForm('category', e.target.value)}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <option value="">{text.selectCategory}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category, lang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.description}
            </label>
            <textarea
              className="input-field mt-1 h-24 resize-none"
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.descriptionAr}
            </label>
            <textarea
              className="input-field mt-1 h-24 resize-none"
              value={form.description_ar}
              onChange={(e) => updateForm('description_ar', e.target.value)}
              dir="auto"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-500" dir="auto">
                {text.openingTime}
              </label>
              <input
                type="time"
                className="input-field mt-1"
                value={form.opening_time}
                onChange={(e) => updateForm('opening_time', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500" dir="auto">
                {text.closingTime}
              </label>
              <input
                type="time"
                className="input-field mt-1"
                value={form.closing_time}
                onChange={(e) => updateForm('closing_time', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.duration}
            </label>
            <input
              className="input-field mt-1"
              value={form.estimated_duration}
              onChange={(e) => updateForm('estimated_duration', e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-500" dir="auto">
                {text.latitude}
              </label>
              <input
                className="input-field mt-1"
                value={form.latitude}
                onChange={(e) => updateForm('latitude', e.target.value)}
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-500" dir="auto">
                {text.longitude}
              </label>
              <input
                className="input-field mt-1"
                value={form.longitude}
                onChange={(e) => updateForm('longitude', e.target.value)}
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.priceRange}
            </label>
            <input
              className="input-field mt-1"
              value={form.price_range}
              onChange={(e) => updateForm('price_range', e.target.value)}
              dir="auto"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.availability}
            </label>
            <select
              className="input-field mt-1"
              value={form.availability_type}
              onChange={(e) => updateForm('availability_type', e.target.value)}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <option value="permanent">{text.permanent}</option>
              <option value="seasonal">{text.seasonal}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500" dir="auto">
              {text.status}
            </label>
            <select
              className="input-field mt-1"
              value={form.status}
              onChange={(e) => updateForm('status', e.target.value)}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <option value="active">{text.active}</option>
              <option value="inactive">{text.inactive}</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 justify-center disabled:opacity-60"
            >
              {saving ? text.saving : editingId ? text.update : text.save}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-outline justify-center"
              >
                {text.cancel}
              </button>
            )}
          </div>
        </form>

        <div className="card p-4 sm:p-6 xl:col-span-2 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <h2 className="font-semibold text-[#333333]" dir="auto">
              {text.attractions}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">
              <select
                className="input-field py-2 text-sm"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <option value="all">{text.allCities}</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {getCityLabel(city, lang)}
                  </option>
                ))}
              </select>

              <select
                className="input-field py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <option value="all">{text.allStatus}</option>
                <option value="active">{text.active}</option>
                <option value="inactive">{text.inactive}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="text-stone-500 border-b border-stone-100">
                  <th className="text-start pb-3 font-medium">{text.name}</th>
                  <th className="text-start pb-3 font-medium">{text.city}</th>
                  <th className="text-start pb-3 font-medium">{text.category}</th>
                  <th className="text-start pb-3 font-medium">{text.hours}</th>
                  <th className="text-start pb-3 font-medium">{text.status}</th>
                  <th className="text-start pb-3 font-medium">{text.actions}</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttractions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-stone-400">
                      {text.noAttractions}
                    </td>
                  </tr>
                ) : (
                  filteredAttractions.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-stone-50 last:border-0 align-top"
                    >
                      <td className="py-3.5 font-medium text-[#333333]" dir="auto">
                        {getDisplayName(item, lang)}

                        {lang === 'ar' && item.name_ar && (
                          <div className="text-xs text-stone-400 mt-0.5" dir="ltr">
                            {item.name}
                          </div>
                        )}

                        <div className="text-xs text-stone-400 mt-0.5" dir="ltr">
                          {item.latitude && item.longitude
                            ? `${item.latitude}, ${item.longitude}`
                            : text.noCoordinates}
                        </div>
                      </td>

                      <td className="py-3.5 text-stone-600" dir="auto">
                        {getCityLabel(item.city, lang)}
                      </td>

                      <td className="py-3.5 text-stone-600" dir="auto">
                        {getCategoryLabel(item.category, lang)}
                      </td>

                      <td className="py-3.5 text-stone-600" dir="ltr">
                        {item.opening_time && item.closing_time
                          ? `${String(item.opening_time).slice(0, 5)} - ${String(
                              item.closing_time
                            ).slice(0, 5)}`
                          : text.notSet}
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'active'
                              ? 'bg-[#E6F2EE] text-[#006A4E]'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {getStatusLabel(item.status, lang)}
                        </span>
                      </td>

                      <td className="py-3.5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-[#E6F2EE] text-[#006A4E] hover:bg-[#D9EDE7] transition-colors"
                          >
                            {text.edit}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                          >
                            {item.status === 'active' ? text.disable : text.activate}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            {text.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-stone-400 mt-3" dir="auto">
            {filteredAttractions.length} {text.attractions}
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## `pages/AdminReports.jsx`

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

const REPORT_TYPE_LABELS_AR = {
  technical: 'مشكلة تقنية',
  itinerary: 'مشكلة في الخطة',
  attraction: 'مشكلة في معلومات مكان',
  map: 'مشكلة في الخريطة أو الموقع',
  other: 'أخرى',
}

const REPORT_TYPE_LABELS_EN = {
  technical: 'Technical Issue',
  itinerary: 'Itinerary Issue',
  attraction: 'Attraction Information Issue',
  map: 'Map / Location Issue',
  other: 'Other',
}

const STATUS_LABELS_AR = {
  pending: 'قيد الانتظار',
  reviewed: 'تمت المراجعة',
  resolved: 'تم الحل',
  dismissed: 'تم التجاهل',
}

const STATUS_LABELS_EN = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
}

function getReportTypeLabel(type, lang) {
  if (!type) return ''
  return lang === 'ar'
    ? REPORT_TYPE_LABELS_AR[type] || type
    : REPORT_TYPE_LABELS_EN[type] || type
}

function getStatusLabel(status, lang) {
  if (!status) return ''
  return lang === 'ar'
    ? STATUS_LABELS_AR[status] || status
    : STATUS_LABELS_EN[status] || status
}

function formatDate(dateValue, lang) {
  if (!dateValue) return ''

  return new Date(dateValue).toLocaleDateString(
    lang === 'ar' ? 'ar-SA' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  )
}

function getStatusClass(status) {
  if (status === 'resolved') {
    return 'bg-[#E6F2EE] text-[#006A4E] border-[#006A4E]/20'
  }

  if (status === 'reviewed') {
    return 'bg-[#FBF6E3] text-[#8A6F18] border-[#D4AF37]/35'
  }

  if (status === 'dismissed') {
    return 'bg-stone-100 text-stone-500 border-stone-200'
  }

  return 'bg-white text-[#006A4E] border-[#D4AF37]/45'
}

export default function AdminReports() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'إدارة بلاغات المستخدمين' : 'Manage User Reports',
    subtitle: isArabic
      ? 'مراجعة البلاغات المرسلة من المستخدمين وتحديث حالتها.'
      : 'Review and update user-submitted reports.',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    type: isArabic ? 'النوع' : 'Type',
    message: isArabic ? 'الرسالة' : 'Message',
    status: isArabic ? 'الحالة' : 'Status',
    date: isArabic ? 'التاريخ' : 'Date',
    action: isArabic ? 'الإجراء' : 'Action',
    noReports: isArabic ? 'لا توجد بلاغات حتى الآن.' : 'No reports yet.',
    pending: isArabic ? 'قيد الانتظار' : 'Pending',
    reviewed: isArabic ? 'تمت المراجعة' : 'Reviewed',
    resolved: isArabic ? 'تم الحل' : 'Resolved',
    dismissed: isArabic ? 'تم التجاهل' : 'Dismissed',
    updateFailed: isArabic ? 'فشل تحديث حالة البلاغ.' : 'Failed to update report status.',
    loadFailed: isArabic ? 'فشل تحميل البلاغات.' : 'Failed to load reports.',
  }

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('user_reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message || text.loadFailed)
    } else {
      setReports(data || [])
    }

    setLoading(false)
  }

  const handleStatusChange = async (id, status) => {
    setError('')

    const { error } = await supabase
      .from('user_reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      setError(error.message || text.updateFailed)
      return
    }

    await loadReports()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h1>

          <p className="text-sm text-stone-500 mt-1 leading-relaxed" dir="auto">
            {text.subtitle}
          </p>
        </div>

        <button onClick={loadReports} className="btn-outline shrink-0">
          {text.refresh}
        </button>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5"
          dir="auto"
        >
          {error}
        </div>
      )}

      <div className="card p-4 sm:p-6 min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-stone-500 border-b border-stone-100">
                <th className="text-start pb-3 font-medium">{text.type}</th>
                <th className="text-start pb-3 font-medium">{text.message}</th>
                <th className="text-start pb-3 font-medium">{text.status}</th>
                <th className="text-start pb-3 font-medium">{text.date}</th>
                <th className="text-start pb-3 font-medium">{text.action}</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-400" dir="auto">
                    {text.noReports}
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-stone-50 last:border-0 align-top"
                  >
                    <td className="py-3.5 text-stone-700" dir="auto">
                      {getReportTypeLabel(report.report_type, lang)}
                    </td>

                    <td className="py-3.5 text-stone-600 max-w-md leading-relaxed" dir="auto">
                      {report.message}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(
                          report.status
                        )}`}
                        dir="auto"
                      >
                        {getStatusLabel(report.status, lang)}
                      </span>
                    </td>

                    <td className="py-3.5 text-stone-500 whitespace-nowrap" dir="auto">
                      {formatDate(report.created_at, lang)}
                    </td>

                    <td className="py-3.5">
                      <select
                        className="border border-[#DDD8C8] rounded-lg px-2 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E]"
                        value={report.status}
                        onChange={(e) =>
                          handleStatusChange(report.id, e.target.value)
                        }
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        <option value="pending">{text.pending}</option>
                        <option value="reviewed">{text.reviewed}</option>
                        <option value="resolved">{text.resolved}</option>
                        <option value="dismissed">{text.dismissed}</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-stone-400 mt-3" dir="auto">
          {reports.length} {isArabic ? 'بلاغ' : 'reports'}
        </p>
      </div>
    </div>
  )
}
```

---

## `pages/AdminAnalytics.jsx`

```jsx
import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'

const CITY_LABELS_AR = {
  Riyadh: 'الرياض',
  Diriyah: 'الدرعية',
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
  Buraidah: 'بريدة',
  Jubail: 'الجبيل',
  'Al-Baha': 'الباحة',
  Sakaka: 'سكاكا',
  'Hafar Al-Batin': 'حفر الباطن',
  KAEC: 'مدينة الملك عبدالله الاقتصادية',
}

const STATUS_LABELS_AR = {
  pending: 'قيد الانتظار',
  reviewed: 'تمت المراجعة',
  resolved: 'تم الحل',
  dismissed: 'تم التجاهل',
  active: 'نشط',
  inactive: 'غير نشط',
}

const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

const COLORS = ['#006A4E', '#D4AF37', '#004D39', '#B89122', '#6FAE9B', '#DDD8C8']

function getCityLabel(city, lang) {
  if (!city) return lang === 'ar' ? 'غير محدد' : 'Unknown'
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
}

function getStatusLabel(status, lang) {
  if (!status) return lang === 'ar' ? 'غير محدد' : 'Unknown'
  return lang === 'ar' ? STATUS_LABELS_AR[status] || status : status
}

function getCategoryLabel(category, lang) {
  if (!category) return lang === 'ar' ? 'غير محدد' : 'Unknown'
  return lang === 'ar' ? CATEGORY_LABELS_AR[category] || category : category
}

function countByField(items, field, labelFormatter) {
  const counts = {}

  items.forEach((item) => {
    const key = item[field] || 'Unknown'
    counts[key] = (counts[key] || 0) + 1
  })

  return Object.entries(counts).map(([key, value]) => ({
    name: labelFormatter(key),
    value,
  }))
}

export default function AdminAnalytics() {
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const text = {
    title: isArabic ? 'تحليلات النظام' : 'Analytics',
    subtitle: isArabic
      ? 'رسوم بيانية وإحصاءات توضح نشاط شواف.'
      : 'Charts and insights for Shawaf system activity.',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    tripsByCity: isArabic ? 'الرحلات حسب المدينة' : 'Trips by City',
    attractionsByCity: isArabic ? 'المعالم حسب المدينة' : 'Attractions by City',
    attractionsByCategory: isArabic ? 'المعالم حسب التصنيف' : 'Attractions by Category',
    reportsByStatus: isArabic ? 'البلاغات حسب الحالة' : 'Reports by Status',
    noData: isArabic ? 'لا توجد بيانات' : 'No data available',
  }

  const [tripsByCity, setTripsByCity] = useState([])
  const [attractionsByCity, setAttractionsByCity] = useState([])
  const [attractionsByCategory, setAttractionsByCategory] = useState([])
  const [reportsByStatus, setReportsByStatus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalytics()
  }, [lang])

  const loadAnalytics = async () => {
    setLoading(true)
    setError('')

    const [tripsRes, attractionsRes, reportsRes] = await Promise.all([
      supabase.from('trips').select('city, ai_plan'),
      supabase.from('attractions').select('city, category, status'),
      supabase.from('user_reports').select('status'),
    ])

    if (tripsRes.error || attractionsRes.error || reportsRes.error) {
      setError(
        tripsRes.error?.message ||
          attractionsRes.error?.message ||
          reportsRes.error?.message ||
          'Failed to load analytics'
      )
      setLoading(false)
      return
    }

    const normalizedTrips = (tripsRes.data || []).map((trip) => {
      const firstCity =
        trip.ai_plan?.cities?.[0] ||
        trip.city?.split('→')?.[0]?.trim() ||
        trip.city

      return {
        city: firstCity,
      }
    })

    setTripsByCity(
      countByField(normalizedTrips, 'city', (city) => getCityLabel(city, lang))
    )

    setAttractionsByCity(
      countByField(attractionsRes.data || [], 'city', (city) =>
        getCityLabel(city, lang)
      )
    )

    setAttractionsByCategory(
      countByField(attractionsRes.data || [], 'category', (category) =>
        getCategoryLabel(category, lang)
      )
    )

    setReportsByStatus(
      countByField(reportsRes.data || [], 'status', (status) =>
        getStatusLabel(status, lang)
      )
    )

    setLoading(false)
  }

  const renderEmpty = () => (
    <div className="h-64 flex items-center justify-center text-stone-400 text-sm text-center px-4">
      {text.noData}
    </div>
  )

  const renderBarChart = (data) => {
    if (!data.length) return renderEmpty()

    return (
      <div className="h-64 sm:h-72 w-full min-w-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDD8C8" />
            <XAxis dataKey="name" stroke="#78716c" tick={{ fontSize: 11 }} />
            <YAxis stroke="#78716c" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#006A4E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderPieChart = (data) => {
    if (!data.length) return renderEmpty()

    return (
      <div className="h-64 sm:h-72 w-full min-w-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]" dir="auto">
            {text.title}
          </h1>

          <p className="text-sm text-stone-500 mt-1 leading-relaxed" dir="auto">
            {text.subtitle}
          </p>
        </div>

        <button onClick={loadAnalytics} className="btn-outline shrink-0">
          {text.refresh}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5" dir="auto">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.tripsByCity}
          </h2>
          {renderBarChart(tripsByCity)}
        </div>

        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.attractionsByCity}
          </h2>
          {renderBarChart(attractionsByCity)}
        </div>

        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.attractionsByCategory}
          </h2>
          {renderPieChart(attractionsByCategory)}
        </div>

        <div className="card p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold text-[#333333] mb-5" dir="auto">
            {text.reportsByStatus}
          </h2>
          {renderPieChart(reportsByStatus)}
        </div>
      </div>
    </div>
  )
}
```

---

## `planner/StepOne.jsx`

```jsx
import { useLang } from '../context/LanguageContext'
import SelectionCard from '../components/SelectionCard'

const CITIES = [
  'Riyadh',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Al-Khobar',
  'Dhahran',
  'Al-Ahsa',
  'Al-Ula',
  'NEOM',
  'Abha',
  'Taif',
  'Yanbu',
  'Tabuk',
  'Hail',
  'Najran',
  'Jizan',
  'Diriyah',
  'Buraidah',
  'Jubail',
  'Al-Baha',
  'Sakaka',
  'Hafar Al-Batin',
  'KAEC',
]

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

const TRIP_TYPES = [
  { key: 'cultural', emoji: '🏛️' },
  { key: 'adventure', emoji: '⛰️' },
  { key: 'relaxation', emoji: '🌴' },
  { key: 'religious', emoji: '🕌' },
  { key: 'business', emoji: '💼' },
  { key: 'family', emoji: '👨‍👩‍👧' },
]

function getCityLabel(city, lang) {
  if (!city) return ''
  return lang === 'ar' ? CITY_LABELS_AR[city] || city : city
}

function daysBetween(start, end) {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

function getTodayInputValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function StepOne({ data, onChange, onNext }) {
  const { t, lang } = useLang()
  const isArabic = lang === 'ar'
  const todayInputValue = getTodayInputValue()

  const selectedCities = data.cities?.length
    ? data.cities
    : data.city
    ? [data.city]
    : []

  const days = daysBetween(data.startDate, data.endDate)

  const text = {
    destinationCity: isArabic ? 'مدينة الوجهة' : 'Destination City',
    chooseCity: isArabic ? 'اختر مدينة...' : 'Choose a city...',
    selectedCities: isArabic ? 'المدن المختارة' : 'Selected Cities',
    multiCityHint: isArabic
      ? 'يمكنك اختيار مدينة واحدة أو أكثر للرحلة. سيتم ترتيب الرحلة حسب ترتيب اختيارك.'
      : 'You can choose one or more cities. The trip will follow the order you select.',
    removeCity: isArabic ? 'حذف المدينة' : 'Remove city',
    alreadySelected: isArabic
      ? 'هذه المدينة مختارة بالفعل.'
      : 'This city is already selected.',
    cityRequired: isArabic
      ? 'الرجاء اختيار مدينة واحدة على الأقل.'
      : 'Please select at least one destination city.',
    datesRequired: isArabic
      ? 'الرجاء اختيار تاريخ البداية والنهاية.'
      : 'Please select start and end dates.',
    oldStartDate: isArabic
      ? 'لا يمكن اختيار تاريخ بداية قديم.'
      : 'Start date cannot be in the past.',
    tripTypeRequired: isArabic
      ? 'الرجاء اختيار نوع الرحلة.'
      : 'Please select a trip type.',
    daysLessThanCities: isArabic
      ? 'عدد الأيام يجب أن يكون مساويًا أو أكثر من عدد المدن المختارة.'
      : 'The number of days should be at least the number of selected cities.',
  }

  const addCity = (city) => {
    if (!city) return

    if (selectedCities.includes(city)) {
      alert(text.alreadySelected)
      return
    }

    const updatedCities = [...selectedCities, city]

    onChange({
      cities: updatedCities,
      city: updatedCities[0] || '',
    })
  }

  const removeCity = (city) => {
    const updatedCities = selectedCities.filter((item) => item !== city)

    onChange({
      cities: updatedCities,
      city: updatedCities[0] || '',
    })
  }

  const handleNext = () => {
    if (!selectedCities.length) {
      alert(text.cityRequired)
      return
    }

    if (!data.startDate || !data.endDate) {
      alert(text.datesRequired)
      return
    }

    if (data.startDate < todayInputValue) {
      alert(text.oldStartDate)
      return
    }

    if (days > 0 && selectedCities.length > days) {
      alert(text.daysLessThanCities)
      return
    }

    if (!data.tripType) {
      alert(text.tripTypeRequired)
      return
    }

    onNext()
  }

  return (
    <div className="card w-full p-5 sm:p-8 overflow-hidden">
      <div className="mb-7 text-start">
        <h2
          className="text-xl sm:text-2xl font-bold text-[#333333] mb-1 leading-tight"
          dir="auto"
        >
          {t('planNewTrip')}
        </h2>

        <p
          className="text-sm sm:text-base text-stone-500 leading-relaxed"
          dir="auto"
        >
          {t('step1Sub')}
        </p>
      </div>

      {/* Destination City Dropdown */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#333333] mb-2">
          <span className="text-[#006A4E]">📍</span>
          <span dir="auto">{text.destinationCity}</span>
        </label>

        <p className="text-xs text-stone-400 mb-3 leading-relaxed" dir="auto">
          {text.multiCityHint}
        </p>

        <div className="relative">
          <select
            className="input-field appearance-none pe-10 ps-4 text-sm sm:text-base min-h-[52px]"
            value=""
            onChange={(e) => addCity(e.target.value)}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <option value="">{text.chooseCity}</option>

            {CITIES.map((city) => (
              <option key={city} value={city}>
                {getCityLabel(city, lang)}
              </option>
            ))}
          </select>

          <svg
            className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {selectedCities.length > 0 && (
          <div className="mt-4 bg-[#F5F5F0] border border-[#DDD8C8] rounded-2xl p-3">
            <div
              className="text-xs font-semibold text-stone-500 mb-2"
              dir="auto"
            >
              {text.selectedCities}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedCities.map((city, index) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-2 bg-white border border-[#D4AF37]/40 text-[#006A4E] rounded-full px-3 py-1.5 text-xs font-medium"
                  dir="auto"
                >
                  <span>
                    {index + 1}. {getCityLabel(city, lang)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    className="text-stone-400 hover:text-red-500"
                    aria-label={text.removeCity}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
        <div className="min-w-0">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#333333] mb-2">
            <span>📅</span>
            <span dir="auto">{t('startDate')}</span>
          </label>

          <input
            type="date"
            className="block w-full h-14 min-h-0 max-w-full rounded-2xl border border-[#DDD8C8] bg-white px-4 py-0 text-base leading-none text-[#333333] shadow-none outline-none transition-colors focus:border-[#006A4E] focus:ring-2 focus:ring-[#006A4E]/15"
            style={{ WebkitAppearance: 'none', appearance: 'none' }}
            value={data.startDate}
            min={todayInputValue}
            onChange={(e) =>
              onChange({
                startDate: e.target.value,
                endDate:
                  data.endDate && data.endDate < e.target.value ? '' : data.endDate,
              })
            }
          />
        </div>

        <div className="min-w-0">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#333333] mb-2">
            <span>📅</span>
            <span dir="auto">{t('endDate')}</span>
          </label>

          <input
            type="date"
            className="block w-full h-14 min-h-0 max-w-full rounded-2xl border border-[#DDD8C8] bg-white px-4 py-0 text-base leading-none text-[#333333] shadow-none outline-none transition-colors focus:border-[#006A4E] focus:ring-2 focus:ring-[#006A4E]/15"
            style={{ WebkitAppearance: 'none', appearance: 'none' }}
            value={data.endDate}
            min={data.startDate || todayInputValue}
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </div>
      </div>

      {days > 0 && (
        <div
          className="mb-5 bg-[#E6F2EE] border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-[#006A4E] font-medium leading-relaxed"
          dir="auto"
        >
          {t('tripDayCount', days)}
        </div>
      )}

      {/* Number of People */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#333333] mb-3">
          <span>👥</span>
          <span dir="auto">{t('numberOfPeople')}</span>
        </label>

        <div className="flex items-center justify-center sm:justify-start gap-4">
          <button
            type="button"
            onClick={() =>
              onChange({
                numberOfPeople: Math.max(1, data.numberOfPeople - 1),
              })
            }
            className="w-11 h-11 border-2 border-stone-200 rounded-full text-stone-600 font-bold text-xl flex items-center justify-center hover:border-[#D4AF37] hover:text-[#006A4E] transition-colors"
            aria-label={
              isArabic ? 'تقليل عدد الأشخاص' : 'Decrease number of people'
            }
          >
            -
          </button>

          <span className="text-2xl font-bold text-[#333333] w-10 text-center">
            {data.numberOfPeople}
          </span>

          <button
            type="button"
            onClick={() =>
              onChange({
                numberOfPeople: Math.min(20, data.numberOfPeople + 1),
              })
            }
            className="w-11 h-11 border-2 border-stone-200 rounded-full text-stone-600 font-bold text-xl flex items-center justify-center hover:border-[#D4AF37] hover:text-[#006A4E] transition-colors"
            aria-label={
              isArabic ? 'زيادة عدد الأشخاص' : 'Increase number of people'
            }
          >
            +
          </button>
        </div>
      </div>

      {/* Trip Type */}
      <div className="mb-8">
        <label
          className="text-sm font-semibold text-[#333333] block mb-3"
          dir="auto"
        >
          {t('tripType')}
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
        type="button"
        onClick={handleNext}
        className="w-full btn-primary justify-center py-4 rounded-2xl text-sm sm:text-base"
      >
        {t('configureTrip')}
      </button>
    </div>
  )
}

```

---

## `planner/StepTwo.jsx`

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
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
    <div className="card p-5 sm:p-6 mb-4">
      <h3 className="flex items-center gap-2 font-semibold text-[#333333] text-base mb-4" dir="auto">
        <span className="text-[#006A4E]">{icon}</span>
        {title}
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
    <div className="card p-6 sm:p-8 text-center overflow-hidden relative">
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

        <h3 className="text-xl font-bold text-[#333333] mb-2" dir="auto">
          {isArabic ? 'جاري توليد خطة الرحلة' : 'Generating Your Itinerary'}
        </h3>

        <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed min-h-[44px]" dir="auto">
          {messages[messageIndex]}
        </p>

        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 bg-[#006A4E] rounded-full animate-pulse" />
            <span className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full animate-pulse [animation-delay:200ms]" />
            <span className="w-2.5 h-2.5 bg-[#006A4E]/50 rounded-full animate-pulse [animation-delay:400ms]" />
          </div>
        </div>

        <div className="mt-6 bg-[#FBF6E3] border border-[#D4AF37]/40 rounded-2xl px-4 py-3 text-xs text-[#6B571B]" dir="auto">
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
        preferredTime: 'No Preference',
        notes: notesParts.join(' | '),
        numberOfPeople: data.numberOfPeople,
        accommodation: 'Not specified',
        tripType: data.tripType || 'Leisure',
        lang,
      }

      const { data: result, error: fnError } = await supabase.functions.invoke(
        'Generate-trip',
        {
          body: payload,
        }
      )

      if (fnError) {
        throw new Error(fnError.message || text.requestFailed)
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
    <div className="w-full overflow-hidden">
      <div className="bg-[#E6F2EE] border border-[#D4AF37]/40 rounded-2xl p-4 sm:p-5 mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-[#006A4E] mb-3" dir="auto">
          <span>🗺️</span> {t('tripSummary')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="sm:col-span-2">
            <span className="text-stone-500">{t('destinationCityLabel')}</span>{' '}
            <strong className="text-[#333333]" dir="auto">
              {cityDisplay}
            </strong>
          </div>

          <div>
            <span className="text-stone-500">{t('startDateLabel')}</span>{' '}
            <strong className="text-[#333333]">{data.startDate}</strong>
          </div>

          <div>
            <span className="text-stone-500">{t('endDateLabel')}</span>{' '}
            <strong className="text-[#333333]">{data.endDate}</strong>
          </div>

          <div>
            <span className="text-stone-500">{t('numberOfPeopleLabel')}</span>{' '}
            <strong className="text-[#333333]">{data.numberOfPeople}</strong>
          </div>

          <div>
            <span className="text-stone-500">{text.days}:</span>{' '}
            <strong className="text-[#333333]">{days}</strong>
          </div>
        </div>

        {selectedCities.length > 1 && (
          <div className="mt-3 text-xs text-[#006A4E] bg-white border border-[#D4AF37]/35 rounded-xl px-3 py-2" dir="auto">
            {text.multiCityRoute}{' '}
            <strong>{cityDisplay}</strong>
          </div>
        )}
      </div>

      <Section icon="💵" title={t('budgetRange')}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        <p className="text-xs text-stone-400 mb-3" dir="auto">
          {t('selectAllInterest')}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
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

      <div className="card p-5 sm:p-6 mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-[#333333] text-base mb-3" dir="auto">
          <span className="text-[#006A4E]">📝</span> {t('additionalNotes')}
        </h3>

        <textarea
          className="input-field resize-none h-24"
          placeholder={t('notesPlaceholder')}
          value={data.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
          dir="auto"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4" dir="auto">
          {error}
        </div>
      )}

      {!canGenerate && (
        <div className="bg-[#FBF6E3] border border-[#D4AF37]/40 text-[#6B571B] px-4 py-3 rounded-xl text-sm mb-4" dir="auto">
          {text.validation}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onBack} className="btn-outline sm:flex-shrink-0 justify-center">
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

```

---

## `planner/StepThree.jsx`

```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { exportItineraryPdf } from '../utils/exportItineraryPdf'
import * as itineraryDisplay from '../utils/itineraryDisplay'

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

const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

function daysBetween(start, end) {
  if (!start || !end) return 1
  const diff = new Date(end) - new Date(start)
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

function getCityLabel(city, lang) {
  return itineraryDisplay.getCityLabel(city, lang)
}

function getCategoryLabel(category, lang) {
  return itineraryDisplay.getCategoryLabel(category, lang)
}

function getStationName(station, lang = 'en') {
  return itineraryDisplay.getStationName(station, lang)
}

function getStationDescription(station, lang = 'en') {
  return itineraryDisplay.getStationDescription(station, lang)
}

function getStationLat(station) {
  const value = station?.lat ?? station?.latitude
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function getStationLng(station) {
  const value = station?.lng ?? station?.longitude
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function buildMapsUrl(station, city) {
  const lat = getStationLat(station)
  const lng = getStationLng(station)

  if (lat !== null && lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  const placeName = station?.name || station?.place_name || getStationName(station)
  const query = encodeURIComponent(`${placeName}, ${city}, Saudi Arabia`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function getStationsFromDay(day) {
  return itineraryDisplay.getStationsFromDay(day)
}

function attractionToStation(attraction, oldStation, index) {
  return {
    order: oldStation?.order || index + 1,
    id: attraction.id,
    place_name: attraction.name,
    name: attraction.name,
    name_en: attraction.name || null,
    name_ar: attraction.name_ar || null,
    address: `${attraction.name}, ${attraction.city}, Saudi Arabia`,
    time: oldStation?.time || '',
    description: attraction.description || oldStation?.description || '',
    description_en: attraction.description || oldStation?.description_en || '',
    description_ar:
      attraction.description_ar ||
      oldStation?.description_ar ||
      null,
    category: attraction.category,
    city: attraction.city,
    duration: attraction.estimated_duration
      ? `${Math.max(1, Math.round(Number(attraction.estimated_duration) / 60))} hours`
      : oldStation?.duration || '',
    lat: attraction.latitude,
    lng: attraction.longitude,
    latitude: attraction.latitude,
    longitude: attraction.longitude,
    opening_time: attraction.opening_time,
    closing_time: attraction.closing_time,
    estimated_duration: attraction.estimated_duration,
    price_range: attraction.price_range,
    availability_type: attraction.availability_type,
    source_url: attraction.source_url,
    source: 'database',
  }
}

export default function StepThree({ tripData, plan, onBack, onRegenerate }) {
  const { t, lang } = useLang()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const isArabic = lang === 'ar'

  const text = {
    regenerateDay: isArabic ? 'إعادة توليد اليوم' : 'Regenerate Day',
    regenerating: isArabic ? 'جاري التوليد...' : 'Regenerating...',
    editTime: isArabic ? 'تعديل الوقت' : 'Edit Time',
    replaceActivity: isArabic ? 'استبدال النشاط' : 'Replace Activity',
    replacing: isArabic ? 'جاري الاستبدال...' : 'Replacing...',
    removeActivity: isArabic ? 'حذف النشاط' : 'Remove Activity',
    openInMaps: isArabic ? 'فتح في خرائط Google' : t('openInMaps'),
    saved: isArabic ? 'تم الحفظ' : 'Saved',
    tripSaved: isArabic ? 'تم حفظ الرحلة بنجاح' : t('tripSaved'),
    savedSuccess: isArabic ? 'تم حفظ الرحلة بنجاح.' : 'Trip saved successfully.',
    removeConfirm: isArabic
      ? 'هل تريد حذف هذا النشاط من جدول الرحلة؟'
      : 'Remove this activity from the itinerary?',
    enterNewTime: isArabic ? 'أدخل الوقت الجديد:' : 'Enter the new time:',
    timeRequired: isArabic ? 'لا يمكن ترك الوقت فارغًا.' : 'Time cannot be empty.',
    mustSignIn: isArabic
      ? 'يجب تسجيل الدخول لحفظ الرحلة.'
      : 'You must be signed in to save this trip.',
    noReplacement: isArabic
      ? 'لم يتم العثور على بديل مناسب لهذه المدينة.'
      : 'No replacement attraction found for this city.',
    noRegeneratedDay: isArabic
      ? 'لم يتم إرجاع يوم جديد.'
      : 'No regenerated day was returned.',
    replaceFailed: isArabic ? 'فشل استبدال النشاط.' : 'Failed to replace activity.',
    regenerateFailed: isArabic ? 'فشل إعادة توليد هذا اليوم.' : 'Failed to regenerate this day.',
    saveFailed: isArabic ? 'فشل حفظ الرحلة.' : 'Failed to save trip',
    pdfFailed: isArabic
      ? 'فشل توليد ملف PDF. تأكد من وجود ملف الخط داخل public/fonts.'
      : 'Failed to generate PDF. Make sure the font file exists in public/fonts.',
  }

  const [localPlan, setLocalPlan] = useState(plan)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedTripId, setSavedTripId] = useState(null)
  const [busyAction, setBusyAction] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setLocalPlan(plan)
    setSaved(false)
    setSavedTripId(null)
    setError('')
  }, [plan])

  if (!localPlan) {
    return (
      <div className="card p-8 sm:p-12 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <p className="text-stone-500" dir="auto">
          {t('generating')}
        </p>
      </div>
    )
  }

  const days = daysBetween(tripData.startDate, tripData.endDate)
  const itinerary = localPlan.itinerary || localPlan.days || []

  const selectedCities =
    localPlan?.cities?.length
      ? localPlan.cities
      : tripData?.cities?.length
      ? tripData.cities
      : tripData?.city
      ? [tripData.city]
      : []

  const cityDisplay = selectedCities.length
    ? selectedCities.map((city) => getCityLabel(city, lang)).join(isArabic ? ' ← ' : ' → ')
    : getCityLabel(tripData.city, lang)

  const travelerName =
    profile?.full_name ||
    profile?.email?.split('@')[0] ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    ''

  const handleDownloadPDF = async () => {
    try {
      setError('')

      await exportItineraryPdf({
        tripData: {
          ...tripData,
          city: cityDisplay,
          cities: selectedCities,
          travelerName,
        },
        plan: localPlan,
        lang,
      })
    } catch (err) {
      console.error('PDF export error:', err)
      setError(text.pdfFailed)
    }
  }

  const updatePlanWithItinerary = (updatedItinerary) => {
    const updatedPlan = {
      ...localPlan,
      days: updatedItinerary,
      itinerary: updatedItinerary,
    }

    setLocalPlan(updatedPlan)
    setSaved(false)
    setSavedTripId(null)

    if (onRegenerate) {
      onRegenerate(updatedPlan)
    }
  }

  const getUsedStationNames = () => {
    return new Set(
      itinerary
        .flatMap((day) => getStationsFromDay(day))
        .map((station) =>
          normalize(station?.name || station?.place_name || getStationName(station))
        )
    )
  }

  const handleRemoveActivity = (dayIndex, stationIndex) => {
    const confirmed = confirm(text.removeConfirm)
    if (!confirmed) return

    const updatedItinerary = itinerary.map((day, currentDayIndex) => {
      if (currentDayIndex !== dayIndex) return day

      const stations = getStationsFromDay(day)
      const updatedStations = stations
        .filter((_, currentStationIndex) => currentStationIndex !== stationIndex)
        .map((station, index) => ({
          ...station,
          order: index + 1,
        }))

      return {
        ...day,
        stations: updatedStations,
      }
    })

    updatePlanWithItinerary(updatedItinerary)
  }

  const handleEditTime = (dayIndex, stationIndex) => {
    const stations = getStationsFromDay(itinerary[dayIndex])
    const station = stations[stationIndex]
    const currentTime = station?.time || ''

    const newTime = prompt(text.enterNewTime, currentTime)

    if (newTime === null) return

    if (!newTime.trim()) {
      setError(text.timeRequired)
      return
    }

    const updatedItinerary = itinerary.map((day, currentDayIndex) => {
      if (currentDayIndex !== dayIndex) return day

      const currentStations = getStationsFromDay(day)

      const updatedStations = currentStations.map((item, currentStationIndex) => {
        if (currentStationIndex !== stationIndex) return item

        return {
          ...item,
          time: newTime.trim(),
        }
      })

      return {
        ...day,
        stations: updatedStations,
      }
    })

    updatePlanWithItinerary(updatedItinerary)
  }

  const handleReplaceActivity = async (dayIndex, stationIndex) => {
    const day = itinerary[dayIndex]
    const stations = getStationsFromDay(day)
    const oldStation = stations[stationIndex]

    if (!oldStation) return

    const dayCity =
      day?.city ||
      oldStation?.city ||
      selectedCities[dayIndex] ||
      selectedCities[0] ||
      tripData.city

    const actionKey = `replace-${dayIndex}-${stationIndex}`

    setBusyAction(actionKey)
    setError('')

    try {
      const oldCategory = oldStation.category
      const usedNames = getUsedStationNames()

      let query = supabase
        .from('attractions')
        .select(
          'id, name, name_ar, city, category, description, description_ar, opening_time, closing_time, estimated_duration, latitude, longitude, price_range, availability_type, source_url, status'
        )
        .eq('status', 'active')
        .ilike('city', dayCity)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .limit(80)

      if (oldCategory) {
        query = query.eq('category', oldCategory)
      }

      let { data, error: dbError } = await query

      if (dbError) throw dbError

      let candidates = (data || []).filter((attraction) => {
        const candidateName = normalize(attraction.name)
        const oldName = normalize(
          oldStation?.name || oldStation?.place_name || getStationName(oldStation)
        )
        return candidateName !== oldName && !usedNames.has(candidateName)
      })

      if (candidates.length === 0 && oldCategory) {
        const fallback = await supabase
          .from('attractions')
          .select(
            'id, name, name_ar, city, category, description, description_ar, opening_time, closing_time, estimated_duration, latitude, longitude, price_range, availability_type, source_url, status'
          )
          .eq('status', 'active')
          .ilike('city', dayCity)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .limit(80)

        if (fallback.error) throw fallback.error

        candidates = (fallback.data || []).filter((attraction) => {
          const candidateName = normalize(attraction.name)
          const oldName = normalize(
            oldStation?.name || oldStation?.place_name || getStationName(oldStation)
          )
          return candidateName !== oldName && !usedNames.has(candidateName)
        })
      }

      if (candidates.length === 0) {
        throw new Error(`${text.noReplacement} ${getCityLabel(dayCity, lang)}`)
      }

      const replacement = candidates[Math.floor(Math.random() * candidates.length)]

      const updatedItinerary = itinerary.map((currentDay, currentDayIndex) => {
        if (currentDayIndex !== dayIndex) return currentDay

        const currentStations = getStationsFromDay(currentDay)

        const updatedStations = currentStations.map((station, currentStationIndex) => {
          if (currentStationIndex !== stationIndex) return station
          return attractionToStation(replacement, oldStation, currentStationIndex)
        })

        return {
          ...currentDay,
          stations: updatedStations,
        }
      })

      updatePlanWithItinerary(updatedItinerary)
    } catch (err) {
      console.error('Replace activity error:', err)
      setError(err.message || text.replaceFailed)
    } finally {
      setBusyAction('')
    }
  }

  const handleRegenerateDay = async (dayIndex) => {
    const day = itinerary[dayIndex]
    const dayCity = day?.city || selectedCities[dayIndex] || selectedCities[0] || tripData.city

    const currentDayPlaceNames = getStationsFromDay(day)
      .map((station) => station?.name || station?.place_name || station?.title || station?.place)
      .filter(Boolean)

    const actionKey = `regenerate-day-${dayIndex}`
    setBusyAction(actionKey)
    setError('')

    try {
      const payload = {
        city: dayCity,
        cities: [dayCity],
        budget: tripData.budget,
        days: 1,
        travelWith: tripData.travelWith || 'General',
        interests: tripData.interests || [],
        tripStyle: tripData.activityLevel,
        preferredTime: 'No Preference',
        notes: `${tripData.notes || ''} Regenerate only day ${
          dayIndex + 1
        } for ${dayCity}. Keep all activities in ${dayCity}. Do not repeat these current places: ${currentDayPlaceNames.join(
          ', '
        )}. Choose different attractions from the database if possible.`,
        numberOfPeople: tripData.numberOfPeople,
        accommodation: 'Not specified',
        tripType: 'Leisure',
        lang,
      }

      const { data: fnData, error: fnError } = await supabase.functions.invoke(
        'Generate-trip',
        {
          body: payload,
        }
      )

      if (fnError) throw fnError

      const newItinerary = fnData?.itinerary || fnData?.days || []
      const newDay = newItinerary[0]

      if (!newDay) {
        throw new Error(text.noRegeneratedDay)
      }

      const updatedDay = {
        ...newDay,
        day: dayIndex + 1,
        city: dayCity,
      }

      const updatedItinerary = itinerary.map((currentDay, currentDayIndex) => {
        if (currentDayIndex !== dayIndex) return currentDay
        return updatedDay
      })

      updatePlanWithItinerary(updatedItinerary)
    } catch (err) {
      console.error('Regenerate day error:', err)
      setError(err.message || text.regenerateFailed)
    } finally {
      setBusyAction('')
    }
  }

  const handleSave = async () => {
    if (saving || saved) return

    if (!user) {
      setError(text.mustSignIn)
      return
    }

    setSaving(true)
    setError('')

    try {
      const savedPlan = {
        ...localPlan,
        city: localPlan?.city || tripData.city,
        cities: selectedCities,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        numberOfPeople: tripData.numberOfPeople,
        budget: tripData.budget,
        travelerName,
      }

      const { data: insertedTrip, error: dbError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          city: cityDisplay,
          budget: tripData.budget,
          days,
          travel_with: tripData.travelWith || 'General',
          interests: tripData.interests || [],
          trip_style: tripData.activityLevel,
          notes: tripData.notes || '',
          ai_plan: savedPlan,
        })
        .select('id')
        .single()

      if (dbError) throw dbError

      setSavedTripId(insertedTrip?.id || null)
      setSaved(true)
    } catch (err) {
      console.error('Save trip error:', err)
      setError(err.message || text.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full overflow-hidden">
      <div id="trip-pdf" className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl overflow-hidden">
        <div className="bg-[#E6F2EE] border border-[#D4AF37]/40 rounded-2xl p-4 sm:p-5 mb-5">
          <h3 className="flex items-center gap-2 font-semibold text-[#006A4E] mb-3" dir="auto">
            <span>🗺️</span> {t('tripSummary')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="sm:col-span-2">
              <span className="text-stone-500">{t('destinationCityLabel')}</span>{' '}
              <strong className="text-[#333333]" dir="auto">
                {cityDisplay}
              </strong>
            </div>

            <div>
              <span className="text-stone-500">{t('startDateLabel')}</span>{' '}
              <strong className="text-[#333333]">{tripData.startDate}</strong>
            </div>

            <div>
              <span className="text-stone-500">{t('endDateLabel')}</span>{' '}
              <strong className="text-[#333333]">{tripData.endDate}</strong>
            </div>

            <div>
              <span className="text-stone-500">{t('numberOfPeopleLabel')}</span>{' '}
              <strong className="text-[#333333]">{tripData.numberOfPeople}</strong>
            </div>
          </div>
        </div>

        {itinerary.map((day, di) => {
          const dayCity = day?.city || selectedCities[di] || selectedCities[0] || tripData.city
          const dayCityLabel = getCityLabel(dayCity, lang)
          const dayTheme = itineraryDisplay.getDayTheme(day, lang)

          return (
            <div key={di} className="card p-4 sm:p-6 mb-4 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <h3 className="font-bold text-[#333333] text-base sm:text-lg flex items-center gap-2 flex-wrap">
                  <span className="w-8 h-8 bg-[#006A4E] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {di + 1}
                  </span>

                  <span dir="auto">
                    {t('day')} {di + 1}
                  </span>

                  {dayCityLabel && (
                    <span className="text-sm font-semibold text-[#006A4E]" dir="auto">
                      ({dayCityLabel})
                    </span>
                  )}

                  {dayTheme && (
                    <span className="text-sm font-normal text-stone-500 ms-1" dir="auto">
                      — {dayTheme}
                    </span>
                  )}
                </h3>

                <button
                  type="button"
                  onClick={() => handleRegenerateDay(di)}
                  disabled={busyAction === `regenerate-day-${di}`}
                  className="w-full sm:w-auto justify-center text-xs border border-[#D4AF37]/45 text-[#006A4E] hover:bg-[#FBF6E3] rounded-full px-3 py-2 transition-colors disabled:opacity-60"
                >
                  {busyAction === `regenerate-day-${di}`
                    ? text.regenerating
                    : `🔄 ${text.regenerateDay}`}
                </button>
              </div>

              <div className="space-y-4">
                {getStationsFromDay(day).map((station, si) => {
                  const stationName = getStationName(station, lang)
                  const stationDescription = getStationDescription(station, lang)
                  const stationCategory = getCategoryLabel(station.category, lang)
                  const replaceKey = `replace-${di}-${si}`

                  return (
                    <div
                      key={`${di}-${si}-${stationName}`}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-[#E6F2EE] text-[#006A4E] border border-[#D4AF37]/35 rounded-full flex items-center justify-center text-xs font-bold">
                        {si + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0">
                            <div
                              className="font-semibold text-[#333333] text-sm sm:text-base"
                              dir="auto"
                            >
                              {stationName}
                            </div>

                            {station.time && (
                              <div className="text-xs text-[#006A4E] font-medium mt-0.5" dir="auto">
                                {station.time}
                              </div>
                            )}

                            {stationCategory && (
                              <div className="text-xs text-stone-400 mt-0.5" dir="auto">
                                {stationCategory}
                              </div>
                            )}
                          </div>

                          <a
                            href={buildMapsUrl(station, dayCity)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto justify-center flex-shrink-0 text-xs text-[#006A4E] hover:text-[#004D39] border border-[#D4AF37]/45 rounded-lg px-3 py-2 flex items-center gap-1 transition-colors hover:bg-[#FBF6E3]"
                            dir="auto"
                          >
                            📍 {text.openInMaps}
                          </a>
                        </div>

                        {stationDescription && (
                          <p
                            className="text-sm text-stone-500 mt-2 leading-relaxed"
                            dir="auto"
                          >
                            {stationDescription}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => handleEditTime(di, si)}
                            className="text-xs border border-stone-200 text-stone-600 hover:border-[#D4AF37] hover:text-[#006A4E] rounded-full px-3 py-2 transition-colors"
                          >
                            ✏️ {text.editTime}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReplaceActivity(di, si)}
                            disabled={busyAction === replaceKey}
                            className="text-xs border border-stone-200 text-stone-600 hover:border-[#D4AF37] hover:text-[#006A4E] rounded-full px-3 py-2 transition-colors disabled:opacity-60"
                          >
                            {busyAction === replaceKey
                              ? text.replacing
                              : `🔁 ${text.replaceActivity}`}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(di, si)}
                            className="text-xs border border-red-200 text-red-500 hover:bg-red-50 rounded-full px-3 py-2 transition-colors"
                          >
                            🗑️ {text.removeActivity}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 mt-4" dir="auto">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-[#E6F2EE] border border-[#006A4E]/20 text-[#006A4E] px-4 py-3 rounded-xl text-sm mb-4 mt-4" dir="auto">
          ✓ {text.tripSaved}
          {savedTripId && (
            <span className="text-xs block mt-1 text-[#006A4E]/80">
              {text.savedSuccess}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <button onClick={onBack} className="btn-outline justify-center">
          {t('backToPlanner')}
        </button>

        <button
          onClick={handleDownloadPDF}
          className="btn-outline justify-center flex items-center gap-2"
        >
          📄 {t('generatePDF')}
        </button>

        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="btn-primary justify-center flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            '✓'
          ) : (
            '💾'
          )}{' '}
          {saving ? t('saving') : saved ? text.saved : t('saveTrip')}
        </button>
      </div>

      <div className="card p-4 sm:p-5 mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-[#333333]" dir="auto">
            🗺️ {t('mapTitle')}
          </div>
          <div className="text-sm text-stone-500 mt-0.5" dir="auto">
            {cityDisplay}
          </div>
        </div>

        <button
          onClick={() => {
            sessionStorage.setItem(
              'currentTrip',
              JSON.stringify({
                tripData: { ...tripData, city: cityDisplay, cities: selectedCities },
                plan: localPlan,
              })
            )
            navigate('/map')
          }}
          className="btn-primary text-sm py-2 px-4 justify-center"
        >
          {t('map')} {isArabic ? '←' : '→'}
        </button>
      </div>
    </div>
  )
}

```

---

## `utils/itineraryDisplay.js`

```js
export const CITY_LABELS_AR = {
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

export const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

export const BUDGET_LABELS_AR = {
  Budget: 'اقتصادي',
  Moderate: 'متوسط',
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

export const STYLE_LABELS_AR = {
  Low: 'خفيف',
  Moderate: 'متوسط',
  High: 'مكثف',
}

const AR_CITY_TO_EN = Object.fromEntries(
  Object.entries(CITY_LABELS_AR).map(([en, ar]) => [ar, en])
)

const KNOWN_AR_TO_EN = {
  'استكشاف التاريخ والثقافة': 'History and Culture',
  'استكشاف ثقافي في جدة': 'Cultural Discovery in Jeddah',
  'استكشاف سريع': 'Quick Discovery',
  'المتحف الوطني السعودي': 'National Museum of Saudi Arabia',
  البلد: 'Al-Balad',
  'واجهة جدة البحرية': 'Jeddah Waterfront',
  'حي الطريف في الدرعية': 'At-Turaif District',
  'بوليفارد رياض سيتي': 'Boulevard Riyadh City',
}

export function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function hasArabicText(value) {
  return /[\u0600-\u06FF]/.test(String(value || ''))
}

function isPresent(value) {
  return value !== null && value !== undefined && cleanText(value) !== ''
}

function titleCase(value) {
  const text = cleanText(value)
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

function findLabel(labels, value) {
  const normalized = cleanText(value).toLowerCase()
  const entry = Object.entries(labels).find(
    ([key]) => key.toLowerCase() === normalized
  )

  return entry || null
}

export function getCityKey(city) {
  const clean = cleanText(city)
  if (!clean) return ''

  if (CITY_LABELS_AR[clean]) return clean
  if (AR_CITY_TO_EN[clean]) return AR_CITY_TO_EN[clean]

  const firstPart = clean
    .split(/[→←]/)
    .map((item) => item.trim())
    .filter(Boolean)[0]

  if (CITY_LABELS_AR[firstPart]) return firstPart
  if (AR_CITY_TO_EN[firstPart]) return AR_CITY_TO_EN[firstPart]

  return clean
}

export function getCityLabel(city, lang = 'en') {
  const key = getCityKey(city)
  if (!key) return ''

  return lang === 'ar' ? CITY_LABELS_AR[key] || city : key
}

export function getCategoryLabel(category, lang = 'en') {
  if (!category) return ''

  const matchedCategory = findLabel(CATEGORY_LABELS_AR, category)

  if (lang === 'ar') {
    return matchedCategory?.[1] || category
  }

  return matchedCategory?.[0] || titleCase(category)
}

export function getBudgetLabel(budget, lang = 'en') {
  if (!budget) return ''

  const matchedBudget = findLabel(BUDGET_LABELS_AR, budget)

  if (lang === 'ar') {
    return matchedBudget?.[1] || budget
  }

  return matchedBudget?.[0] || budget
}

export function getStyleLabel(style, lang = 'en') {
  if (!style) return ''

  const matchedStyle = findLabel(STYLE_LABELS_AR, style)

  if (lang === 'ar') {
    return matchedStyle?.[1] || style
  }

  return matchedStyle?.[0] || style
}

export function translateKnownArabicText(value) {
  const text = cleanText(value)
  if (!text) return ''

  if (KNOWN_AR_TO_EN[text]) return KNOWN_AR_TO_EN[text]

  if (text.includes('المتحف الوطني السعودي')) {
    return 'The National Museum of Saudi Arabia presents the history of the Arabian Peninsula in a clear cultural setting, making it a strong start to the day.'
  }

  if (text.includes('البلد')) {
    return 'Al-Balad is a historic district with traditional architecture and lively heritage streets, making it a memorable cultural stop.'
  }

  return ''
}

export function getEnglishTextOrFallback(values, fallback = '') {
  const englishValue = values.find(
    (value) => isPresent(value) && !hasArabicText(value)
  )

  if (englishValue) return englishValue

  const translatedValue = values
    .map((value) => translateKnownArabicText(value))
    .find((value) => isPresent(value))

  return translatedValue || fallback
}

export function getStationName(station, lang = 'en') {
  if (lang === 'ar') {
    return (
      station?.name_ar ||
      station?.arabic_name ||
      station?.place_name_ar ||
      station?.title_ar ||
      station?.name ||
      station?.place_name ||
      station?.place ||
      station?.title ||
      'معلم'
    )
  }

  return getEnglishTextOrFallback(
    [
      station?.name_en,
      station?.english_name,
      station?.place_name_en,
      station?.title_en,
      station?.name,
      station?.place_name,
      station?.place,
      station?.title,
      station?.name_ar,
    ],
    'Attraction'
  )
}

export function getStationDescription(station, lang = 'en') {
  if (lang === 'ar') {
    return (
      station?.description_ar ||
      station?.arabic_description ||
      station?.desc_ar ||
      station?.description ||
      station?.desc ||
      ''
    )
  }

  return getEnglishTextOrFallback(
    [
      station?.description_en,
      station?.english_description,
      station?.desc_en,
      station?.description,
      station?.desc,
      station?.description_ar,
      station?.arabic_description,
      station?.desc_ar,
    ],
    ''
  )
}

export function getDayTheme(day, lang = 'en') {
  if (lang === 'ar') {
    return day?.theme_ar || day?.arabic_theme || day?.theme || ''
  }

  return getEnglishTextOrFallback(
    [day?.theme_en, day?.english_theme, day?.theme, day?.theme_ar],
    ''
  )
}

export function getStationsFromDay(day) {
  return day?.stations || day?.activities || []
}

export function splitCityRoute(city) {
  return String(city || '')
    .split(/[→←]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function getTripCities(trip, plan = trip?.ai_plan) {
  if (Array.isArray(plan?.cities) && plan.cities.length) return plan.cities
  if (Array.isArray(trip?.cities) && trip.cities.length) return trip.cities
  if (trip?.city) return splitCityRoute(trip.city)
  if (plan?.city) return [plan.city]

  return []
}

export function getCitiesDisplay(trip, lang = 'en', plan = trip?.ai_plan) {
  const cities = getTripCities(trip, plan)

  if (!cities.length) return ''

  return cities
    .map((city) => getCityLabel(city, lang))
    .join(lang === 'ar' ? ' ← ' : ' → ')
}

```

---

## `utils/exportItineraryPdf.js`

```js
import { jsPDF } from 'jspdf'
import * as itineraryDisplay from './itineraryDisplay'

const PUBLIC_BASE_URL = import.meta.env.BASE_URL || '/'

const ARABIC_FONT_PATH = `${PUBLIC_BASE_URL}fonts/NotoNaskhArabic-Regular.ttf`
const ARABIC_FONT_FILE = 'NotoNaskhArabic-Regular.ttf'
const ARABIC_FONT_NAME = 'NotoNaskhArabic'

const LOGO_PATH = `${PUBLIC_BASE_URL}brand/shawaf-logo.png`

const BRAND = {
  green: [0, 106, 78],
  greenDark: [0, 77, 57],
  greenSoft: [230, 242, 238],
  gold: [212, 175, 55],
  goldSoft: [251, 246, 227],
  offWhite: [245, 245, 240],
  charcoal: [51, 51, 51],
  muted: [120, 113, 108],
  border: [221, 216, 200],
  white: [255, 255, 255],
}

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

const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

const BUDGET_LABELS_AR = {
  Budget: 'اقتصادي',
  Moderate: 'متوسط',
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

const KNOWN_AR_TO_EN = {
  'استكشاف التاريخ والثقافة': 'History and Culture',
  'استكشاف ثقافي في جدة': 'Cultural Discovery in Jeddah',
  'استكشاف سريع': 'Quick Discovery',
  'المتحف الوطني السعودي': 'National Museum of Saudi Arabia',
  البلد: 'Al-Balad',
  'واجهة جدة البحرية': 'Jeddah Waterfront',
  'حي الطريف في الدرعية': 'At-Turaif District',
  'بوليفارد رياض سيتي': 'Boulevard Riyadh City',
}

let cachedArabicFontBase64 = null
let cachedLogoDataUrl = null
let arabicFontLoaded = false

function getActiveLang(lang) {
  return (
    lang ||
    localStorage.getItem('lang') ||
    document.documentElement.getAttribute('lang') ||
    'en'
  )
}

function isArabicLang(lang) {
  return getActiveLang(lang) === 'ar'
}

function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasArabicText(value) {
  return /[\u0600-\u06FF]/.test(String(value || ''))
}

function isPresent(value) {
  return value !== null && value !== undefined && cleanText(value) !== ''
}

function firstText(...values) {
  const value = values.find((item) => isPresent(item))
  return value === undefined ? '' : value
}

function translateKnownArabicText(value) {
  const text = cleanText(value)
  if (!text) return ''

  if (KNOWN_AR_TO_EN[text]) return KNOWN_AR_TO_EN[text]

  if (text.includes('المتحف الوطني السعودي')) {
    return 'The National Museum of Saudi Arabia presents the history of the Arabian Peninsula in a clear cultural setting, making it a strong start to the day.'
  }

  if (text.includes('البلد')) {
    return 'Al-Balad is a historic district with traditional architecture and lively heritage streets, making it a memorable cultural stop.'
  }

  return ''
}

function getEnglishTextOrFallback(values, fallback = '') {
  const englishValue = values.find((value) => isPresent(value) && !hasArabicText(value))
  if (englishValue) return englishValue

  const translatedValue = values
    .map((value) => translateKnownArabicText(value))
    .find((value) => isPresent(value))

  return translatedValue || fallback
}

function getTripDaysValue(tripData, plan) {
  const candidates = [
    tripData?.days,
    tripData?.dayCount,
    tripData?.totalDays,
    plan?.dayCount,
    plan?.totalDays,
    plan?.tripDays,
  ]

  const value = candidates.find((item) => isPresent(item) && !Array.isArray(item))
  return value || ''
}

function getCityLabel(city, lang) {
  return itineraryDisplay.getCityLabel(city, getActiveLang(lang))
}

function getCategoryLabel(category, lang) {
  return itineraryDisplay.getCategoryLabel(category, getActiveLang(lang))
}

function getBudgetLabel(budget, lang) {
  return itineraryDisplay.getBudgetLabel(budget, getActiveLang(lang))
}

function getStationsFromDay(day) {
  return itineraryDisplay.getStationsFromDay(day)
}

function getStationName(station, lang) {
  return itineraryDisplay.getStationName(station, getActiveLang(lang))
}

function getStationDescription(station, lang) {
  return itineraryDisplay.getStationDescription(station, getActiveLang(lang))
}

function getStationFallbackDescription(stationName, stationCategory, dayCity, lang) {
  const place = cleanText(stationName)
  const category = cleanText(stationCategory)
  const city = cleanText(dayCity)

  if (isArabicLang(lang)) {
    if (place && city) {
      return `${place} محطة مقترحة في ${city} تمنحك تجربة مناسبة داخل مسار اليوم، مع وقت كاف للاستكشاف والتقاط التفاصيل التي تميز المكان.`
    }

    if (place) {
      return `${place} محطة مقترحة في جدولك، مناسبة للاستكشاف الهادئ وإضافة تجربة مميزة إلى رحلتك.`
    }

    return category
      ? `محطة ${category} مناسبة ضمن جدولك، تضيف تنوعًا لطيفًا لتجربة الرحلة.`
      : 'محطة مناسبة ضمن جدولك، تضيف تجربة لطيفة إلى مسار الرحلة.'
  }

  if (place && city) {
    return `${place} is a recommended stop in ${city}, giving you enough time to explore the place and enjoy the details that make it worth visiting.`
  }

  if (place) {
    return `${place} is a recommended stop in your itinerary, chosen to add a meaningful moment to your trip.`
  }

  return category
    ? `A ${category.toLowerCase()} stop that adds variety and balance to your itinerary.`
    : 'A recommended stop that adds a pleasant experience to your trip.'
}

function getTripCities(tripData, plan) {
  return itineraryDisplay.getTripCities(tripData, plan)
}

function getCityDisplay(tripData, plan, lang) {
  const cities = getTripCities(tripData, plan)

  if (!cities.length) return ''

  return cities
    .map((city) => getCityLabel(city, lang))
    .join(isArabicLang(lang) ? ' ← ' : ' → ')
}

async function loadArabicFontAsBase64() {
  if (cachedArabicFontBase64) return cachedArabicFontBase64

  try {
    const response = await fetch(ARABIC_FONT_PATH)

    if (!response.ok) {
      console.warn(`Arabic font not found at: ${ARABIC_FONT_PATH}`)
      return null
    }

    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    let binary = ''
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i])
    }

    cachedArabicFontBase64 = btoa(binary)
    return cachedArabicFontBase64
  } catch (error) {
    console.warn('Arabic font failed to load:', error)
    return null
  }
}

async function loadImageAsDataUrl(path) {
  try {
    const response = await fetch(path)

    if (!response.ok) {
      console.warn(`Image not found at: ${path}`)
      return null
    }

    const contentType = response.headers.get('content-type') || ''

    if (!contentType.startsWith('image/')) {
      console.warn(`Expected image but received ${contentType || 'unknown'} from: ${path}`)
      return null
    }

    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn('Image failed to load:', error)
    return null
  }
}

async function loadLogoDataUrl() {
  if (cachedLogoDataUrl) return cachedLogoDataUrl

  cachedLogoDataUrl = await loadImageAsDataUrl(LOGO_PATH)
  return cachedLogoDataUrl
}

function getImageFormat(dataUrl) {
  if (String(dataUrl).includes('image/jpeg')) return 'JPEG'
  if (String(dataUrl).includes('image/jpg')) return 'JPEG'
  return 'PNG'
}

function prepareText(doc, value, lang) {
  const text = cleanText(value)

  if (!isArabicLang(lang) && !hasArabicText(text)) return text

  if (arabicFontLoaded && typeof doc.processArabic === 'function') {
    return doc.processArabic(text)
  }

  return text
}

function setPdfFont(doc, lang, weight = 'normal') {
  if (isArabicLang(lang) && arabicFontLoaded) {
    try {
      doc.setFont(ARABIC_FONT_NAME, 'normal')
      return
    } catch {
      doc.setFont('helvetica', 'normal')
      return
    }
  }

  doc.setFont('helvetica', weight)
}

function drawText(doc, text, x, y, options = {}) {
  const {
    lang = 'en',
    align = 'left',
    fontSize = 10,
    color = BRAND.charcoal,
    weight = 'normal',
    maxWidth = null,
    lineHeight = 5,
  } = options

  const rawText = cleanText(text)

  if (!rawText) return y

  const textHasArabic = hasArabicText(rawText)
  const textLang = textHasArabic ? 'ar' : lang
  const shouldMirrorArabicText = textHasArabic && !isArabicLang(lang)
  const textAlign = shouldMirrorArabicText ? 'right' : align
  const textX = shouldMirrorArabicText && maxWidth ? x + maxWidth : x

  setPdfFont(doc, textLang, weight)
  doc.setFontSize(fontSize)
  doc.setTextColor(...color)

  if (maxWidth) {
    const rawLines = doc.splitTextToSize(rawText, maxWidth)
    const preparedLines = rawLines.map((line) => prepareText(doc, line, textLang))

    doc.text(preparedLines, textX, y, { align: textAlign })
    return y + preparedLines.length * lineHeight
  }

  doc.text(prepareText(doc, rawText, textLang), textX, y, { align: textAlign })
  return y + lineHeight
}

function drawInfoTile(doc, { x, y, width, height, label, value, lang, isArabic }) {
  const textX = isArabic ? x + width - 4 : x + 4
  const align = isArabic ? 'right' : 'left'

  doc.setFillColor(...BRAND.white)
  doc.setDrawColor(...BRAND.border)
  doc.setLineWidth(0.35)
  doc.roundedRect(x, y, width, height, 3, 3, 'FD')

  drawText(doc, label, textX, y + 5.5, {
    lang,
    align,
    fontSize: 7.5,
    color: BRAND.muted,
    maxWidth: width - 8,
    lineHeight: 4,
  })

  drawText(doc, value, textX, y + 12, {
    lang,
    align,
    fontSize: 9.2,
    color: BRAND.charcoal,
    weight: 'bold',
    maxWidth: width - 8,
    lineHeight: 4.4,
  })
}

function addPageIfNeeded(doc, y, neededHeight, pageHeight, margin) {
  if (y + neededHeight <= pageHeight - 18) return y

  doc.addPage()
  return margin
}

function addFooter(doc, pageNumber, totalPages, pageWidth, pageHeight, lang) {
  const year = new Date().getFullYear()
  const isArabic = isArabicLang(lang)
  const footerY = pageHeight - 8

  if (isArabic) {
    const footerParts = [
      { text: 'شواف', x: pageWidth / 2 + 72, lang },
      { text: '|', x: pageWidth / 2 + 56, lang: 'en' },
      { text: 'رؤية', x: pageWidth / 2 + 44, lang },
      { text: '٢٠٣٠', x: pageWidth / 2 + 28, lang },
      { text: '|', x: pageWidth / 2 + 13, lang: 'en' },
      { text: `حقوق النشر محفوظة ${toArabicDigits(year)}`, x: pageWidth / 2 - 13, lang },
      { text: '|', x: pageWidth / 2 - 49, lang: 'en' },
      {
        text: `صفحة ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
        x: pageWidth / 2 - 69,
        lang,
      },
    ]

    footerParts.forEach((part) => {
      drawText(doc, part.text, part.x, footerY, {
        lang: part.lang,
        align: 'center',
        fontSize: 8,
        color: [150, 145, 135],
      })
    })

    return
  }

  const footer = `Shawaf | Saudi Vision 2030 | © ${year} All rights reserved | Page ${pageNumber} of ${totalPages}`

  drawText(doc, footer, pageWidth / 2, footerY, {
    lang,
    align: 'center',
    fontSize: 8,
    color: [150, 145, 135],
  })
}

function estimateCardHeight(title, description, category, lang) {
  const titleLength = cleanText(title).length
  const descriptionLength = cleanText(description).length
  const titleCharsPerLine = isArabicLang(lang) ? 38 : 58
  const charsPerLine = isArabicLang(lang) ? 45 : 75
  const titleLines = Math.max(1, Math.ceil(titleLength / titleCharsPerLine))
  const descriptionLines = Math.max(1, Math.ceil(descriptionLength / charsPerLine))

  return Math.max(
    44,
    29 + titleLines * 5 + descriptionLines * 5.5 + (category ? 6 : 0)
  )
}

function normalizePlan(plan) {
  if (!plan) return { itinerary: [] }

  if (Array.isArray(plan?.itinerary)) return plan
  if (Array.isArray(plan?.days)) return { ...plan, itinerary: plan.days }

  if (plan?.ai_plan) {
    if (Array.isArray(plan.ai_plan?.itinerary)) return plan.ai_plan
    if (Array.isArray(plan.ai_plan?.days)) {
      return { ...plan.ai_plan, itinerary: plan.ai_plan.days }
    }
  }

  return { ...plan, itinerary: [] }
}

function normalizeTripData(tripData, plan) {
  return {
    ...tripData,
    startDate:
      firstText(
        tripData?.startDate,
        tripData?.start_date,
        tripData?.trip_start_date,
        tripData?.ai_plan?.startDate,
        tripData?.ai_plan?.start_date,
        plan?.startDate,
        plan?.start_date
      ) || '',
    endDate:
      firstText(
        tripData?.endDate,
        tripData?.end_date,
        tripData?.trip_end_date,
        tripData?.ai_plan?.endDate,
        tripData?.ai_plan?.end_date,
        plan?.endDate,
        plan?.end_date
      ) || '',
    numberOfPeople:
      firstText(
        tripData?.numberOfPeople,
        tripData?.number_of_people,
        tripData?.people,
        tripData?.ai_plan?.numberOfPeople,
        tripData?.ai_plan?.number_of_people,
        plan?.numberOfPeople,
        plan?.number_of_people
      ) || '',
    days: getTripDaysValue(tripData, plan),
    budget: firstText(tripData?.budget, tripData?.ai_plan?.budget, plan?.budget) || '',
    city: firstText(tripData?.city, tripData?.ai_plan?.city, plan?.city) || '',
    cities: tripData?.cities || tripData?.ai_plan?.cities || plan?.cities || [],
    travelerName:
      firstText(
        tripData?.travelerName,
        tripData?.full_name,
        tripData?.fullName,
        tripData?.profileName,
        tripData?.profile?.full_name,
        tripData?.user?.user_metadata?.full_name,
        tripData?.ai_plan?.travelerName,
        plan?.travelerName
      ) || '',
  }
}

function parseDateOnly(value) {
  if (!value) return null

  const dateText = String(value).trim()
  const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (match) {
    const [, year, month, day] = match
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  const date = new Date(dateText)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatPdfDate(value, lang) {
  const date = parseDateOnly(value)

  if (!date) return ''

  return new Intl.DateTimeFormat(isArabicLang(lang) ? 'ar-SA-u-ca-gregory' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatPdfNumber(value, lang) {
  if (value === null || value === undefined || value === '') return ''

  const number = Number(value)

  if (!Number.isFinite(number)) return cleanText(value)

  return new Intl.NumberFormat(isArabicLang(lang) ? 'ar-SA-u-nu-arab' : 'en-US').format(
    number
  )
}

function toArabicDigits(value) {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

  return String(value).replace(/\d/g, (digit) => digits[Number(digit)])
}

function getDurationText(days, lang) {
  const formattedDays = formatPdfNumber(days, lang)

  if (!formattedDays) return ''

  return isArabicLang(lang) ? `${formattedDays} أيام` : `${formattedDays} days`
}

function getDateRangeText(startDate, endDate, days, lang) {
  const start = formatPdfDate(startDate, lang)
  const end = formatPdfDate(endDate, lang)

  if (start && end && start !== end) {
    return isArabicLang(lang) ? `من ${start} إلى ${end}` : `${start} - ${end}`
  }

  return start || end || getDurationText(days, lang) || (isArabicLang(lang) ? 'غير محدد' : 'Not set')
}

export async function exportItineraryPdf({ tripData, plan, lang = 'en' }) {
  const activeLang = getActiveLang(lang)
  const isArabic = isArabicLang(activeLang)

  const normalizedPlan = normalizePlan(plan)
  const normalizedTripData = normalizeTripData(tripData, normalizedPlan)

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true,
  })

  arabicFontLoaded = false

  const fontBase64 = await loadArabicFontAsBase64()

  if (fontBase64) {
    try {
      doc.addFileToVFS(ARABIC_FONT_FILE, fontBase64)
      doc.addFont(ARABIC_FONT_FILE, ARABIC_FONT_NAME, 'normal')
      arabicFontLoaded = true
    } catch (error) {
      console.warn('Arabic font could not be registered in jsPDF:', error)
      arabicFontLoaded = false
    }
  }

  doc.setFont(isArabic && arabicFontLoaded ? ARABIC_FONT_NAME : 'helvetica', 'normal')

  /*
    لا نستخدم doc.setR2L(true)
    لأنه أحيانًا يعكس العربي مع processArabic ويطلع النص مقلوب.
  */

  const logoDataUrl = await loadLogoDataUrl()

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentWidth = pageWidth - margin * 2
  const leftX = margin
  const rightX = pageWidth - margin
  const sectionPadding = 7
  const contentLeftX = leftX + sectionPadding
  const contentRightX = rightX - sectionPadding
  const textX = isArabic ? contentRightX : contentLeftX
  const align = isArabic ? 'right' : 'left'

  const itinerary = normalizedPlan?.itinerary || []
  const selectedCities = getTripCities(normalizedTripData, normalizedPlan)
  const cityDisplay = getCityDisplay(normalizedTripData, normalizedPlan, activeLang)
  const travelerName = cleanText(normalizedTripData?.travelerName)
  const greetingText = travelerName
    ? isArabic
      ? `أهلًا بك يا ${travelerName}`
      : `Welcome, ${travelerName}`
    : isArabic
    ? 'أهلًا بك في رحلتك مع شواف'
    : 'Welcome to your Shawaf trip'

  let y = margin

  // Header
  doc.setFillColor(...BRAND.green)
  doc.roundedRect(margin, y, contentWidth, 46, 6, 6, 'F')

  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.8)
  doc.roundedRect(margin, y, contentWidth, 46, 6, 6, 'S')

  // Logo
  const logoBoxSize = 27
  const logoBoxX = isArabic ? leftX + 11 : rightX - logoBoxSize - 11
  const logoBoxY = y + 9

  doc.setFillColor(...BRAND.white)
  doc.roundedRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize, 4, 4, 'F')

  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.3)
  doc.roundedRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize, 4, 4, 'S')

  if (logoDataUrl) {
    doc.addImage(
      logoDataUrl,
      getImageFormat(logoDataUrl),
      logoBoxX + 2,
      logoBoxY + 2,
      logoBoxSize - 4,
      logoBoxSize - 4
    )
  }

  drawText(
    doc,
    isArabic ? 'شواف' : 'Shawaf',
    isArabic ? contentRightX + 1 : contentLeftX + 1,
    y + 16,
    {
      lang: activeLang,
      align,
      fontSize: 25,
      color: BRAND.white,
      weight: 'bold',
    }
  )

  drawText(
    doc,
    isArabic ? 'خطة رحلة مدعومة بالذكاء الاصطناعي' : 'AI-Powered Travel Plan',
    isArabic ? contentRightX + 1 : contentLeftX + 1,
    y + 30,
    {
      lang: activeLang,
      align,
      fontSize: 11,
      color: [245, 245, 240],
    }
  )

  drawText(
    doc,
    isArabic ? 'جدول جاهز للحفظ والاستخدام أثناء الرحلة' : 'A polished itinerary for your trip',
    isArabic ? contentRightX + 1 : contentLeftX + 1,
    y + 39,
    {
      lang: activeLang,
      align,
      fontSize: 8.5,
      color: [230, 242, 238],
    }
  )

  y += 56

  doc.setFillColor(...BRAND.goldSoft)
  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.35)
  doc.roundedRect(margin, y - 5, contentWidth, 13, 6, 6, 'FD')

  if (isArabic && travelerName && !hasArabicText(travelerName)) {
    const greetingPrefix = 'أهلًا بك يا'
    const greetingY = y + 3.4

    drawText(doc, greetingPrefix, textX, greetingY, {
      lang: activeLang,
      align,
      fontSize: 10.5,
      color: BRAND.green,
      weight: 'bold',
      lineHeight: 6,
    })

    setPdfFont(doc, 'ar', 'normal')
    doc.setFontSize(10.5)
    const prefixWidth = doc.getTextWidth(prepareText(doc, greetingPrefix, 'ar'))

    setPdfFont(doc, 'en', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(...BRAND.green)
    doc.text(travelerName, textX - prefixWidth - 2, greetingY, {
      align: 'right',
    })
  } else {
    drawText(doc, greetingText, textX, y + 3.4, {
      lang: activeLang,
      align,
      fontSize: 10.5,
      color: BRAND.green,
      weight: 'bold',
      maxWidth: contentWidth - sectionPadding * 2,
      lineHeight: 6,
    })
  }

  y += 18

  // Summary
  doc.setFillColor(...BRAND.greenSoft)
  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.45)
  doc.roundedRect(margin, y, contentWidth, 70, 5, 5, 'FD')

  drawText(doc, isArabic ? 'ملخص الرحلة' : 'Trip Summary', textX, y + 10, {
    lang: activeLang,
    align,
    fontSize: 13,
    color: BRAND.green,
    weight: 'bold',
  })

  const labels = {
    destination: isArabic ? 'الوجهة' : 'Destination',
    dates: isArabic ? 'التواريخ' : 'Dates',
    duration: isArabic ? 'مدة الرحلة' : 'Trip Length',
    people: isArabic ? 'عدد الأشخاص' : 'People',
    budget: isArabic ? 'الميزانية' : 'Budget',
    day: isArabic ? 'اليوم' : 'Day',
    category: isArabic ? 'التصنيف' : 'Category',
    placeDescription: isArabic ? 'وصف المكان' : 'Place Description',
  }

  const dateText = getDateRangeText(
    normalizedTripData?.startDate,
    normalizedTripData?.endDate,
    normalizedTripData?.days,
    activeLang
  )
  const dateLabel =
    normalizedTripData?.startDate || normalizedTripData?.endDate
      ? labels.dates
      : labels.duration
  const peopleText =
    formatPdfNumber(normalizedTripData?.numberOfPeople, activeLang) ||
    (isArabic ? 'غير محدد' : 'Not set')
  const budgetText =
    getBudgetLabel(normalizedTripData?.budget, activeLang) ||
    (isArabic ? 'غير محدد' : 'Not set')

  const summaryPadding = 6
  const summaryLeftX = margin + summaryPadding
  const summaryRightX = rightX - summaryPadding
  const tileGap = 4
  const tileWidth = (contentWidth - summaryPadding * 2 - tileGap) / 2
  const tileHeight = 20
  const firstTileX = isArabic ? summaryRightX - tileWidth : summaryLeftX
  const secondTileX = isArabic
    ? summaryRightX - tileWidth * 2 - tileGap
    : summaryLeftX + tileWidth + tileGap

  const summaryTiles = [
    { label: labels.destination, value: cityDisplay || (isArabic ? 'غير محدد' : 'Not set') },
    { label: dateLabel, value: dateText },
    { label: labels.people, value: String(peopleText) },
    { label: labels.budget, value: budgetText },
  ]

  summaryTiles.forEach((item, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    drawInfoTile(doc, {
      x: col === 0 ? firstTileX : secondTileX,
      y: y + 17 + row * (tileHeight + 4),
      width: tileWidth,
      height: tileHeight,
      label: item.label,
      value: item.value,
      lang: activeLang,
      isArabic,
    })
  })

  y += 80

  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    drawText(
      doc,
      isArabic ? 'لا توجد بيانات رحلة محفوظة للتصدير.' : 'No itinerary data available to export.',
      textX,
      y + 8,
      {
        lang: activeLang,
        align,
        fontSize: 12,
        color: BRAND.muted,
        maxWidth: contentWidth - sectionPadding * 2,
      }
    )
  }

  itinerary.forEach((day, dayIndex) => {
    const dayCity =
      day?.city ||
      selectedCities[dayIndex] ||
      selectedCities[0] ||
      normalizedTripData?.city ||
      ''

    const dayCityLabel = getCityLabel(dayCity, activeLang)
    const dayTheme = cleanText(itineraryDisplay.getDayTheme(day, activeLang))
    const dayNumberText = `${labels.day} ${formatPdfNumber(dayIndex + 1, activeLang)}`
    const dayMeta = dayTheme || (isArabic ? 'برنامج اليوم' : 'Daily Plan')

    y = addPageIfNeeded(doc, y, 27, pageHeight, margin)

    const dayHeaderHeight = 17
    const dayChipWidth = 34
    const dayChipHeight = 9
    const dayChipX = isArabic
      ? contentRightX - dayChipWidth
      : contentLeftX
    const dayChipY = y + 4
    const cityChipWidth = dayCityLabel
      ? Math.min(44, Math.max(24, cleanText(dayCityLabel).length * 2.4 + 12))
      : 0
    const cityChipX = isArabic
      ? dayChipX - cityChipWidth - 3
      : dayChipX + dayChipWidth + 3
    const dayMetaX = isArabic
      ? (dayCityLabel ? cityChipX : dayChipX) - 5
      : (dayCityLabel ? cityChipX + cityChipWidth : dayChipX + dayChipWidth) + 5
    const dayMetaMaxWidth =
      contentWidth - sectionPadding * 2 - dayChipWidth - (dayCityLabel ? cityChipWidth + 3 : 0) - 10

    doc.setFillColor(...BRAND.green)
    doc.roundedRect(margin, y, contentWidth, dayHeaderHeight, 4, 4, 'F')

    doc.setDrawColor(...BRAND.gold)
    doc.setLineWidth(0.35)
    doc.roundedRect(margin, y, contentWidth, dayHeaderHeight, 4, 4, 'S')

    doc.setFillColor(...BRAND.goldSoft)
    doc.setDrawColor(...BRAND.gold)
    doc.setLineWidth(0.25)
    doc.roundedRect(dayChipX, dayChipY, dayChipWidth, dayChipHeight, 4, 4, 'FD')

    drawText(doc, dayNumberText, dayChipX + dayChipWidth / 2, y + 10.2, {
      lang: activeLang,
      align: 'center',
      fontSize: 8,
      color: BRAND.greenDark,
      weight: 'bold',
    })

    if (dayCityLabel) {
      doc.setFillColor(...BRAND.white)
      doc.setDrawColor(...BRAND.gold)
      doc.setLineWidth(0.25)
      doc.roundedRect(cityChipX, dayChipY, cityChipWidth, dayChipHeight, 4, 4, 'FD')

      drawText(doc, dayCityLabel, cityChipX + cityChipWidth / 2, y + 10.2, {
        lang: activeLang,
        align: 'center',
        fontSize: 8,
        color: BRAND.greenDark,
        weight: 'bold',
      })
    }

    drawText(doc, dayMeta, dayMetaX, y + 10.5, {
      lang: activeLang,
      align,
      fontSize: 11,
      color: BRAND.white,
      weight: 'bold',
      maxWidth: dayMetaMaxWidth,
      lineHeight: 5,
    })

    y += 23

    getStationsFromDay(day).forEach((station, stationIndex) => {
      const stationName = getStationName(station, activeLang)
      const stationCategory = getCategoryLabel(station?.category, activeLang)
      const stationDescription =
        getStationDescription(station, activeLang) ||
        getStationFallbackDescription(
          stationName,
          stationCategory,
          dayCityLabel,
          activeLang
        )
      const time = station?.time || ''

      const cardHeight = estimateCardHeight(
        stationName,
        stationDescription,
        stationCategory,
        activeLang
      )

      y = addPageIfNeeded(doc, y, cardHeight + 7, pageHeight, margin)

      doc.setFillColor(...BRAND.white)
      doc.setDrawColor(...BRAND.border)
      doc.setLineWidth(0.45)
      doc.roundedRect(margin, y, contentWidth, cardHeight, 4, 4, 'FD')

      doc.setFillColor(...BRAND.greenSoft)
      doc.roundedRect(
        isArabic ? rightX - 3 : margin,
        y,
        3,
        cardHeight,
        2,
        2,
        'F'
      )

      const cardLeftX = contentLeftX
      const cardRightX = contentRightX
      const numberBadgeSize = 8
      const numberBadgeX = isArabic ? cardRightX - numberBadgeSize : cardLeftX
      const numberBadgeY = y + 5
      const bodyTextX = isArabic
        ? numberBadgeX - 4
        : numberBadgeX + numberBadgeSize + 4
      const timeBoxWidth = 28
      const timeBoxX = isArabic ? cardLeftX : cardRightX - timeBoxWidth
      const titleMaxWidth = Math.max(
        45,
        isArabic
          ? bodyTextX - (time ? timeBoxX + timeBoxWidth + 5 : cardLeftX)
          : (time ? timeBoxX - 5 : cardRightX) - bodyTextX
      )
      const bodyMaxWidth = Math.max(
        55,
        isArabic ? bodyTextX - cardLeftX : cardRightX - bodyTextX
      )

      doc.setFillColor(...BRAND.green)
      doc.roundedRect(
        numberBadgeX,
        numberBadgeY,
        numberBadgeSize,
        numberBadgeSize,
        4,
        4,
        'F'
      )

      drawText(
        doc,
        formatPdfNumber(stationIndex + 1, activeLang),
        numberBadgeX + numberBadgeSize / 2,
        y + 10.7,
        {
          lang: activeLang,
          align: 'center',
          fontSize: 7,
          color: BRAND.white,
          weight: 'bold',
        }
      )

      const titleBottomY = drawText(doc, stationName, bodyTextX, y + 8, {
        lang: activeLang,
        align,
        fontSize: 10.5,
        color: BRAND.charcoal,
          weight: 'bold',
          maxWidth: titleMaxWidth,
          lineHeight: 5,
        })

      if (time) {
        doc.setFillColor(...BRAND.greenSoft)
        doc.setDrawColor(...BRAND.gold)
        doc.setLineWidth(0.25)
        doc.roundedRect(timeBoxX, y + 5, timeBoxWidth, 8, 4, 4, 'FD')

        drawText(doc, time, timeBoxX + timeBoxWidth / 2, y + 10.5, {
          lang: 'en',
          align: 'center',
          fontSize: 8,
          color: BRAND.green,
        })
      }

      let innerY = titleBottomY + 1

      if (stationCategory) {
        doc.setFillColor(...BRAND.goldSoft)
        doc.setDrawColor(...BRAND.gold)
        doc.setLineWidth(0.25)

        const tagWidth = Math.min(54, Math.max(24, cleanText(stationCategory).length * 2.2 + 14))
        const tagX = isArabic ? bodyTextX - tagWidth : bodyTextX
        doc.roundedRect(tagX, innerY - 3.8, tagWidth, 7, 3.5, 3.5, 'FD')

        drawText(doc, stationCategory, isArabic ? tagX + tagWidth - 4 : tagX + 4, innerY + 1, {
          lang: activeLang,
          align,
          fontSize: 7.6,
          color: BRAND.greenDark,
          maxWidth: tagWidth - 8,
          lineHeight: 5,
        })

        innerY += 7
      }

      if (stationDescription) {
        drawText(doc, labels.placeDescription, bodyTextX, innerY, {
          lang: activeLang,
          align,
          fontSize: 7.3,
          color: BRAND.muted,
          weight: 'bold',
          maxWidth: bodyMaxWidth,
          lineHeight: 4,
        })

        innerY += 4.2

        drawText(doc, stationDescription, bodyTextX, innerY, {
          lang: activeLang,
          align,
          fontSize: 8.8,
          color: [87, 83, 78],
          maxWidth: bodyMaxWidth,
          lineHeight: 5,
        })
      }

      y += cardHeight + 5
    })

    y += 3
  })

  if (Array.isArray(itinerary) && itinerary.length > 0) {
    y = addPageIfNeeded(doc, y, 22, pageHeight, margin)

    doc.setFillColor(...BRAND.goldSoft)
    doc.setDrawColor(...BRAND.gold)
    doc.setLineWidth(0.45)
    doc.roundedRect(margin, y, contentWidth, 22, 5, 5, 'FD')

    drawText(
      doc,
      isArabic ? 'رحلة سعيدة من شواف' : 'Have a Wonderful Trip with Shawaf',
      textX,
      y + 8,
      {
        lang: activeLang,
        align,
        fontSize: 11,
        color: BRAND.green,
        weight: 'bold',
        maxWidth: contentWidth - sectionPadding * 2,
        lineHeight: 5,
      }
    )

    drawText(
      doc,
      isArabic
        ? 'نتمنى لك أيامًا مليئة بالاكتشافات الجميلة، واللحظات التي تستحق أن تُحفظ.'
        : 'May your days be full of beautiful discoveries and moments worth keeping.',
      textX,
      y + 16,
      {
        lang: activeLang,
        align,
        fontSize: 8.5,
        color: [87, 83, 78],
        maxWidth: contentWidth - sectionPadding * 2,
        lineHeight: 4.5,
      }
    )

    y += 28
  }

  const pageCount = doc.internal.getNumberOfPages()

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    addFooter(doc, page, pageCount, pageWidth, pageHeight, activeLang)
  }

  const safeCity = cleanText(cityDisplay)
    .replace(/[^\p{L}\p{N}-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  doc.save(`Shawaf-${safeCity || 'trip'}-itinerary.pdf`)
}

export default exportItineraryPdf

```

---

## `utils/mapHelpers.js`

```js
export const CITY_COORDS = {
  Riyadh: [24.6877, 46.7219],
  Diriyah: [24.737, 46.5752],
  Jeddah: [21.4858, 39.1925],
  Mecca: [21.3891, 39.8579],
  Medina: [24.5247, 39.5692],
  Dammam: [26.4207, 50.0888],
  'Al-Khobar': [26.2172, 50.1971],
  Dhahran: [26.2361, 50.0393],
  'Al-Ahsa': [25.3831, 49.5867],
  'Al-Ula': [26.6239, 37.9216],
  NEOM: [28.0339, 35.1389],
  Abha: [18.2164, 42.5053],
  Taif: [21.2854, 40.4146],
  Yanbu: [24.0895, 38.0618],
  Tabuk: [28.3835, 36.5662],
  Hail: [27.5114, 41.7208],
  Najran: [17.5656, 44.2289],
  Jizan: [16.8892, 42.5511],
  Buraidah: [26.3592, 43.9818],
  Jubail: [27.0046, 49.646],
  'Al-Baha': [20.0129, 41.4677],
  Sakaka: [29.9697, 40.2064],
  'Hafar Al-Batin': [28.4328, 45.9708],
  KAEC: [22.4057, 39.0811],
}

export function buildGoogleMapsUrl(placeName, city) {
  const q = encodeURIComponent(`${placeName}, ${city}, Saudi Arabia`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

export function buildGoogleMapsCoordinateUrl(latitude, longitude) {
  const lat = Number(latitude)
  const lng = Number(longitude)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  return null
}

export function getCityCenter(city) {
  return CITY_COORDS[city] || CITY_COORDS.Riyadh
}
```

---

## `utils/pdf.js`

```js
import { exportItineraryPdf } from './exportItineraryPdf'

export async function generatePDF(tripData, plan, itinerary, lang) {
  const finalPlan = {
    ...(plan || {}),
    itinerary: itinerary || plan?.itinerary || plan?.days || [],
    days: itinerary || plan?.days || plan?.itinerary || [],
  }

  return exportItineraryPdf({
    tripData,
    plan: finalPlan,
    lang:
      lang ||
      localStorage.getItem('lang') ||
      document.documentElement.getAttribute('lang') ||
      'en',
  })
}

export default generatePDF
```

---

## `utils/translations.js`

```js
// Re-export from context for convenience
// All translations live in src/context/LanguageContext.jsx
export { useLang } from '../context/LanguageContext'

```

---

## `lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase env vars. Copy .env.example to .env and fill in values.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

```
