/**
 * AI-powered candidate matching algorithm (MVP version)
 * 
 * This algorithm matches candidates to job specifications based on:
 * 1. Skills overlap (primary factor)
 * 2. Experience requirements
 * 3. Weighted scoring system
 * 
 * Future enhancements can include:
 * - NLP-based resume parsing
 * - Machine learning model for better predictions
 * - Education level matching
 * - Location preferences
 */

/**
 * Calculate match score between a candidate and job specification
 * @param {Object} candidate - Candidate object with skills and experience
 * @param {Object} jobSpec - Job specification with required_skills and min_experience
 * @returns {number} Match score (0-100)
 */
export const calculateMatchScore = (candidate, jobSpec) => {
  let score = 0
  
  // Skills matching (70% weight)
  const requiredSkills = jobSpec.required_skills.map(s => s.toLowerCase().trim())
  const candidateSkills = candidate.skills.map(s => s.toLowerCase().trim())
  
  const matchedSkills = candidateSkills.filter(skill => 
    requiredSkills.some(reqSkill => 
      skill.includes(reqSkill) || reqSkill.includes(skill)
    )
  )
  
  const skillsScore = requiredSkills.length > 0 
    ? (matchedSkills.length / requiredSkills.length) * 70 
    : 0
  
  score += skillsScore
  
  // Experience matching (30% weight)
  const minExperience = jobSpec.min_experience || 0
  const candidateExperience = candidate.experience || 0
  
  if (candidateExperience >= minExperience) {
    // Full points if meets minimum
    score += 30
  } else if (candidateExperience >= minExperience * 0.7) {
    // Partial points if close (within 70%)
    score += 20
  } else if (candidateExperience >= minExperience * 0.5) {
    // Minimal points if somewhat close (within 50%)
    score += 10
  }
  
  return Math.round(score)
}

/**
 * Match candidates to a job specification and return top matches
 * @param {Object} jobSpec - Job specification object
 * @param {Array} candidates - Array of candidate objects
 * @param {number} topN - Number of top candidates to return (default: 2)
 * @returns {Array} Array of top matched candidates with scores
 */
export const matchCandidates = (jobSpec, candidates, topN = 2) => {
  if (!jobSpec || !candidates || candidates.length === 0) {
    return []
  }
  
  // Calculate match score for each candidate
  const scoredCandidates = candidates.map(candidate => ({
    ...candidate,
    matchScore: calculateMatchScore(candidate, jobSpec),
    matchedSkills: getMatchedSkills(candidate, jobSpec)
  }))
  
  // Sort by score (descending) and return top N
  return scoredCandidates
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topN)
}

/**
 * Get list of matched skills between candidate and job
 * @param {Object} candidate - Candidate object
 * @param {Object} jobSpec - Job specification object
 * @returns {Array} Array of matched skill names
 */
export const getMatchedSkills = (candidate, jobSpec) => {
  const requiredSkills = jobSpec.required_skills.map(s => s.toLowerCase().trim())
  const candidateSkills = candidate.skills.map(s => s.toLowerCase().trim())
  
  return candidate.skills.filter((skill, index) => 
    requiredSkills.some(reqSkill => 
      candidateSkills[index].includes(reqSkill) || reqSkill.includes(candidateSkills[index])
    )
  )
}

/**
 * Get match quality label based on score
 * @param {number} score - Match score (0-100)
 * @returns {string} Quality label
 */
export const getMatchQuality = (score) => {
  if (score >= 80) return 'Excellent Match'
  if (score >= 60) return 'Good Match'
  if (score >= 40) return 'Fair Match'
  return 'Weak Match'
}

/**
 * Get match quality color for UI
 * @param {number} score - Match score (0-100)
 * @returns {string} Tailwind color class
 */
export const getMatchColor = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-600'
}
