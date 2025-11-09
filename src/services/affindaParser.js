/**
 * Affinda Resume Parsing API Service
 * AI-powered CV parsing with fallback to local parser
 */

import { parseCV as localParseCV } from './cvParser.js'

const AFFINDA_API_KEY = import.meta.env.VITE_AFFINDA_API_KEY || 'aff_6dc4b8fe9d8e37f700cd93992be45489b66931b1'
const AFFINDA_WORKSPACE = import.meta.env.VITE_AFFINDA_WORKSPACE || 'c0c32f27' // Default workspace
// Affinda v3 API endpoint for resume parsing
const AFFINDA_API_URL = 'https://api.affinda.com/v3/documents'

/**
 * Parse CV using Affinda API
 * @param {File} file - CV file (PDF or DOCX)
 * @returns {Promise<Object>} Parsed CV data
 */
export async function parseWithAffinda(file) {
  try {
    // Validate file
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF or DOCX file.')
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit.')
    }

    // Create FormData for multipart upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('identifier', file.name)
    formData.append('workspace', AFFINDA_WORKSPACE) // Required: workspace identifier
    formData.append('wait', 'true') // Wait for processing to complete

    console.log('🚀 Sending CV to Affinda API for parsing...')
    console.log('📍 API URL:', AFFINDA_API_URL)
    console.log('🏢 Workspace:', AFFINDA_WORKSPACE)
    console.log('🔑 API Key:', AFFINDA_API_KEY ? `${AFFINDA_API_KEY.substring(0, 10)}...` : 'Missing')
    console.log('📄 File:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`)

    // Call Affinda API
    const response = await fetch(AFFINDA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AFFINDA_API_KEY}`,
        'Accept': 'application/json'
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Affinda API Error:', errorText)
      throw new Error(`Affinda API failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Affinda API parsing successful')

    // Map Affinda response to tseboIQ format
    const mappedData = mapAffindaResponse(data)
    
    return {
      success: true,
      data: mappedData,
      source: 'affinda',
      confidence: calculateConfidence(mappedData),
      raw: data // Keep raw response for debugging
    }

  } catch (error) {
    console.error('❌ Affinda parsing failed:', error.message)
    throw error
  }
}

/**
 * Parse CV with Affinda API and fallback to local parser
 * @param {File} file - CV file (PDF or DOCX)
 * @returns {Promise<Object>} Parsed CV data with metadata
 */
export async function parseCV(file) {
  try {
    // Try Affinda first
    console.log('📄 Attempting to parse CV with Affinda API...')
    const affindaResult = await parseWithAffinda(file)
    
    // Check if Affinda result is good enough
    if (affindaResult.confidence >= 0.5) {
      console.log(`✅ Using Affinda result (confidence: ${(affindaResult.confidence * 100).toFixed(0)}%)`)
      return affindaResult
    }
    
    console.warn('⚠️ Affinda confidence low, falling back to local parser...')
    throw new Error('Low confidence, using fallback')
    
  } catch (error) {
    // Fallback to local parser
    console.log('🔄 Falling back to local CV parser...')
    
    try {
      const localData = await localParseCV(file)
      
      return {
        success: true,
        data: localData,
        source: 'local',
        confidence: calculateConfidence(localData),
        fallbackReason: error.message
      }
    } catch (localError) {
      console.error('❌ Both parsers failed:', localError)
      throw new Error('Failed to parse CV with both Affinda and local parser')
    }
  }
}

/**
 * Map Affinda API response to tseboIQ candidate format
 * @param {Object} affindaData - Raw Affinda API response
 * @returns {Object} Mapped candidate data
 */
function mapAffindaResponse(affindaData) {
  const data = affindaData.data || affindaData

  return {
    // Personal Information
    full_name: extractName(data),
    email: extractEmail(data),
    phone_number: extractPhone(data),
    address: extractAddress(data),
    nationality: data.nationality || null,
    gender: data.gender || null,
    date_of_birth: extractDateOfBirth(data),
    
    // Professional Information
    profile_summary: extractSummary(data),
    skills: extractSkills(data),
    
    // Experience
    employment_history: extractEmploymentHistory(data),
    experience_years: data.totalYearsExperience || calculateExperienceYears(data),
    
    // Education
    education: extractEducation(data),
    
    // Additional Information
    certifications: extractCertifications(data),
    projects: extractProjects(data),
    references: extractReferences(data),
    
    // Languages
    languages: extractLanguages(data),
    
    // URLs
    linkedin_url: extractLinkedIn(data),
    portfolio_url: extractPortfolio(data),
    
    // Metadata
    parsed_at: new Date().toISOString(),
    parser_version: 'affinda-v3'
  }
}

