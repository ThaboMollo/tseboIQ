# API Service Layer Guide

## Overview
The API service layer (`src/services/api.js`) provides a clean interface for communicating with the tseboIQ .NET Web API backend.

## Configuration

The API base URL is configured via environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

## Available Functions

### CV Parsing

#### `parseCVAPI(file)`
Parse a CV file using the backend API.

```javascript
import { parseCVAPI } from '../services/api'

const file = document.querySelector('input[type="file"]').files[0]
const result = await parseCVAPI(file)
```

**Endpoint:** `POST /api/cv/parse`  
**Request:** FormData with CV file  
**Response:**
```json
{
  "success": true,
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "skills": ["React", "Node.js"],
    ...
  }
}
```

---

### Candidate Management

#### `createCandidate(candidateData)`
Create a new candidate profile.

```javascript
import { createCandidate } from '../services/api'

const candidate = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  skills: ["React", "Node.js"],
  ...
}

const result = await createCandidate(candidate)
```

**Endpoint:** `POST /api/candidate`  
**Request Body:** Candidate object  
**Response:**
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  ...
}
```

---

#### `updateCandidate(id, candidateData)`
Update an existing candidate profile.

```javascript
import { updateCandidate } from '../services/api'

const updates = {
  phone: "+9876543210",
  skills: ["React", "Node.js", "TypeScript"]
}

const result = await updateCandidate("candidate-id", updates)
```

**Endpoint:** `PUT /api/candidate/:id`  
**Request Body:** Partial candidate object  
**Response:** Updated candidate object

---

#### `getCandidate(id)`
Retrieve a candidate profile by ID.

```javascript
import { getCandidate } from '../services/api'

const candidate = await getCandidate("candidate-id")
```

**Endpoint:** `GET /api/candidate/:id`  
**Response:** Candidate object

---

### Job Management

#### `createJob(jobData)`
Create a new job posting.

```javascript
import { createJob } from '../services/api'

const job = {
  jobTitle: "Senior React Developer",
  companyName: "TechCorp",
  location: "Remote",
  jobType: "full-time",
  experienceLevel: "senior",
  skills: ["React", "TypeScript"],
  ...
}

const result = await createJob(job)
```

**Endpoint:** `POST /api/job`  
**Request Body:** Job object  
**Response:**
```json
{
  "id": "uuid",
  "jobTitle": "Senior React Developer",
  ...
}
```

---

#### `updateJob(id, jobData)`
Update an existing job posting.

```javascript
import { updateJob } from '../services/api'

const updates = {
  salaryRange: "$120k - $160k",
  skills: ["React", "TypeScript", "GraphQL"]
}

const result = await updateJob("job-id", updates)
```

**Endpoint:** `PUT /api/job/:id`  
**Request Body:** Partial job object  
**Response:** Updated job object

---

#### `getJob(id)`
Retrieve a job posting by ID.

```javascript
import { getJob } from '../services/api'

const job = await getJob("job-id")
```

**Endpoint:** `GET /api/job/:id`  
**Response:** Job object

---

#### `getEmployerJobs(employerId)`
Get all jobs posted by an employer.

```javascript
import { getEmployerJobs } from '../services/api'

const jobs = await getEmployerJobs("employer-id")
```

**Endpoint:** `GET /api/job/employer/:employerId`  
**Response:** Array of job objects

---

### Matching

#### `getTop2Matches(id, type)`
Get the top 2 matches for a candidate or job.

```javascript
import { getTop2Matches } from '../services/api'

// For candidate - get top 2 job matches
const jobMatches = await getTop2Matches("candidate-id", "candidate")

// For job - get top 2 candidate matches
const candidateMatches = await getTop2Matches("job-id", "job")
```

**Endpoint:** `GET /api/match/top2/:id?type={type}`  
**Parameters:**
- `id`: Candidate ID or Job ID
- `type`: "candidate" or "job"

**Response:**
```json
[
  {
    "id": "match-id",
    "matchScore": 95,
    "jobTitle": "Senior React Developer",
    "companyName": "TechCorp",
    ...
  },
  {
    "id": "match-id-2",
    "matchScore": 88,
    ...
  }
]
```

---

#### `getAllMatches(id, type)`
Get all matches for a candidate or job.

```javascript
import { getAllMatches } from '../services/api'

