# CV Parser Integration Guide

## Quick Start

The enhanced CV parser is a drop-in replacement for the existing parser. It maintains backward compatibility while adding new fields.

## Frontend Integration (React)

### 1. Import the Parser

```javascript
import { parseCV } from '../services/cvParser'
```

### 2. Handle File Upload

```jsx
import { useState } from 'react'
import { parseCV } from '../services/cvParser'

function CVUploadComponent() {
  const [parsing, setParsing] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [error, setError] = useState(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    
    if (!file) return
    
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file')
      return
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }
    
    try {
      setParsing(true)
      setError(null)
      
      const data = await parseCV(file)
      setParsedData(data)
      
      // Show success message
      console.log('CV parsed successfully:', data)
      
    } catch (err) {
      setError(err.message)
      console.error('CV parsing error:', err)
    } finally {
      setParsing(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileUpload}
        disabled={parsing}
      />
      
      {parsing && <p>Parsing CV...</p>}
      {error && <p className="error">{error}</p>}
      
      {parsedData && (
        <div>
          <h3>Parsed Data</h3>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

### 3. Display Parsed Data in Form

```jsx
function CandidateProfileForm({ parsedData }) {
  const [formData, setFormData] = useState({
    full_name: parsedData?.full_name || '',
    email: parsedData?.email || '',
    phone_number: parsedData?.phone_number || '',
    address: parsedData?.address || '',
    nationality: parsedData?.nationality || '',
    gender: parsedData?.gender || '',
    date_of_birth: parsedData?.date_of_birth || '',
    profile_summary: parsedData?.profile_summary || '',
    skills: parsedData?.skills || [],
    employment_history: parsedData?.employment_history || [],
    education: parsedData?.education || [],
    certifications: parsedData?.certifications || [],
    projects: parsedData?.projects || [],
    references: parsedData?.references || []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Send to backend API
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to save profile')
      
      const result = await response.json()
      console.log('Profile saved:', result)
      
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Personal Information */}
      <section>
        <h3>Personal Information</h3>
        
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          placeholder="Full Name"
          required
        />
        
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Email"
          required
        />
        
        <input
          type="tel"
          value={formData.phone_number}
          onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
          placeholder="Phone Number"
        />
        
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="Address"
        />
        
        <input
          type="text"
          value={formData.nationality}
          onChange={(e) => setFormData({...formData, nationality: e.target.value})}
          placeholder="Nationality"
        />
        
        <select
          value={formData.gender}
          onChange={(e) => setFormData({...formData, gender: e.target.value})}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        
        <input
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
          placeholder="Date of Birth"
        />
      </section>
      
      {/* Profile Summary */}
      <section>
        <h3>Profile Summary</h3>
        <textarea
          value={formData.profile_summary}
          onChange={(e) => setFormData({...formData, profile_summary: e.target.value})}
          rows={5}
          placeholder="Professional summary..."
        />
      </section>
      
      {/* Skills */}
      <section>
        <h3>Skills</h3>
        <div className="skills-list">
          {formData.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
              <button onClick={() => {
                const newSkills = formData.skills.filter((_, i) => i !== index)
                setFormData({...formData, skills: newSkills})
              }}>×</button>
            </span>
          ))}
        </div>
      </section>
      
      {/* Employment History */}
      <section>
        <h3>Employment History</h3>
        {formData.employment_history.map((job, index) => (
          <div key={index} className="employment-entry">
            <input
              type="text"
              value={job.job_title}
              onChange={(e) => {
                const newHistory = [...formData.employment_history]
                newHistory[index].job_title = e.target.value
                setFormData({...formData, employment_history: newHistory})
              }}
              placeholder="Job Title"
            />
            
            <input
              type="text"
              value={job.company_name}
              onChange={(e) => {
                const newHistory = [...formData.employment_history]
                newHistory[index].company_name = e.target.value
                setFormData({...formData, employment_history: newHistory})
              }}
              placeholder="Company Name"
            />
            
            <input
              type="date"
              value={job.start_date || ''}
              onChange={(e) => {
                const newHistory = [...formData.employment_history]
                newHistory[index].start_date = e.target.value
                setFormData({...formData, employment_history: newHistory})
              }}
              placeholder="Start Date"
            />
            
            <input
              type="date"
              value={job.end_date || ''}
              onChange={(e) => {
                const newHistory = [...formData.employment_history]
                newHistory[index].end_date = e.target.value
                setFormData({...formData, employment_history: newHistory})
              }}
              placeholder="End Date (leave blank if current)"
            />
            
            <textarea
              value={job.responsibilities}
              onChange={(e) => {
                const newHistory = [...formData.employment_history]
                newHistory[index].responsibilities = e.target.value
                setFormData({...formData, employment_history: newHistory})
              }}
              placeholder="Responsibilities"
              rows={3}
            />
          </div>
        ))}
      </section>
      
      <button type="submit">Save Profile</button>
    </form>
  )
}
```

## Backend Integration (.NET)

### 1. Create DTOs

```csharp
// Models/CandidateProfile.cs
public class CandidateProfile
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public string Nationality { get; set; }
    public string Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string ProfileSummary { get; set; }
    public List<string> Skills { get; set; }
    public List<EmploymentHistory> EmploymentHistory { get; set; }
    public List<Education> Education { get; set; }
    public List<Certification> Certifications { get; set; }
    public List<Project> Projects { get; set; }
    public List<Reference> References { get; set; }
}

