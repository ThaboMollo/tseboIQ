/**
 * Type definitions for Candidate Profile
 * Used for CV parsing and profile management
 */

/**
 * @typedef {Object} Education
 * @property {string} id - Unique identifier
 * @property {string} institution - Name of educational institution
 * @property {string} degree - Degree or qualification obtained
 * @property {string} [fieldOfStudy] - Field of study
 * @property {string} [startDate] - Start date (YYYY-MM format)
 * @property {string} [endDate] - End date (YYYY-MM format)
 * @property {string} [description] - Additional details
 */

/**
 * @typedef {Object} Experience
 * @property {string} id - Unique identifier
 * @property {string} company - Company name
 * @property {string} position - Job title/position
 * @property {string} [startDate] - Start date (YYYY-MM format)
 * @property {string} [endDate] - End date (YYYY-MM format) or "Present"
 * @property {string} description - Job responsibilities and achievements
 * @property {string[]} [skills] - Skills used in this role
 */

/**
 * @typedef {Object} Certification
 * @property {string} id - Unique identifier
 * @property {string} name - Certification name
 * @property {string} [issuer] - Issuing organization
 * @property {string} [issueDate] - Date issued (YYYY-MM format)
 * @property {string} [expiryDate] - Expiry date (YYYY-MM format)
 * @property {string} [credentialId] - Credential ID or URL
 */

/**
 * @typedef {Object} CandidateProfile
 * @property {string} [id] - Unique profile identifier (from database)
 * @property {string} userId - Associated user ID (from auth)
 * @property {string} fullName - Candidate's full name
 * @property {string} email - Email address
 * @property {string} [phone] - Phone number
 * @property {string} [location] - City, Country
 * @property {string} [linkedinUrl] - LinkedIn profile URL
 * @property {string} [portfolioUrl] - Portfolio or personal website
 * @property {string} [summary] - Professional summary/bio
 * @property {string[]} skills - Array of skills
 * @property {number} [experienceYears] - Total years of experience
 * @property {Experience[]} experience - Work experience array
 * @property {Education[]} education - Education history array
 * @property {Certification[]} [certifications] - Certifications array
 * @property {string[]} [languages] - Languages spoken
 * @property {string} [cvFileUrl] - URL to stored CV file
 * @property {string} [cvFileName] - Original CV filename
 * @property {Date} [createdAt] - Profile creation timestamp
 * @property {Date} [updatedAt] - Last update timestamp
 */

/**
 * @typedef {Object} EmploymentHistory
 * @property {string} company_name - Company name
 * @property {string} job_title - Job title/position
 * @property {string|null} start_date - Start date in YYYY-MM-DD format
 * @property {string|null} end_date - End date in YYYY-MM-DD format (null if current)
 * @property {string} responsibilities - Job responsibilities summary
 */

/**
 * @typedef {Object} EducationEntry
 * @property {string} id - Unique identifier
 * @property {string} degree - Degree or qualification
 * @property {string} institution - Educational institution
 * @property {string} city - City location
 * @property {string} graduation_date - Graduation date in YYYY-MM-DD format
 */

/**
 * @typedef {Object} CertificationEntry
 * @property {string} title - Certification title
 * @property {string} institution - Issuing institution
 * @property {string|null} start_date - Start date in YYYY-MM-DD format
 * @property {string|null} end_date - End date in YYYY-MM-DD format
 */

/**
 * @typedef {Object} Project
 * @property {string} name - Project name
 * @property {string} url - Project URL
 */

/**
 * @typedef {Object} Reference
 * @property {string} name - Reference name
 * @property {string} company - Company name
 * @property {string} phone - Phone number
 * @property {string} email - Email address
 */

/**
 * @typedef {Object} ParsedCVData
 * @property {string} full_name - Candidate's full name
 * @property {string|null} email - Email address
 * @property {string|null} phone_number - Phone number
 * @property {string|null} address - Physical address
 * @property {string|null} nationality - Nationality
 * @property {string|null} gender - Gender
 * @property {string|null} date_of_birth - Date of birth in YYYY-MM-DD format
 * @property {string} profile_summary - Professional summary/profile
 * @property {string[]} skills - Array of skills (lowercase)
 * @property {EmploymentHistory[]} employment_history - Employment history array
 * @property {EducationEntry[]} education - Education history array
 * @property {CertificationEntry[]} certifications - Certifications array
 * @property {Project[]} projects - Projects array
 * @property {Reference[]} references - References array
 */

/**
 * @typedef {Object} UploadResponse
 * @property {boolean} success
 * @property {ParsedCVData} [data]
 * @property {string} [error]
 * @property {string} [fileUrl]
 */

// Export empty object to make this a module
export {}
