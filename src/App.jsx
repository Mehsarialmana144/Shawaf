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