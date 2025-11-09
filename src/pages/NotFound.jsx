import { useNavigate } from 'react-router-dom'
import { Home as HomeIcon } from 'lucide-react'
import Button from '../components/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}

export default NotFound
