# Matching Algorithm Documentation

## Overview

tseboIQ uses an intelligent weighted scoring algorithm to match candidates with jobs and vice versa. The algorithm calculates a match score (0-100) based on skills overlap and experience requirements.

## Algorithm Breakdown

### Scoring Weights

The algorithm uses a **70/30 split**:

- **70% Skills Match** - Primary factor for compatibility
- **30% Experience Match** - Secondary factor for suitability

### Skills Matching (70% weight)

**How it works:**
1. Compare candidate skills with required job skills
2. Use case-insensitive partial matching
3. Count matched skills
4. Calculate percentage: `(matched_skills / required_skills) × 70`

**Example:**
```javascript
Job requires: ['React', 'Node.js', 'TypeScript', 'AWS']
Candidate has: ['React', 'Node.js', 'JavaScript', 'Docker']

Matched: ['React', 'Node.js'] = 2 out of 4
Skills score: (2/4) × 70 = 35 points
```

**Matching Logic:**
- Exact match: "React" matches "React"
- Partial match: "React" matches "ReactJS"
- Case insensitive: "react" matches "React"

### Experience Matching (30% weight)

**How it works:**
1. Compare candidate experience years with minimum requirement
2. Award points based on how close they are
3. Maximum 30 points if requirements are met

**Scoring Tiers:**
- **30 points** - Meets or exceeds minimum (100%+)
- **20 points** - Close to minimum (70-99%)
- **10 points** - Somewhat close (50-69%)
- **0 points** - Below 50% of minimum

**Example:**
```javascript
Job requires: 5 years minimum
Candidate has: 6 years
Experience score: 30 points (meets requirement)

Job requires: 5 years minimum
Candidate has: 4 years (80% of requirement)
Experience score: 20 points (close)
```

**Experience Level Mapping:**
```javascript
'entry' → 0 years
'mid' → 3 years
'senior' → 6 years
'lead' → 10 years
'principal' → 10 years
```

## Total Match Score

**Formula:**
```
Match Score = Skills Score + Experience Score
Range: 0-100
```

**Example Calculation:**

**Scenario 1: Excellent Match**
```
Job: Senior React Developer
- Required skills: React, TypeScript, Node.js, AWS (4 skills)
- Min experience: 5 years

Candidate:
- Skills: React, TypeScript, Node.js, Docker, Python (5 skills)
- Experience: 6 years

Calculation:
- Skills: 3/4 matched = (3/4) × 70 = 52.5 points
- Experience: 6 ≥ 5 = 30 points
- Total: 82.5 → 83% match (Excellent Match)
```

**Scenario 2: Good Match**
```
Job: Full Stack Developer
- Required skills: React, Python, PostgreSQL, Docker (4 skills)
- Min experience: 3 years

Candidate:
- Skills: React, Python, MySQL, JavaScript (4 skills)
- Experience: 4 years

Calculation:
- Skills: 2/4 matched = (2/4) × 70 = 35 points
- Experience: 4 ≥ 3 = 30 points
- Total: 65% match (Good Match)
```

**Scenario 3: Fair Match**
```
Job: Junior Developer
- Required skills: JavaScript, HTML, CSS, Git (4 skills)
- Min experience: 1 year

Candidate:
- Skills: JavaScript, HTML, Python (3 skills)
- Experience: 0.5 years (50% of requirement)

Calculation:
- Skills: 2/4 matched = (2/4) × 70 = 35 points
- Experience: 0.5 is 50% of 1 = 10 points
- Total: 45% match (Fair Match)
```

## Match Quality Labels

Based on the final score, matches are categorized:

| Score Range | Label | Color | Description |
|------------|-------|-------|-------------|
| 80-100 | Excellent Match | Green | Highly compatible |
| 60-79 | Good Match | Blue | Strong compatibility |
| 40-59 | Fair Match | Yellow | Moderate compatibility |
| 0-39 | Weak Match | Red | Low compatibility |

## Implementation

### In CandidateDashboard

```javascript
// Load jobs from Supabase
const jobs = await supabase.from('jobs').select('*').limit(10)

// Calculate match scores
const matchedJobs = jobs.map(job => {
  const candidateProfile = {
    skills: candidate.skills,
    experience: candidate.experience_years
  }
  
  const jobSpec = {
    required_skills: job.skills,
    min_experience: getExperienceYears(job.experienceLevel)
  }
  
  const matchScore = calculateMatchScore(candidateProfile, jobSpec)
  
  return { ...job, matchScore }
})

// Sort by score and take top 2
const top2 = matchedJobs
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 2)
```

### In EmployerDashboard

```javascript
// Load candidates from Supabase
const candidates = await supabase.from('candidates').select('*').limit(20)

// Calculate match scores
const matchedCandidates = candidates.map(candidate => {
  const candidateProfile = {
    skills: candidate.skills,
    experience: candidate.experience_years
  }
  
  const jobSpec = {
    required_skills: job.skills,
    min_experience: getExperienceYears(job.experienceLevel)
  }
  
  const matchScore = calculateMatchScore(candidateProfile, jobSpec)
  
  return { ...candidate, matchScore }
})

// Sort by score and take top 2
const top2 = matchedCandidates
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 2)
```

