import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Configure PDF.js worker - use worker from public folder
// The worker file is copied from node_modules during build
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

/**
 * CV Parser Service
 * Extracts structured data from PDF and DOCX files
 */

/**
 * Extract text from PDF file
 * @param {File} file - PDF file object
 * @returns {Promise<string>} Extracted text content
 */
async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + '\n'
    }
    
    return fullText
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to parse PDF file. Please ensure the file is not corrupted.')
  }
}

/**
 * Extract text from DOCX file
 * @param {File} file - DOCX file object
 * @returns {Promise<string>} Extracted text content
 */
async function extractTextFromDOCX(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } catch (error) {
    console.error('Error extracting text from DOCX:', error)
    throw new Error('Failed to parse DOCX file. Please ensure the file is not corrupted.')
  }
}

/**
 * Extract sections from CV text based on common headings
 * @param {string} text - Full CV text
 * @returns {Object} Sections mapped by heading
 */
function extractSections(text) {
  const sections = {}
  const sectionHeaders = {
    profile: /(?:^|\n)\s*(profile|summary|about\s*me|professional\s*summary|objective)\s*:?\s*\n/gi,
    skills: /(?:^|\n)\s*(skills|technical\s*skills|core\s*competencies|expertise|technologies)\s*:?\s*\n/gi,
    experience: /(?:^|\n)\s*(experience|employment\s*history|work\s*experience|professional\s*experience|career\s*history)\s*:?\s*\n/gi,
    education: /(?:^|\n)\s*(education|academic\s*background|qualifications|academic\s*qualifications)\s*:?\s*\n/gi,
    certifications: /(?:^|\n)\s*(certifications?|courses?|other\s*qualifications|training|professional\s*development)\s*:?\s*\n/gi,
    projects: /(?:^|\n)\s*(projects?|portfolio|work\s*samples)\s*:?\s*\n/gi,
    references: /(?:^|\n)\s*(references?)\s*:?\s*\n/gi
  }

  const lines = text.split('\n')
  let currentSection = null
  let sectionContent = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let foundSection = false

    // Check if this line is a section header
    for (const [sectionName, regex] of Object.entries(sectionHeaders)) {
      regex.lastIndex = 0
      if (regex.test('\n' + line + '\n')) {
        // Save previous section
        if (currentSection && sectionContent.length > 0) {
          sections[currentSection] = sectionContent.join('\n')
        }
        // Start new section
        currentSection = sectionName
        sectionContent = []
        foundSection = true
        break
      }
    }

    if (!foundSection && currentSection) {
      sectionContent.push(line)
    }
  }

  // Save last section
  if (currentSection && sectionContent.length > 0) {
    sections[currentSection] = sectionContent.join('\n')
  }

  return sections
}

/**
 * Extract email from text using regex
 * @param {string} text - Text to search
 * @returns {string|null} Extracted email or null
 */
