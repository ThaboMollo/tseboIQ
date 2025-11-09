import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './components/AuthProvider'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import RoleSelection from './pages/RoleSelection'
import CandidateForm from './pages/CandidateForm'
import EmployerForm from './pages/EmployerForm'
import AuthModal from './pages/AuthModal'
import CandidateDashboard from './pages/CandidateDashboard'
import EmployerDashboard from './pages/EmployerDashboard'
import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<Home />} />
              
              {/* Role Selection (alternative entry) */}
              <Route path="/start" element={<RoleSelection />} />
            
            {/* Registration flows */}
            <Route path="/register/candidate" element={<CandidateForm />} />
            <Route path="/register/employer" element={<EmployerForm />} />
            
            {/* Authentication */}
            <Route path="/auth" element={<AuthModal />} />
            
            {/* Protected Dashboards */}
            <Route 
              path="/dashboard/candidate" 
              element={
                <PrivateRoute>
                  <CandidateDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/dashboard/employer" 
              element={
                <PrivateRoute>
                  <EmployerDashboard />
                </PrivateRoute>
              } 
            />
            
            {/* Information pages */}
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
            </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