public class EmploymentHistory
{
    public string CompanyName { get; set; }
    public string JobTitle { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Responsibilities { get; set; }
}

public class Education
{
    public string Id { get; set; }
    public string Degree { get; set; }
    public string Institution { get; set; }
    public string City { get; set; }
    public DateTime? GraduationDate { get; set; }
}

public class Certification
{
    public string Title { get; set; }
    public string Institution { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class Project
{
    public string Name { get; set; }
    public string Url { get; set; }
}

public class Reference
{
    public string Name { get; set; }
    public string Company { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
}
```

### 2. Create API Controller

```csharp
// Controllers/CandidateController.cs
[ApiController]
[Route("api/[controller]")]
public class CandidateController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidateController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromBody] CandidateProfile profile)
    {
        try
        {
            var result = await _candidateService.CreateProfileAsync(profile);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(string id)
    {
        try
        {
            var profile = await _candidateService.GetProfileAsync(id);
            if (profile == null)
                return NotFound();
            
            return Ok(profile);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(string id, [FromBody] CandidateProfile profile)
    {
        try
        {
            var result = await _candidateService.UpdateProfileAsync(id, profile);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
```

### 3. Database Schema (SQL)

```sql
-- Candidates table
CREATE TABLE candidates (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    address VARCHAR(500),
    nationality VARCHAR(100),
    gender VARCHAR(20),
    date_of_birth DATE,
    profile_summary TEXT,
    skills JSON,
    employment_history JSON,
    education JSON,
    certifications JSON,
    projects JSON,
    references JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_candidates_user_id ON candidates(user_id);
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_full_name ON candidates(full_name);

-- Full-text search on skills and summary
CREATE FULLTEXT INDEX idx_candidates_skills_summary 
ON candidates(profile_summary, skills);
```

## Supabase Integration

### 1. Create Table

```sql
-- Run in Supabase SQL Editor
create table candidates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  full_name text not null,
  email text not null,
  phone_number text,
  address text,
  nationality text,
  gender text,
  date_of_birth date,
  profile_summary text,
  skills jsonb default '[]'::jsonb,
  employment_history jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  certifications jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  references jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS
alter table candidates enable row level security;

-- Policies
create policy "Users can view own profile"
  on candidates for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on candidates for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on candidates for update
  using (auth.uid() = user_id);

-- Indexes
create index candidates_user_id_idx on candidates(user_id);
create index candidates_email_idx on candidates(email);
create index candidates_skills_idx on candidates using gin(skills);
```

### 2. React Integration with Supabase

```javascript
import { supabase } from '../lib/supabase'

async function saveCandidateProfile(parsedData) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const profile = {
    user_id: user.id,
    full_name: parsedData.full_name,
    email: parsedData.email,
    phone_number: parsedData.phone_number,
    address: parsedData.address,
    nationality: parsedData.nationality,
    gender: parsedData.gender,
    date_of_birth: parsedData.date_of_birth,
    profile_summary: parsedData.profile_summary,
    skills: parsedData.skills,
    employment_history: parsedData.employment_history,
    education: parsedData.education,
    certifications: parsedData.certifications,
    projects: parsedData.projects,
    references: parsedData.references
  }
  
  // Upsert (insert or update)
  const { data, error } = await supabase
    .from('candidates')
    .upsert(profile, { onConflict: 'user_id' })
    .select()
    .single()
  
  if (error) throw error
  
  return data
}

async function getCandidateProfile(userId) {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  
  return data
}
```

## Testing

### Unit Test Example

```javascript
// cvParser.test.js
import { parseCV } from '../services/cvParser'

describe('CV Parser', () => {
  test('should extract email correctly', async () => {
    const mockFile = new File(
      ['Name: John Doe\nEmail: john@example.com'],
      'test.txt',
      { type: 'text/plain' }
    )
    
    const result = await parseCV(mockFile)
    expect(result.email).toBe('john@example.com')
  })
  
  test('should extract phone number', async () => {
    const mockFile = new File(
      ['Phone: 0843149934'],
      'test.txt',
      { type: 'text/plain' }
    )
    
    const result = await parseCV(mockFile)
    expect(result.phone_number).toBe('0843149934')
  })
})
```

## Migration from Old Parser

### Field Mapping

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `fullName` | `full_name` | Snake case |
| `email` | `email` | Same |
| `phone` | `phone_number` | Renamed |
| `skills` | `skills` | Now lowercase array |
| `experienceYears` | N/A | Removed (calculated from employment_history) |
| `experience` | `employment_history` | Renamed, enhanced structure |
| `education` | `education` | Enhanced structure |
| `certifications` | `certifications` | Enhanced structure |
| `summary` | `profile_summary` | Renamed |
| N/A | `address` | New field |
| N/A | `nationality` | New field |
| N/A | `gender` | New field |
| N/A | `date_of_birth` | New field |
| N/A | `projects` | New field |
| N/A | `references` | New field |

### Migration Script

```javascript
function migrateOldToNew(oldData) {
  return {
    full_name: oldData.fullName,
    email: oldData.email,
    phone_number: oldData.phone,
    address: null,
    nationality: null,
    gender: null,
    date_of_birth: null,
    profile_summary: oldData.summary || '',
    skills: oldData.skills.map(s => s.toLowerCase()),
    employment_history: oldData.experience.map(exp => ({
      company_name: exp.company,
      job_title: exp.position,
      start_date: exp.startDate,
      end_date: exp.endDate,
      responsibilities: exp.description
    })),
    education: oldData.education,
    certifications: oldData.certifications || [],
    projects: [],
    references: []
  }
}
```

## Troubleshooting

### Common Issues

**Issue**: Parser returns "Unknown" for name
- **Solution**: Ensure name is in first 5 lines, properly capitalized

**Issue**: Skills not detected
- **Solution**: Check if skills are in predefined database, add manually if needed

**Issue**: Dates not parsing
- **Solution**: Use standard formats: YYYY-MM-DD, DD/MM/YYYY, or "Month DD, YYYY"

**Issue**: Employment history missing
- **Solution**: Ensure job titles match common patterns (Developer, Engineer, Manager, etc.)

## Support

For issues or questions:
- Check console logs for parsing confidence
- Review CV_PARSER_ENHANCED_GUIDE.md
- Submit issues with anonymized CV samples

## License

Proprietary - tseboIQ Platform