function extractEmail(text) {
  const emailRegex = /[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/gi
  const matches = text.match(emailRegex)
  return matches ? matches[0].toLowerCase() : null
}

/**
 * Extract phone number from text with multiple format support
 * @param {string} text - Text to search
 * @returns {string|null} Extracted phone or null
 */
function extractPhone(text) {
  const phonePatterns = [
    /(?:phone|tel|cell|mobile)\s*:?\s*([+\d][\d\s().-]{8,})/gi,
    /(?:\+27|0)[\s-]?(?:\d{2}[\s-]?\d{3}[\s-]?\d{4}|\d{3}[\s-]?\d{3}[\s-]?\d{3})/g,
    /\+?\d{1,4}?[\s.-]?\(?\d{1,4}?\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g
  ]
  
  for (const pattern of phonePatterns) {
    const matches = text.match(pattern)
    if (matches) {
      const phone = matches[0].replace(/^(phone|tel|cell|mobile)\s*:?\s*/gi, '').trim()
      if (phone.length >= 9) return phone
    }
  }
  return null
}

/**
 * Extract personal information fields with label detection
 * @param {string} text - Text to search
 * @param {string[]} labels - Possible label variations
 * @returns {string|null} Extracted value or null
 */
function extractLabeledField(text, labels) {
  for (const label of labels) {
    const regex = new RegExp(`${label}\\s*:?\\s*([^\n]+)`, 'gi')
    const match = regex.exec(text)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  return null
}

/**
 * Extract name from text (enhanced with multiple strategies)
 * @param {string} text - Text to search
 * @returns {string} Extracted name
 */
function extractName(text) {
  // Strategy 1: Look for labeled name
  const labeled = extractLabeledField(text, ['name', 'full name', 'candidate name'])
  if (labeled && labeled.length > 3 && labeled.length < 50) {
    return labeled
  }

  // Strategy 2: Get first few lines and look for capitalized words
  const lines = text.split('\n').filter(line => line.trim().length > 0)
  
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim()
    // Skip lines that are too long or contain common CV keywords
    if (line.length > 50 || /curriculum|vitae|resume|cv/i.test(line)) continue
    
    // Look for lines with 2-4 capitalized words (likely a name)
    const words = line.split(/\s+/)
    if (words.length >= 2 && words.length <= 4) {
      const isProperCase = words.every(word => /^[A-Z][a-z]+$/.test(word) || /^[A-Z]\.?$/.test(word))
      if (isProperCase) {
        return line
      }
    }
  }
  
  return 'Unknown'
}

/**
 * Extract address from text
 * @param {string} text - Text to search
 * @returns {string|null} Extracted address or null
 */
function extractAddress(text) {
  const address = extractLabeledField(text, ['address', 'location', 'residence', 'residential address'])
  if (address) return address
  
  // Look for South African postal code patterns
  const postalRegex = /([^\n]*\d{4}[^\n]*)/g
  const matches = text.match(postalRegex)
  if (matches && matches.length > 0) {
    return matches[0].trim()
  }
  
  return null
}

/**
 * Extract nationality from text
 * @param {string} text - Text to search
 * @returns {string|null} Extracted nationality or null
 */
function extractNationality(text) {
  return extractLabeledField(text, ['nationality', 'citizen', 'citizenship'])
}

/**
 * Extract gender from text
 * @param {string} text - Text to search
 * @returns {string|null} Extracted gender or null
 */
function extractGender(text) {
  const gender = extractLabeledField(text, ['gender', 'sex'])
  if (gender) {
    const normalized = gender.toLowerCase()
    if (normalized.includes('male') && !normalized.includes('female')) return 'Male'
    if (normalized.includes('female')) return 'Female'
    return gender
  }
  return null
}

/**
 * Extract date of birth from text
 * @param {string} text - Text to search
 * @returns {string|null} Extracted DOB in YYYY-MM-DD format or null
 */
function extractDateOfBirth(text) {
  const dob = extractLabeledField(text, ['date of birth', 'dob', 'birth date', 'born'])
  if (dob) {
    return normalizeDateString(dob)
  }
  return null
}

/**
 * Normalize date string to YYYY-MM-DD format
 * @param {string} dateStr - Date string in various formats
 * @returns {string|null} Normalized date or null
 */
function normalizeDateString(dateStr) {
  if (!dateStr) return null
  
  // Remove common date prefixes
  dateStr = dateStr.replace(/^(on|from|since)\s+/i, '').trim()
  
  // Try to parse various date formats
  const patterns = [
    // YYYY-MM-DD or YYYY/MM/DD
    /\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/,
    // DD-MM-YYYY or DD/MM/YYYY
    /\b(\d{1,2})[-/](\d{1,2})[-/](\d{4})\b/,
    // Month DD, YYYY
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})\b/i,
    // DD Month YYYY
    /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b/i
  ]
  
  for (const pattern of patterns) {
    const match = dateStr.match(pattern)
    if (match) {
      try {
        let year, month, day
        
        if (pattern === patterns[0]) {
          // YYYY-MM-DD
          [, year, month, day] = match
        } else if (pattern === patterns[1]) {
          // DD-MM-YYYY
          [, day, month, year] = match
        } else if (pattern === patterns[2]) {
          // Month DD, YYYY
          const monthMap = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12}
          month = monthMap[match[1].toLowerCase().substring(0,3)]
          day = match[2]
          year = match[3]
        } else if (pattern === patterns[3]) {
          // DD Month YYYY
          const monthMap = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12}
          day = match[1]
          month = monthMap[match[2].toLowerCase().substring(0,3)]
          year = match[3]
        }
        
        month = String(month).padStart(2, '0')
        day = String(day).padStart(2, '0')
        return `${year}-${month}-${day}`
      } catch (e) {
        continue
      }
    }
  }
  
  return null
}

