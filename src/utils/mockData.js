/**
 * Mock Data Utilities
 * NOTE: This file contains mock/demo data for development and testing purposes only.
 * In production, all data should come from the backend API.
 * These functions are kept for backward compatibility but should not be used in production.
 */

// Mock data for development/testing only
export const mockCandidates = [
  {
    id: '1',
    name: 'Thabo Molefe',
    email: 'thabo.molefe@example.com',
    phone: '+27 82 123 4567',
    skills: ['JavaScript', 'React', 'Node.js', 'TailwindCSS', 'MongoDB'],
    experience: 5,
    education: 'BSc Computer Science - University of Cape Town',
    cv_url: '/mock-cv/thabo-molefe.pdf',
    created_at: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    name: 'Lerato Nkosi',
    email: 'lerato.nkosi@example.com',
    phone: '+27 83 234 5678',
    skills: ['Python', 'Django', 'PostgreSQL', 'React', 'AWS'],
    experience: 4,
    education: 'BSc Information Technology - University of Pretoria',
    cv_url: '/mock-cv/lerato-nkosi.pdf',
    created_at: new Date('2024-01-20').toISOString()
  },
  {
    id: '3',
    name: 'Sipho Dlamini',
    email: 'sipho.dlamini@example.com',
    phone: '+27 84 345 6789',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'Kubernetes'],
    experience: 6,
    education: 'BSc Computer Engineering - University of Witwatersrand',
    cv_url: '/mock-cv/sipho-dlamini.pdf',
    created_at: new Date('2024-01-25').toISOString()
  },
  {
    id: '4',
    name: 'Nomsa Khumalo',
    email: 'nomsa.khumalo@example.com',
    phone: '+27 85 456 7890',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL'],
    experience: 3,
    education: 'BSc Software Engineering - Stellenbosch University',
    cv_url: '/mock-cv/nomsa-khumalo.pdf',
    created_at: new Date('2024-02-01').toISOString()
  },
  {
    id: '5',
    name: 'Bongani Mthembu',
    email: 'bongani.mthembu@example.com',
    phone: '+27 86 567 8901',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'SQL'],
    experience: 4,
    education: 'MSc Data Science - University of Cape Town',
    cv_url: '/mock-cv/bongani-mthembu.pdf',
    created_at: new Date('2024-02-05').toISOString()
  },
  {
    id: '6',
    name: 'Zanele Ndlovu',
    email: 'zanele.ndlovu@example.com',
    phone: '+27 87 678 9012',
    skills: ['JavaScript', 'Vue.js', 'Node.js', 'Express', 'MongoDB'],
    experience: 3,
    education: 'BSc Computer Science - Rhodes University',
    cv_url: '/mock-cv/zanele-ndlovu.pdf',
    created_at: new Date('2024-02-10').toISOString()
  },
  {
    id: '7',
    name: 'Mandla Zulu',
    email: 'mandla.zulu@example.com',
    phone: '+27 88 789 0123',
    skills: ['C#', '.NET', 'Azure', 'SQL Server', 'Angular'],
    experience: 7,
    education: 'BSc Information Systems - University of Johannesburg',
    cv_url: '/mock-cv/mandla-zulu.pdf',
    created_at: new Date('2024-02-15').toISOString()
  },
  {
    id: '8',
    name: 'Precious Mahlangu',
    email: 'precious.mahlangu@example.com',
    phone: '+27 89 890 1234',
    skills: ['React', 'JavaScript', 'TailwindCSS', 'Firebase', 'Git'],
    experience: 2,
    education: 'BSc Computer Science - University of KwaZulu-Natal',
    cv_url: '/mock-cv/precious-mahlangu.pdf',
    created_at: new Date('2024-02-20').toISOString()
  },
  {
    id: '9',
    name: 'Tshepo Mokoena',
    email: 'tshepo.mokoena@example.com',
    phone: '+27 81 901 2345',
    skills: ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'Docker'],
    experience: 5,
    education: 'BSc Information Technology - North-West University',
    cv_url: '/mock-cv/tshepo-mokoena.pdf',
    created_at: new Date('2024-02-25').toISOString()
  },
  {
    id: '10',
    name: 'Nthabiseng Radebe',
    email: 'nthabiseng.radebe@example.com',
    phone: '+27 82 012 3456',
    skills: ['Python', 'Flask', 'React', 'PostgreSQL', 'AWS'],
    experience: 4,
    education: 'BSc Software Engineering - University of Pretoria',
    cv_url: '/mock-cv/nthabiseng-radebe.pdf',
    created_at: new Date('2024-03-01').toISOString()
  },
  {
    id: '11',
    name: 'Kabelo Moyo',
    email: 'kabelo.moyo@example.com',
    phone: '+27 83 123 4567',
    skills: ['JavaScript', 'React Native', 'Node.js', 'MongoDB', 'Firebase'],
    experience: 3,
    education: 'BSc Computer Science - University of the Free State',
    cv_url: '/mock-cv/kabelo-moyo.pdf',
    created_at: new Date('2024-03-05').toISOString()
  },
  {
    id: '12',
    name: 'Lindiwe Sithole',
    email: 'lindiwe.sithole@example.com',
    phone: '+27 84 234 5678',
    skills: ['Java', 'Spring', 'Hibernate', 'MySQL', 'Jenkins'],
    experience: 6,
    education: 'BSc Information Technology - Tshwane University of Technology',
    cv_url: '/mock-cv/lindiwe-sithole.pdf',
    created_at: new Date('2024-03-10').toISOString()
  }
]

