import { supabase } from './supabase'

/**
 * Authentication service for tseboIQ
 * Supports OAuth providers: Google, Apple, Microsoft
 * Supports email/password authentication
 * Requires Supabase configuration
 */

/**
 * Sign up with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {object} metadata - Additional user metadata (name, etc.)
 */
export const signUpWithEmail = async (email, password, metadata = {}) => {
  if (!supabase) {
    return { user: null, error: 'Supabase not configured. Please set environment variables.' }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    console.error('Error signing up with email:', error)
    return { user: null, error: error.message }
  }
}

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
export const signInWithEmail = async (email, password) => {
  if (!supabase) {
    return { user: null, session: null, error: 'Supabase not configured. Please set environment variables.' }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    console.error('Error signing in with email:', error)
    return { user: null, session: null, error: error.message }
  }
}

/**
 * Send password reset email
 * @param {string} email - User's email
 */
export const resetPassword = async (email) => {
  if (!supabase) {
    return { error: 'Supabase not configured. Please set environment variables.' }
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { error: error.message }
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 */
export const updatePassword = async (newPassword) => {
  if (!supabase) {
    return { error: 'Supabase not configured. Please set environment variables.' }
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error updating password:', error)
    return { error: error.message }
  }
}

/**
 * Sign in with OAuth provider
 * @param {string} provider - 'google', 'apple', or 'azure' (Microsoft)
 */
export const signInWithProvider = async (provider) => {
  if (!supabase) {
    return { user: null, error: 'Supabase not configured. Please set environment variables.' }
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: provider === 'azure' ? 'email profile openid' : undefined
      }
    })

    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    console.error(`Error signing in with ${provider}:`, error)
    return { user: null, error: error.message }
  }
}

/**
 * Sign out current user
 */
export const signOut = async () => {
  if (!supabase) {
    return { error: 'Supabase not configured. Please set environment variables.' }
  }

  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Error signing out:', error)
    return { error: error.message }
  }
}

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  if (!supabase) {
    return null
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get current session
 */
export const getSession = async () => {
  if (!supabase) {
    return null
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback) => {
  if (!supabase) {
    callback(null)
    return () => {}
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })

  return () => subscription.unsubscribe()
}

/**
 * Create or update user profile in database
 */
export const upsertUserProfile = async (userData) => {
  if (!supabase) {
    return { user: null, error: 'Supabase not configured. Please set environment variables.' }
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })
      .select()
      .single()

    if (error) throw error
    return { user: data, error: null }
  } catch (error) {
    console.error('Error upserting user profile:', error)
    return { user: null, error: error.message }
  }
}

/**
 * Record privacy policy consent
 */
export const recordConsent = async (userId, consentData) => {
  if (!supabase) {
    return { consent: null, error: 'Supabase not configured. Please set environment variables.' }
  }

  try {
    const { data, error } = await supabase
      .from('consents')
      .insert({
        user_id: userId,
        ...consentData,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return { consent: data, error: null }
  } catch (error) {
    console.error('Error recording consent:', error)
    return { consent: null, error: error.message }
  }
}

/**
 * Check if user has given consent
 */
export const hasUserConsented = async (userId) => {
  if (!supabase) {
    return false
  }

  try {
    const { data, error } = await supabase
      .from('consents')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return !!data
  } catch (error) {
    console.error('Error checking consent:', error)
    return false
  }
}