/**
 * Extract professional summary from text
 * @param {string} text - Text to search
 * @param {Object} sections - Pre-extracted sections
 * @returns {string} Extracted summary
 */
function extractProfileSummary(text, sections = {}) {
  // First check if we have a profile section
  if (sections.profile) {
    const summary = sections.profile.trim()
    if (summary.length > 50) {
      return summary
    }
  }
  
  // Look for summary-like paragraphs in first part of CV
  const lines = text.split('\n')
  let summaryLines = []
  let foundStart = false
  
  for (let i = 0; i < Math.min(30, lines.length); i++) {
    const line = lines[i].trim()
    
    // Skip header lines
    if (line.length < 50 || /^(name|email|phone|address)/i.test(line)) continue
    
    // Look for paragraph-like content
    if (line.length > 100 && !foundStart) {
      foundStart = true
      summaryLines.push(line)
    } else if (foundStart && line.length > 50) {
      summaryLines.push(line)
    } else if (foundStart && summaryLines.length > 0) {
      break
    }
  }
  
  return summaryLines.join(' ').substring(0, 500)
}

/**
 * Extract skills from text with enhanced detection
 * @param {string} text - Text to search
 * @param {Object} sections - Pre-extracted sections
 * @returns {string[]} Array of extracted skills (lowercase, deduplicated)
 */