// For candidate - get all job matches
const allJobMatches = await getAllMatches("candidate-id", "candidate")

// For job - get all candidate matches
const allCandidateMatches = await getAllMatches("job-id", "job")
```

**Endpoint:** `GET /api/match/:id?type={type}`  
**Response:** Array of match objects

---

## Error Handling

All API functions throw errors that should be caught:

```javascript
try {
  const result = await createCandidate(candidateData)
  console.log('Success:', result)
} catch (error) {
  console.error('API Error:', error.message)
  // Handle error (show toast, etc.)
}
```

**Error Response Format:**
```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## Usage in Components

### Example: CandidateForm

```javascript
import { parseCVAPI } from '../services/api'

const handleParse = async () => {
  try {
    const result = await parseCVAPI(file)
    setFormData(result.data)
  } catch (error) {
    setError(error.message)
  }
}
```

### Example: CandidateDashboard

```javascript
import { getCandidate, getTop2Matches } from '../services/api'

const loadData = async () => {
  try {
    const candidate = await getCandidate(userId)
    const matches = await getTop2Matches(userId, 'candidate')
    
    setProfile(candidate)
    setTopMatches(matches)
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  }
}
```

### Example: EmployerDashboard

```javascript
import { getEmployerJobs, getTop2Matches } from '../services/api'

const loadData = async () => {
  try {
    const jobs = await getEmployerJobs(userId)
    const matches = await getTop2Matches(jobs[0].id, 'job')
    
    setJobs(jobs)
    setTopMatches(matches)
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  }
}
```

---

## Backend Implementation Notes

The .NET Web API should implement these endpoints with:

1. **Authentication:** JWT tokens or session-based auth
2. **Validation:** Input validation and sanitization
3. **Error Handling:** Consistent error response format
4. **CORS:** Enable CORS for frontend origin
5. **Rate Limiting:** Prevent abuse
6. **Logging:** Request/response logging

### Example .NET Controller Structure

```csharp
[ApiController]
[Route("api/[controller]")]
public class CandidateController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateCandidate([FromBody] CandidateDto candidate)
    {
        // Validate
        // Save to database
        // Return created candidate
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCandidate(Guid id)
    {
        // Fetch from database
        // Return candidate
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCandidate(Guid id, [FromBody] CandidateDto candidate)
    {
        // Validate
        // Update in database
        // Return updated candidate
    }
}
```

---

## Testing

### Unit Tests

```javascript
import { createCandidate } from '../services/api'

describe('API Service', () => {
  it('should create a candidate', async () => {
    const candidate = { firstName: 'John', lastName: 'Doe' }
    const result = await createCandidate(candidate)
    
    expect(result.id).toBeDefined()
    expect(result.firstName).toBe('John')
  })
})
```

### Integration Tests

Test with a running backend:

```javascript
const API_URL = 'http://localhost:5000/api'

test('Full candidate flow', async () => {
  // Create candidate
  const created = await createCandidate(testData)
  
  // Get candidate
  const fetched = await getCandidate(created.id)
  expect(fetched.email).toBe(testData.email)
  
  // Update candidate
  const updated = await updateCandidate(created.id, { phone: '123' })
  expect(updated.phone).toBe('123')
})
```

---

## Best Practices

1. **Always handle errors** - Use try/catch blocks
2. **Show loading states** - Provide user feedback during API calls
3. **Cache when appropriate** - Store frequently accessed data
4. **Validate before sending** - Client-side validation first
5. **Use TypeScript** - Add type definitions for better DX
6. **Centralize API calls** - Don't call fetch directly in components

---

## Future Enhancements

- [ ] Request/response interceptors
- [ ] Automatic retry logic
- [ ] Request cancellation
- [ ] Optimistic updates
- [ ] Request caching
- [ ] WebSocket support for real-time updates
- [ ] GraphQL integration option