## Algorithm Functions

### `calculateMatchScore(candidate, jobSpec)`

**Parameters:**
- `candidate` - Object with `skills` (array) and `experience` (number)
- `jobSpec` - Object with `required_skills` (array) and `min_experience` (number)

**Returns:**
- Number (0-100) - Match score

**Example:**
```javascript
const score = calculateMatchScore(
  { skills: ['React', 'Node.js'], experience: 5 },
  { required_skills: ['React', 'TypeScript'], min_experience: 3 }
)
// Returns: 65
```

### `getMatchedSkills(candidate, jobSpec)`

**Parameters:**
- `candidate` - Candidate object
- `jobSpec` - Job specification object

**Returns:**
- Array of matched skill names

**Example:**
```javascript
const matched = getMatchedSkills(
  { skills: ['React', 'Node.js', 'Python'] },
  { required_skills: ['React', 'TypeScript'] }
)
// Returns: ['React']
```

### `getMatchQuality(score)`

**Parameters:**
- `score` - Number (0-100)

**Returns:**
- String - Quality label

**Example:**
```javascript
getMatchQuality(85) // Returns: 'Excellent Match'
getMatchQuality(65) // Returns: 'Good Match'
getMatchQuality(45) // Returns: 'Fair Match'
getMatchQuality(25) // Returns: 'Weak Match'
```

### `getMatchColor(score)`

**Parameters:**
- `score` - Number (0-100)

**Returns:**
- String - Tailwind color class

**Example:**
```javascript
getMatchColor(85) // Returns: 'text-green-600'
getMatchColor(65) // Returns: 'text-blue-600'
```

## Data Flow

```
1. User views dashboard
   ↓
2. Load candidate/job data from Supabase
   ↓
3. For each candidate/job:
   a. Extract skills and experience
   b. Calculate match score using algorithm
   c. Attach score to record
   ↓
4. Sort all records by match score (descending)
   ↓
5. Take top 2 matches
   ↓
6. Display in dashboard with score and details
```

## Advantages

✅ **Simple and Transparent** - Easy to understand and explain
✅ **Fast Computation** - No API calls needed, instant results
✅ **Customizable Weights** - Can adjust 70/30 split as needed
✅ **Partial Matching** - Catches similar skills (React/ReactJS)
✅ **Experience Tiers** - Rewards close matches, not just exact
✅ **Real-time** - Calculates on-the-fly from Supabase data

## Limitations & Future Enhancements

### Current Limitations
- ❌ No semantic understanding (can't match "JavaScript" with "JS")
- ❌ No skill importance weighting (all skills equal)
- ❌ No location matching
- ❌ No education level consideration
- ❌ No industry/domain matching

### Future Enhancements

**Phase 2:**
- [ ] Skill synonyms database (JS = JavaScript, React = ReactJS)
- [ ] Weighted skills (mark some as "must-have")
- [ ] Location preference matching
- [ ] Education level requirements

**Phase 3:**
- [ ] NLP-based semantic matching
- [ ] Machine learning model for better predictions
- [ ] Historical success rate tracking
- [ ] Personalized recommendations based on user behavior

**Phase 4:**
- [ ] Industry-specific matching rules
- [ ] Company culture fit analysis
- [ ] Salary expectation matching
- [ ] Interview success prediction

## Testing

### Unit Tests

```javascript
describe('Matching Algorithm', () => {
  it('should calculate perfect match', () => {
    const score = calculateMatchScore(
      { skills: ['React', 'Node.js'], experience: 5 },
      { required_skills: ['React', 'Node.js'], min_experience: 3 }
    )
    expect(score).toBe(100)
  })
  
  it('should calculate partial match', () => {
    const score = calculateMatchScore(
      { skills: ['React'], experience: 5 },
      { required_skills: ['React', 'Node.js'], min_experience: 3 }
    )
    expect(score).toBe(65) // 35 (skills) + 30 (experience)
  })
  
  it('should handle no skills match', () => {
    const score = calculateMatchScore(
      { skills: ['Python'], experience: 5 },
      { required_skills: ['React', 'Node.js'], min_experience: 3 }
    )
    expect(score).toBe(30) // 0 (skills) + 30 (experience)
  })
})
```

## Performance

- **Computation Time:** < 1ms per match
- **Memory Usage:** Minimal (in-memory calculation)
- **Scalability:** Can handle 1000+ candidates/jobs efficiently
- **Database Queries:** 2 queries per dashboard load (jobs + candidates)

## Configuration

To adjust the algorithm weights, edit `src/utils/matchingAlgorithm.js`:

```javascript
// Current: 70% skills, 30% experience
const skillsScore = (matchedSkills.length / requiredSkills.length) * 70
score += 30 // experience points

// To change to 60% skills, 40% experience:
const skillsScore = (matchedSkills.length / requiredSkills.length) * 60
score += 40 // experience points
```

---

**Last updated:** November 9, 2024

For questions or suggestions, see the main README or contact the development team.