function extractSkills(text, sections = {}) {
  // Expanded technical skills database
  const commonSkills = [
    // Frontend
    'reactjs', 'react', 'vuejs', 'vue', 'angular', 'angularjs', 'svelte', 'nextjs', 'nuxtjs',
    'javascript', 'typescript', 'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less',
    'tailwindcss', 'tailwind', 'bootstrap', 'material-ui', 'mui', 'chakra ui',
    'webpack', 'vite', 'parcel', 'rollup', 'babel',
    // Backend
    'nodejs', 'node.js', 'express', 'expressjs', 'nestjs', 'fastify', 'koa',
    'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'spring boot',
    'c#', '.net', 'asp.net', '.net core', 'php', 'laravel', 'symfony', 'codeigniter',
    'ruby', 'ruby on rails', 'rails', 'go', 'golang', 'rust', 'elixir', 'phoenix',
    // Mobile
    'flutter', 'react native', 'swift', 'kotlin', 'java', 'android', 'ios', 'xamarin',
    // Databases
    'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch',
    'cassandra', 'dynamodb', 'firebase', 'firestore', 'sqlite', 'oracle', 'mssql',
    'mariadb', 'couchdb', 'neo4j',
    // Cloud & DevOps
    'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud',
    'docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab ci', 'github actions', 'circleci',
    'terraform', 'ansible', 'chef', 'puppet', 'vagrant', 'nginx', 'apache',
    // Tools & Platforms
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'trello',
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'invision',
    // Architecture & Patterns
    'rest api', 'restful', 'graphql', 'grpc', 'microservices', 'serverless',
    'mvc', 'mvvm', 'clean architecture', 'domain-driven design', 'ddd',
    // Testing
    'jest', 'mocha', 'chai', 'jasmine', 'pytest', 'junit', 'selenium', 'cypress',
    'playwright', 'testing library', 'enzyme',
    // Data & AI
    'machine learning', 'ml', 'ai', 'artificial intelligence', 'data science',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
    'data analysis', 'data visualization', 'power bi', 'tableau', 'looker',
    // Methodologies
    'agile', 'scrum', 'kanban', 'waterfall', 'devops', 'ci/cd', 'tdd', 'bdd',
    // Other
    'linux', 'unix', 'windows', 'macos', 'bash', 'powershell', 'vim', 'vscode',
    'excel', 'word', 'powerpoint', 'sap', 'salesforce', 'crm', 'erp'
  ]
  
  const foundSkills = new Set()
  const searchText = sections.skills || text
  const lowerText = searchText.toLowerCase()
  
  // Remove bullet points and normalize
  const cleanText = lowerText
    .replace(/[•●○■□▪▫]/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
  
  // Match skills from database
  commonSkills.forEach(skill => {
    const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (skillPattern.test(cleanText)) {
      foundSkills.add(skill.toLowerCase())
    }
  })
  
  // Extract comma-separated or bullet-pointed skills
  const skillLines = cleanText.split(/[\n,;]/).map(s => s.trim()).filter(s => s.length > 0)
  skillLines.forEach(line => {
    // If line is short (likely a skill), add it
    if (line.length > 2 && line.length < 30 && !line.includes(' ') || line.split(' ').length <= 3) {
      const cleaned = line.replace(/^[-•●○■□▪▫]\s*/, '').trim()
      if (cleaned.length > 2) {
        foundSkills.add(cleaned)
      }
    }
  })
  
  // Remove common non-skill words
  const excludeWords = ['skilled', 'experienced', 'proficient', 'knowledge', 'experience', 'skills', 'and', 'or', 'the', 'with', 'in']
  const filtered = Array.from(foundSkills).filter(skill => 
    !excludeWords.includes(skill) && skill.length > 1
  )
  
  return filtered
}

/**
 * Extract education information with enhanced parsing
 * @param {string} text - Text to search
 * @param {Object} sections - Pre-extracted sections
 * @returns {Array} Array of education objects
 */
function extractEducation(text, sections = {}) {
  const education = []
  const searchText = sections.education || text
  const lines = searchText.split('\n')
  
  // Common degree patterns
  const degreePatterns = [
    /(?:bachelor|b\.?sc|b\.?a|b\.?eng|b\.?tech|bsc|ba|beng|btech)\s*(?:in|of)?\s*([\w\s]+)/gi,
    /(?:master|m\.?sc|m\.?a|m\.?eng|m\.?tech|mba|msc|ma|meng|mtech)\s*(?:in|of)?\s*([\w\s]+)/gi,
    /(?:phd|doctorate|ph\.?d)\s*(?:in|of)?\s*([\w\s]+)/gi,
    /(?:diploma|certificate|associate)\s*(?:in|of)?\s*([\w\s]+)/gi
  ]
  
  // Common institutions (expanded)
  const institutions = [
    'North-West University', 'NWU',
    'UCT', 'University of Cape Town',
    'Wits', 'University of the Witwatersrand',
    'Stellenbosch', 'University of Stellenbosch',
    'UP', 'University of Pretoria',
    'UJ', 'University of Johannesburg',
    'UNISA', 'University of South Africa',
    'Rhodes University', 'UFS', 'University of the Free State',
    'UKZN', 'University of KwaZulu-Natal',
    'Walter Sisulu University', 'WSU',
    'Tshwane University of Technology', 'TUT',
    'Cape Peninsula University of Technology', 'CPUT',
    'Durban University of Technology', 'DUT',
    'Vaal University of Technology', 'VUT'
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.length < 5) continue
    
    // Check if line contains degree pattern
    for (const pattern of degreePatterns) {
      pattern.lastIndex = 0
      const match = pattern.exec(line)
      if (match) {
        const edu = {
          id: `edu-${Date.now()}-${i}`,
          degree: match[0],
          institution: '',
          city: '',
          graduation_date: ''
        }
        
        // Look for institution in nearby lines
        for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 4); j++) {
          const nearbyLine = lines[j]
          for (const inst of institutions) {
            if (nearbyLine.toLowerCase().includes(inst.toLowerCase())) {
              edu.institution = inst
              // Try to extract city from same line
              const cityMatch = nearbyLine.match(/,\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/)
              if (cityMatch) edu.city = cityMatch[1]
              break
            }
          }
          
          // Look for graduation date
          const dateMatch = nearbyLine.match(/(\d{4})|(\d{1,2}[-/]\d{1,2}[-/]\d{4})/)
          if (dateMatch && !edu.graduation_date) {
            edu.graduation_date = normalizeDateString(dateMatch[0]) || dateMatch[0]
          }
        }
        
        if (!edu.institution) edu.institution = 'Unknown'
        education.push(edu)
        break
      }
    }
  }
  
  return education
}

/**
 * Extract employment history with enhanced parsing
 * @param {string} text - Text to search
 * @param {Object} sections - Pre-extracted sections
 * @returns {Array} Array of employment objects
 */