/**
 * Extract full name from Affinda data
 */
function extractName(data) {
  if (data.name?.raw) return data.name.raw
  if (data.name?.first && data.name?.last) {
    return `${data.name.first} ${data.name.last}`.trim()
  }
  return 'Unknown'
}

/**
 * Extract email from Affinda data
 */
function extractEmail(data) {
  if (data.emails && data.emails.length > 0) {
    return data.emails[0]
  }
  return null
}

/**
 * Extract phone from Affinda data
 */
function extractPhone(data) {
  if (data.phoneNumbers && data.phoneNumbers.length > 0) {
    return data.phoneNumbers[0]
  }
  return null
}

/**
 * Extract address from Affinda data
 */
function extractAddress(data) {
  if (data.location?.formatted) {
    return data.location.formatted
  }
  if (data.location?.rawInput) {
    return data.location.rawInput
  }
  return null
}

/**
 * Extract date of birth from Affinda data
 */
function extractDateOfBirth(data) {
  if (data.dateOfBirth) {
    // Affinda returns ISO date format
    return data.dateOfBirth
  }
  return null
}

/**
 * Extract professional summary from Affinda data
 */
function extractSummary(data) {
  if (data.summary) {
    return data.summary
  }
  if (data.objective) {
    return data.objective
  }
  return ''
}

/**
 * Extract skills from Affinda data
 */
function extractSkills(data) {
  const skills = []
  
  if (data.skills && Array.isArray(data.skills)) {
    data.skills.forEach(skill => {
      if (skill.name) {
        skills.push(skill.name.toLowerCase())
      } else if (typeof skill === 'string') {
        skills.push(skill.toLowerCase())
      }
    })
  }
  
  // Deduplicate
  return [...new Set(skills)]
}

/**
 * Extract employment history from Affinda data
 */
function extractEmploymentHistory(data) {
  const employment = []
  
  if (data.workExperience && Array.isArray(data.workExperience)) {
    data.workExperience.forEach(job => {
      employment.push({
        company_name: job.organization || 'Unknown',
        job_title: job.jobTitle || job.occupation || '',
        start_date: formatDate(job.dates?.startDate),
        end_date: formatDate(job.dates?.endDate),
        responsibilities: job.jobDescription || '',
        location: job.location?.formatted || null
      })
    })
  }
  
  return employment
}

/**
 * Calculate total years of experience from employment history
 */
function calculateExperienceYears(data) {
  if (!data.workExperience || data.workExperience.length === 0) {
    return 0
  }
  
  let totalMonths = 0
  
  data.workExperience.forEach(job => {
    if (job.dates?.startDate) {
      const start = new Date(job.dates.startDate)
      const end = job.dates?.endDate ? new Date(job.dates.endDate) : new Date()
      
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                     (end.getMonth() - start.getMonth())
      
      totalMonths += Math.max(0, months)
    }
  })
  
  return Math.round(totalMonths / 12)
}

/**
 * Extract education from Affinda data
 */
function extractEducation(data) {
  const education = []
  
  if (data.education && Array.isArray(data.education)) {
    data.education.forEach((edu, index) => {
      education.push({
        id: `edu-${Date.now()}-${index}`,
        degree: edu.accreditation?.education || edu.accreditation?.inputStr || '',
        institution: edu.organization || 'Unknown',
        city: edu.location?.city || '',
        graduation_date: formatDate(edu.dates?.completionDate || edu.dates?.endDate),
        field_of_study: edu.accreditation?.educationLevel || null,
        grade: edu.grade || null
      })
    })
  }
  
  return education
}

/**
 * Extract certifications from Affinda data
 */
function extractCertifications(data) {
  const certifications = []
  
  if (data.certifications && Array.isArray(data.certifications)) {
    data.certifications.forEach(cert => {
      certifications.push({
        title: cert.name || '',
        institution: cert.organization || '',
        start_date: formatDate(cert.date),
        end_date: null
      })
    })
  }
  
  return certifications
}

/**
 * Extract projects from Affinda data
 */
function extractProjects(data) {
  const projects = []
  
  if (data.websites && Array.isArray(data.websites)) {
    data.websites.forEach(website => {
      if (website.url && !isLinkedInUrl(website.url) && !isGenericUrl(website.url)) {
        projects.push({
          name: website.url.split('/').pop() || 'Project',
          url: website.url
        })
      }
    })
  }
  
  return projects
}

/**
 * Extract references from Affinda data
 */