export const mockEmployers = [
  {
    id: 'emp-1',
    company_name: 'TechCorp SA',
    contact_email: 'hr@techcorp.co.za',
    created_at: new Date('2024-01-10').toISOString()
  }
]

export const mockJobs = []

// Local storage keys
const STORAGE_KEYS = {
  CANDIDATES: 'tseboiq_candidates',
  EMPLOYERS: 'tseboiq_employers',
  JOBS: 'tseboiq_jobs'
}

/**
 * Initialize mock data in localStorage
 * WARNING: This should NOT be used in production!
 * Only for development/testing purposes.
 */
export const initializeMockData = () => {
  // Check if we're in production mode
  if (import.meta.env.PROD) {
    console.warn('Mock data initialization skipped in production mode')
    return
  }
  
  // Only initialize if API is not configured (development mode)
  if (import.meta.env.VITE_API_URL) {
    console.log('API configured - skipping mock data initialization')
    return
  }
  
  console.warn('⚠️ Running in development mode with mock data. Configure VITE_API_URL for production.')
  
  if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(mockCandidates))
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYERS)) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(mockEmployers))
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(mockJobs))
  }
}

// Mock database operations
export const mockDB = {
  // Candidates
  getCandidates: async () => {
    const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES)
    return JSON.parse(data || '[]')
  },
  
  addCandidate: async (candidate) => {
    const candidates = await mockDB.getCandidates()
    const newCandidate = {
      ...candidate,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    candidates.push(newCandidate)
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates))
    return newCandidate
  },
  
  getCandidateById: async (id) => {
    const candidates = await mockDB.getCandidates()
    return candidates.find(c => c.id === id)
  },
  
  // Employers
  getEmployers: async () => {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYERS)
    return JSON.parse(data || '[]')
  },
  
  addEmployer: async (employer) => {
    const employers = await mockDB.getEmployers()
    const newEmployer = {
      ...employer,
      id: `emp-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    employers.push(newEmployer)
    localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(employers))
    return newEmployer
  },
  
  // Jobs
  getJobs: async () => {
    const data = localStorage.getItem(STORAGE_KEYS.JOBS)
    return JSON.parse(data || '[]')
  },
  
  addJob: async (job) => {
    const jobs = await mockDB.getJobs()
    const newJob = {
      ...job,
      id: `job-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    jobs.push(newJob)
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs))
    return newJob
  },
  
  getJobsByEmployer: async (employerId) => {
    const jobs = await mockDB.getJobs()
    return jobs.filter(j => j.employer_id === employerId)
  }
}