function extractEmploymentHistory(text, sections = {}) {
  const employment = []
  const searchText = sections.experience || text
  const lines = searchText.split('\n')
  
  // Enhanced job title patterns
  const titlePatterns = [
    /(?:senior|junior|lead|principal|intermediate|associate)?\s*(?:software|web|mobile|frontend|backend|full[\s-]?stack)?\s*(?:developer|engineer|programmer|architect)/gi,
    /(?:project|product|program|technical|engineering)\s*(?:manager|lead|director)/gi,
    /(?:data|business|systems?)\s*analyst/gi,
    /(?:ui|ux|graphic|web)\s*designer/gi,
    /(?:devops|system|network|security)\s*engineer/gi,
    /(?:qa|quality assurance)\s*(?:engineer|analyst|tester)/gi,
    /(?:scrum master|agile coach|product owner)/gi
  ]
  
  let currentJob = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.length < 5) continue
    
    // Check for job title
    let foundTitle = false
    for (const pattern of titlePatterns) {
      pattern.lastIndex = 0
      if (pattern.test(line)) {
        // Save previous job if exists
        if (currentJob) {
          employment.push(currentJob)
        }
        
        currentJob = {
          company_name: '',
          job_title: line,
          start_date: null,
          end_date: null,
          responsibilities: ''
        }
        foundTitle = true
        break
      }
    }
    
    if (foundTitle) continue
    
    // If we have a current job, look for company, dates, and description
    if (currentJob) {
      // Look for company name (usually follows job title)
      if (!currentJob.company_name && line.length > 3 && line.length < 60) {
        // Check if it's not a date or description
        if (!/^\d|present|current/i.test(line) && !line.includes('•')) {
          currentJob.company_name = line
          continue
        }
      }
      
      // Look for dates
      const datePattern = /(\d{4}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/gi
      const currentPattern = /(?:present|current|ongoing|now)/i
      
      if (datePattern.test(line) || currentPattern.test(line)) {
        const dates = line.match(datePattern)
        if (dates && dates.length >= 1) {
          currentJob.start_date = normalizeDateString(dates[0])
          if (dates.length >= 2) {
            currentJob.end_date = normalizeDateString(dates[1])
          }
        }
        if (currentPattern.test(line)) {
          currentJob.end_date = null // Current employer
        }
        continue
      }
      
      // Collect responsibilities (bullet points or paragraphs)
      if (line.length > 20 && (line.includes('•') || line.includes('-') || /^[A-Z]/.test(line))) {
        const cleaned = line.replace(/^[•-]\s*/, '')
        currentJob.responsibilities += (currentJob.responsibilities ? ' ' : '') + cleaned
      }
    }
  }
  
  // Add last job
  if (currentJob) {
    employment.push(currentJob)
  }
  
  // Clean up and validate
  return employment.filter(job => job.company_name || job.responsibilities).map(job => ({
    ...job,
    company_name: job.company_name || 'Unknown',
    responsibilities: job.responsibilities.substring(0, 500)
  }))
}

/**
 * Extract certifications and courses
 * @param {string} text - Text to search
 * @param {Object} sections - Pre-extracted sections
 * @returns {Array} Array of certification objects
 */
function extractCertifications(text, sections = {}) {
  const certifications = []
  const searchText = sections.certifications || text
  const lines = searchText.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.length < 5) continue
    
    // Skip section headers
    if (/^(?:certifications?|courses?|training)/i.test(line)) continue
    
    // Look for certification patterns
    const cert = {
      title: '',
      institution: '',
      start_date: null,
      end_date: null
    }
    
    // Extract title (usually the main line)
    if (line.includes('–') || line.includes('-')) {
      const parts = line.split(/[–-]/)
      cert.title = parts[0].trim()
      cert.institution = parts[1]?.trim() || ''
    } else {
      cert.title = line.replace(/^[•-]\s*/, '').trim()
      // Look for institution in next line
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim()
        if (nextLine.length > 0 && nextLine.length < 50 && !/^\d/.test(nextLine)) {
          cert.institution = nextLine
          i++ // Skip next line
        }
      }
    }
    
    // Look for dates in nearby lines
    for (let j = i; j < Math.min(lines.length, i + 3); j++) {
      const dateMatch = lines[j].match(/(\d{4})|(\d{1,2}[-/]\d{1,2}[-/]\d{4})/g)
      if (dateMatch && dateMatch.length >= 1) {
        cert.start_date = normalizeDateString(dateMatch[0])
        if (dateMatch.length >= 2) {
          cert.end_date = normalizeDateString(dateMatch[1])
        }
        break
      }
    }
    
    if (cert.title && cert.title.length > 3) {
      certifications.push(cert)
    }
  }
  
  return certifications
}

/**
 * Extract projects from text
 * @param {string} text - Text to search
 * @param {Object} sections - Pre-extracted sections
 * @returns {Array} Array of project objects
 */
