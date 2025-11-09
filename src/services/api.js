/**
 * API Service Layer for tseboIQ
 * Handles all backend API communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Generic API request handler
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request Failed [${endpoint}]:`, error)
    throw error
  }
}

/**
 * Parse CV using backend API
 * POST /api/cv/parse
 */
export async function parseCVAPI(file) {
  const formData = new FormData()
  formData.append('cv', file)

  return apiRequest('/cv/parse', {
    method: 'POST',
    headers: {}, // Let browser set Content-Type for FormData
    body: formData
  })
}

/**
 * Create candidate profile
 * POST /api/candidate
 */
export async function createCandidate(candidateData) {
  return apiRequest('/candidate', {
    method: 'POST',
    body: JSON.stringify(candidateData)
  })
}

/**
 * Update candidate profile
 * PUT /api/candidate/:id
 */
export async function updateCandidate(id, candidateData) {
  return apiRequest(`/candidate/${id}`, {
    method: 'PUT',
    body: JSON.stringify(candidateData)
  })
}

/**
 * Get candidate profile
 * GET /api/candidate/:id
 */
export async function getCandidate(id) {
  return apiRequest(`/candidate/${id}`, {
    method: 'GET'
  })
}

/**
 * Create job posting
 * POST /api/job
 */
export async function createJob(jobData) {
  return apiRequest('/job', {
    method: 'POST',
    body: JSON.stringify(jobData)
  })
}

/**
 * Update job posting
 * PUT /api/job/:id
 */
export async function updateJob(id, jobData) {
  return apiRequest(`/job/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData)
  })
}

/**
 * Get job posting
 * GET /api/job/:id
 */
export async function getJob(id) {
  return apiRequest(`/job/${id}`, {
    method: 'GET'
  })
}

/**
 * Get all jobs for an employer
 * GET /api/job/employer/:employerId
 */
export async function getEmployerJobs(employerId) {
  return apiRequest(`/job/employer/${employerId}`, {
    method: 'GET'
  })
}

/**
 * Get top 2 matches for a candidate or job
 * GET /api/match/top2/:id
 * @param {string} id - Candidate ID or Job ID
 * @param {string} type - 'candidate' or 'job'
 */
export async function getTop2Matches(id, type = 'candidate') {
  return apiRequest(`/match/top2/${id}?type=${type}`, {
    method: 'GET'
  })
}

/**
 * Get all matches for a candidate or job
 * GET /api/match/:id
 */
export async function getAllMatches(id, type = 'candidate') {
  return apiRequest(`/match/${id}?type=${type}`, {
    method: 'GET'
  })
}

export default {
  parseCVAPI,
  createCandidate,
  updateCandidate,
  getCandidate,
  createJob,
  updateJob,
  getJob,
  getEmployerJobs,
  getTop2Matches,
  getAllMatches
}