function extractReferences(data) {
  const references = []
  
  if (data.referees && Array.isArray(data.referees)) {
    data.referees.forEach(ref => {
      references.push({
        name: ref.name || '',
        company: ref.company || '',
        phone: ref.phone || '',
        email: ref.email || ''
      })
    })
  }
  
  return references
}

/**
 * Extract languages from Affinda data
 */
function extractLanguages(data) {
  const languages = []
  
  if (data.languages && Array.isArray(data.languages)) {
    data.languages.forEach(lang => {
      if (typeof lang === 'string') {
        languages.push(lang)
      } else if (lang.name) {
        languages.push(lang.name)
      }
    })
  }
  
  return languages
}

/**
 * Extract LinkedIn URL from Affinda data
 */
function extractLinkedIn(data) {
  if (data.websites && Array.isArray(data.websites)) {
    const linkedin = data.websites.find(w => isLinkedInUrl(w.url))
    if (linkedin) return linkedin.url
  }
  
  if (data.linkedin) return data.linkedin
  
  return null
}

/**
 * Extract portfolio URL from Affinda data
 */
function extractPortfolio(data) {
  if (data.websites && Array.isArray(data.websites)) {
    const portfolio = data.websites.find(w => 
      !isLinkedInUrl(w.url) && 
      (w.url.includes('github') || w.url.includes('portfolio') || w.url.includes('behance'))
    )
    if (portfolio) return portfolio.url
  }
  
  return null
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(dateStr) {
  if (!dateStr) return null
  
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (e) {
    return null
  }
}

/**
 * Check if URL is LinkedIn
 */
function isLinkedInUrl(url) {
  return url && url.toLowerCase().includes('linkedin.com')
}

/**
 * Check if URL is generic (email, phone, etc.)
 */
function isGenericUrl(url) {
  return url && (
    url.startsWith('mailto:') ||
    url.startsWith('tel:') ||
    url.includes('facebook.com') ||
    url.includes('twitter.com') ||
    url.includes('instagram.com')
  )
}

/**
 * Calculate confidence score based on extracted data completeness
 * @param {Object} data - Parsed candidate data
 * @returns {number} Confidence score (0-1)
 */
function calculateConfidence(data) {
  let score = 0
  let maxScore = 0
  
  // Critical fields (higher weight)
  const criticalFields = [
    { field: 'full_name', weight: 3, check: (v) => v && v !== 'Unknown' },
    { field: 'email', weight: 3, check: (v) => v && v.includes('@') },
    { field: 'phone_number', weight: 2, check: (v) => v && v.length >= 9 }
  ]
  
  // Important fields
  const importantFields = [
    { field: 'skills', weight: 2, check: (v) => v && v.length > 0 },
    { field: 'employment_history', weight: 2, check: (v) => v && v.length > 0 },
    { field: 'education', weight: 2, check: (v) => v && v.length > 0 }
  ]
  
  // Optional fields
  const optionalFields = [
    { field: 'profile_summary', weight: 1, check: (v) => v && v.length > 50 },
    { field: 'certifications', weight: 1, check: (v) => v && v.length > 0 },
    { field: 'address', weight: 1, check: (v) => v && v.length > 0 }
  ]
  
  const allFields = [...criticalFields, ...importantFields, ...optionalFields]
  
  allFields.forEach(({ field, weight, check }) => {
    maxScore += weight
    if (check(data[field])) {
      score += weight
    }
  })
  
  return maxScore > 0 ? score / maxScore : 0
}

/**
 * Validate parsed CV data
 * @param {Object} data - Parsed CV data
 * @returns {Object} Validation result
 */
export function validateParsedData(data) {
  const errors = []
  const warnings = []
  
  // Critical validations
  if (!data.full_name || data.full_name === 'Unknown') {
    errors.push('Could not extract name from CV')
  }
  
  if (!data.email) {
    errors.push('Could not extract email from CV')
  } else if (!data.email.includes('@')) {
    errors.push('Invalid email format')
  }
  
  // Important validations
  if (!data.skills || data.skills.length === 0) {
    warnings.push('No skills found in CV')
  }
  
  if (!data.employment_history || data.employment_history.length === 0) {
    warnings.push('No work experience found in CV')
  }
  
  if (!data.education || data.education.length === 0) {
    warnings.push('No education found in CV')
  }
  
  // Phone validation
  if (!data.phone_number) {
    warnings.push('No phone number found in CV')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence: calculateConfidence(data)
  }
}

export default {
  parseCV,
  parseWithAffinda,
  validateParsedData,
  calculateConfidence
}
