import axios from 'axios'

/**
 * Profile API Service
 * Handles all API calls related to candidate profiles
 */

// API base URL - configure based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL

if (!API_BASE_URL) {
  console.error('Missing API configuration. Please set VITE_API_URL in your .env file')
}

/**
 * Upload CV file and get parsed data
 * @param {File} file - CV file to upload
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Upload response with parsed data
 */
export async function uploadCV(file, userId) {
  if (!API_BASE_URL) {
    throw new Error('API not configured. Please set VITE_API_URL in your .env file')
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    
    const response = await axios.post(`${API_BASE_URL}/profile/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error uploading CV:', error)
    throw new Error(error.response?.data?.message || 'Failed to upload CV')
  }
}

/**
 * Create or update candidate profile
 * @param {Object} profileData - Profile data to save
 * @returns {Promise<Object>} Saved profile
 */
export async function saveProfile(profileData) {
  if (!API_BASE_URL) {
    throw new Error('API not configured. Please set VITE_API_URL in your .env file')
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/profile`, profileData)
    return response.data
  } catch (error) {
    console.error('Error saving profile:', error)
    throw new Error(error.response?.data?.message || 'Failed to save profile')
  }
}

/**
 * Update existing profile
 * @param {string} profileId - Profile ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated profile
 */
export async function updateProfile(profileId, updates) {
  if (!API_BASE_URL) {
    throw new Error('API not configured. Please set VITE_API_URL in your .env file')
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/profile/${profileId}`, updates)
    return response.data
  } catch (error) {
    console.error('Error updating profile:', error)
    throw new Error(error.response?.data?.message || 'Failed to update profile')
  }
}

/**
 * Get profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Profile data or null
 */
export async function getProfile(userId) {
  if (!API_BASE_URL) {
    throw new Error('API not configured. Please set VITE_API_URL in your .env file')
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/profile/user/${userId}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      return null
    }
    console.error('Error fetching profile:', error)
    throw new Error(error.response?.data?.message || 'Failed to fetch profile')
  }
}

/**
 * Delete profile
 * @param {string} profileId - Profile ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function deleteProfile(profileId) {
  if (!API_BASE_URL) {
    throw new Error('API not configured. Please set VITE_API_URL in your .env file')
  }

  try {
    await axios.delete(`${API_BASE_URL}/profile/${profileId}`)
  } catch (error) {
    console.error('Error deleting profile:', error)
    throw new Error(error.response?.data?.message || 'Failed to delete profile')
  }
}

/**
 * Upload CV file to storage (separate from parsing)
 * @param {File} file - CV file
 * @param {string} userId - User ID
 * @returns {Promise<string>} File URL
 */
export async function uploadCVFile(file, userId) {
  if (!API_BASE_URL) {
    throw new Error('API not configured. Please set VITE_API_URL in your .env file')
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    
    const response = await axios.post(`${API_BASE_URL}/profile/upload-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data.fileUrl
  } catch (error) {
    console.error('Error uploading CV file:', error)
    throw new Error(error.response?.data?.message || 'Failed to upload CV file')
  }
}
