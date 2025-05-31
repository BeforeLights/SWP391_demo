import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import Dashboard from './pages/Dashboard'
import ReportsPage from './pages/ReportsPage'
import MedicationReminders from './pages/MedicationReminders'
import PatientHistory from './pages/PatientHistory'
import NotificationsCenter from './pages/NotificationsCenter'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import AppointmentBooking from './pages/AppointmentBooking'
import DoctorManagement from './pages/admin/DoctorManagement'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              } />              <Route path="/appointments" element={
                <ProtectedRoute>
                  <AppointmentBooking />
                </ProtectedRoute>
              } />              <Route path="/medications" element={
                <ProtectedRoute>
                  <MedicationReminders />
                </ProtectedRoute>
              } />              <Route path="/history" element={
                <ProtectedRoute>
                  <PatientHistory />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsCenter />
                </ProtectedRoute>
              } />
                {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/doctors" element={
                <ProtectedRoute requiredRole="admin">
                  <DoctorManagement />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
