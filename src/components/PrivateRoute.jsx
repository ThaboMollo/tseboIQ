import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

/**
 * PrivateRoute component to protect authenticated routes
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = ({ children, requireRole = null }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role if required
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute
