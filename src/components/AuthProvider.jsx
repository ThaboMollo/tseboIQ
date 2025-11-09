import { createContext, useContext, useState, useEffect } from 'react'
import { 
  getCurrentUser, 
  getSession, 
  signInWithProvider,
  signInWithEmail,
  signUpWithEmail,
  signOut as authSignOut,
  onAuthStateChange,
  upsertUserProfile
} from '../lib/auth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        const currentSession = await getSession()
        
        setUser(currentUser)
        setSession(currentSession)
      } catch (err) {
        console.error('Error initializing auth:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Subscribe to auth changes
    const unsubscribe = onAuthStateChange(async (authUser) => {
      setUser(authUser)
      if (authUser) {
        const currentSession = await getSession()
        setSession(currentSession)
      } else {
        setSession(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (provider) => {
    try {
      setError(null)
      setLoading(true)
      const { user: authUser, error: authError } = await signInWithProvider(provider)
      
      if (authError) {
        setError(authError)
        return { error: authError }
      }

      // Create/update user profile
      if (authUser) {
        await upsertUserProfile({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
          provider: provider,
          role: 'job_seeker', // Default role
          created_at: new Date().toISOString()
        })
      }

      return { error: null }
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      setLoading(true)
      const { error: signOutError } = await authSignOut()
      
      if (signOutError) {
        setError(signOutError)
        return { error: signOutError }
      }

      setUser(null)
      setSession(null)
      return { error: null }
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signInEmail = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const { user: authUser, error: authError } = await signInWithEmail(email, password)
      
      if (authError) {
        setError(authError)
        return { error: authError }
      }

      // Update user profile
      if (authUser) {
        await upsertUserProfile({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
          provider: 'email',
          role: authUser.user_metadata?.role || 'job_seeker',
          created_at: authUser.created_at || new Date().toISOString()
        })
      }

      return { error: null }
    } catch (err) {
      console.error('Email sign in error:', err)
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signUpEmail = async (email, password, metadata = {}) => {
    try {
      setError(null)
      setLoading(true)
      const { user: authUser, error: authError } = await signUpWithEmail(email, password, metadata)
      
      if (authError) {
        setError(authError)
        return { error: authError }
      }

      // Create user profile
      if (authUser) {
        await upsertUserProfile({
          id: authUser.id,
          email: authUser.email,
          name: metadata.name || authUser.email?.split('@')[0],
          provider: 'email',
          role: metadata.role || 'job_seeker',
          created_at: new Date().toISOString()
        })
      }

      return { error: null }
    } catch (err) {
      console.error('Email sign up error:', err)
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (role) => {
    if (!user) return { error: 'No user logged in' }

    try {
      const { error: updateError } = await upsertUserProfile({
        id: user.id,
        role: role,
        updated_at: new Date().toISOString()
      })

      if (updateError) {
        setError(updateError)
        return { error: updateError }
      }

      setUser({ ...user, role })
      return { error: null }
    } catch (err) {
      console.error('Update role error:', err)
      setError(err.message)
      return { error: err.message }
    }
  }

  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signInEmail,
    signUpEmail,
    signOut,
    updateUserRole,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