function extractProjects(text, sections = {}) {
  const projects = []
  const searchText = sections.projects || text
  const lines = searchText.split('\n')
  
  const urlPattern = /https?:\/\/[^\s]+/gi
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.length < 5) continue
    
    // Look for URLs
    const urls = line.match(urlPattern)
    if (urls) {
      urls.forEach(url => {
        // Try to extract project name from same line or previous line
        let name = line.replace(url, '').replace(/^[•-]\s*/, '').trim()
        if (!name && i > 0) {
          name = lines[i - 1].trim()
        }
        
        projects.push({
          name: name || 'Project',
          url: url.trim()
        })
      })
    }
  }
  
  return projects
}

/**
 * Extract references from text
 * @param {string} text - Text to search
 * @param {Object} sections - Pre-extracted sections
 * @returns {Array} Array of reference objects
 */
function extractReferences(text, sections = {}) {
  const references = []
  const searchText = sections.references || text
  const lines = searchText.split('\n').filter(l => l.trim().length > 0)
  
  let currentRef = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip section header
    if (/^references?$/i.test(line)) continue
    
    // Look for name pattern (capitalized words)
    const namePattern = /^(?:Mr\.?|Mrs\.?|Ms\.?|Miss|Dr\.?)?\s*([A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z]+)+)/
    const nameMatch = line.match(namePattern)
    
    if (nameMatch) {
      // Save previous reference
      if (currentRef && currentRef.name) {
        references.push(currentRef)
      }
      
      currentRef = {
        name: nameMatch[0].trim(),
        company: '',
        phone: '',
        email: ''
      }
    } else if (currentRef) {
      // Extract company, phone, email from subsequent lines
      const email = extractEmail(line)
      const phone = extractPhone(line)
      
      if (email) currentRef.email = email
      if (phone) currentRef.phone = phone
      
      // If line doesn't contain email/phone, might be company
      if (!email && !phone && line.length > 3 && line.length < 60) {
        if (!currentRef.company) {
          currentRef.company = line
        }
      }
    }
  }
  
  // Add last reference
  if (currentRef && currentRef.name) {
    references.push(currentRef)
  }
  
  return references
}

/**
 * Parse CV file and extract structured data
 * @param {File} file - CV file (PDF or DOCX)
 * @returns {Promise<ParsedCVData>} Parsed CV data
 */
export async function parseCV(file) {
  // Validate file type
  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a PDF or DOCX file.')
  }
  
  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit.')
  }
  
  try {
    // Extract text based on file type
    let text = ''
    if (file.type === 'application/pdf') {
      text = await extractTextFromPDF(file)
    } else {
      text = await extractTextFromDOCX(file)
    }
    
    // Extract sections for better parsing
    const sections = extractSections(text)
    
    // Parse the extracted text with enhanced extraction
    const parsedData = {
      full_name: extractName(text),
      email: extractEmail(text),
      phone_number: extractPhone(text),
      address: extractAddress(text),
      nationality: extractNationality(text),
      gender: extractGender(text),
      date_of_birth: extractDateOfBirth(text),
      profile_summary: extractProfileSummary(text, sections),
      skills: extractSkills(text, sections),
      employment_history: extractEmploymentHistory(text, sections),
      education: extractEducation(text, sections),
      certifications: extractCertifications(text, sections),
      projects: extractProjects(text, sections),
      references: extractReferences(text, sections)
    }
    
    // Log confidence for debugging
    console.log('CV Parsing Complete:', {
      name: parsedData.full_name !== 'Unknown',
      email: !!parsedData.email,
      phone: !!parsedData.phone_number,
      skills: parsedData.skills.length,
      employment: parsedData.employment_history.length,
      education: parsedData.education.length,
      certifications: parsedData.certifications.length,
      projects: parsedData.projects.length,
      references: parsedData.references.length
    })
    
    return parsedData
  } catch (error) {
    console.error('Error parsing CV:', error)
    throw error
  }
}

/**
 * Validate parsed CV data
 * @param {ParsedCVData} data - Parsed CV data
 * @returns {Object} Validation result with errors
 */
export function validateParsedData(data) {
  const errors = []
  
  if (!data.fullName || data.fullName === 'Unknown') {
    errors.push('Could not extract name from CV')
  }
  
  if (!data.email) {
    errors.push('Could not extract email from CV')
  }
  
  if (data.skills.length === 0) {
    errors.push('No skills found in CV')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
