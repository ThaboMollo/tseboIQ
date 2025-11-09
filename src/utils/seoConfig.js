/**
 * SEO Configuration for tseboIQ
 * Centralized metadata and schema markup
 */

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://tseboiq.co.za'

export const defaultSEO = {
  title: 'tseboIQ - Smarter Hiring, Powered by Insight',
  description: 'AI-assisted recruitment platform for South African businesses. Automatically shortlist the top 2 candidates from hundreds of resumes using intelligent matching.',
  keywords: 'recruitment, hiring, AI recruitment, South Africa jobs, job matching, candidate shortlisting, tseboIQ',
  author: 'tseboIQ',
  siteUrl: siteUrl,
  ogImage: `${siteUrl}/og-image.jpg`,
  twitterHandle: '@tseboIQ'
}

export const pageSEO = {
  home: {
    title: 'tseboIQ - AI-Powered Recruitment Platform for South Africa',
    description: 'Find the perfect candidates or your dream job with tseboIQ. Our AI-powered platform automatically matches job seekers with employers across South Africa.',
    keywords: 'AI recruitment, South Africa jobs, smart hiring, job matching, candidate screening',
    canonicalUrl: siteUrl
  },
  login: {
    title: 'Sign In - tseboIQ',
    description: 'Sign in to your tseboIQ account to access your dashboard and manage your recruitment or job search.',
    keywords: 'login, sign in, tseboIQ account',
    canonicalUrl: `${siteUrl}/login`
  },
  jobSeekerOnboarding: {
    title: 'Create Your Profile - tseboIQ',
    description: 'Join tseboIQ as a job seeker. Create your professional profile and get matched with top employers in South Africa.',
    keywords: 'job seeker registration, create profile, find jobs South Africa',
    canonicalUrl: `${siteUrl}/job-seeker-onboarding`
  },
  employerDashboard: {
    title: 'Employer Dashboard - tseboIQ',
    description: 'Manage your job postings and discover top candidates with AI-powered matching. Post jobs and get instant candidate recommendations.',
    keywords: 'employer dashboard, post jobs, find candidates, recruitment platform',
    canonicalUrl: `${siteUrl}/employer-dashboard`
  },
  privacyPolicy: {
    title: 'Privacy Policy - tseboIQ',
    description: 'Learn how tseboIQ protects your personal information in accordance with POPIA (Protection of Personal Information Act).',
    keywords: 'privacy policy, POPIA, data protection, personal information',
    canonicalUrl: `${siteUrl}/privacy-policy`
  }
}

/**
 * Generate Organization Schema Markup
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'tseboIQ',
  description: 'AI-assisted recruitment platform for South African businesses',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@tseboiq.co.za',
    contactType: 'Customer Support',
    areaServed: 'ZA'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'ZA'
  },
  sameAs: [
    'https://www.linkedin.com/company/tseboiq',
    'https://twitter.com/tseboiq'
  ]
}

/**
 * Generate WebSite Schema Markup
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'tseboIQ',
  url: siteUrl,
  description: 'Smarter Hiring, Powered by Insight',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
}

/**
 * Generate JobPosting Schema Markup
 */
export const generateJobPostingSchema = (job) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  datePosted: job.created_at,
  employmentType: 'FULL_TIME',
  hiringOrganization: {
    '@type': 'Organization',
    name: job.company_name || 'tseboIQ Partner'
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ZA'
    }
  },
  baseSalary: {
    '@type': 'MonetaryAmount',
    currency: 'ZAR',
    value: {
      '@type': 'QuantitativeValue',
      unitText: 'YEAR'
    }
  }
})

/**
 * Generate BreadcrumbList Schema Markup
 */
export const generateBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.path}`
  }))
})
