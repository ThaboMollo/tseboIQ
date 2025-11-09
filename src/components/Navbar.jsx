import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Briefcase, Users, LogOut, User } from 'lucide-react'
import { useAuth } from './AuthProvider'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut, isAuthenticated } = useAuth()
  const isHome = location.pathname === '/'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-primary dark:text-secondary">tseboIQ</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!isHome && (
              <Link 
                to="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary transition-colors font-medium"
              >
                Home
              </Link>
            )}
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/employer-dashboard" 
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary transition-colors font-medium"
                >
                  <Users className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{user?.name || user?.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            )}
            
            {!isAuthenticated && !isHome && (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle fixed={false} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
