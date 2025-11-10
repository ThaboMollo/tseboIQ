import { useState, useRef } from 'react'
import { X, Plus } from 'lucide-react'

/**
 * SkillsInput Component
 * A tag-based input for adding multiple skills with autocomplete suggestions
 * Styled with tseboIQ New Navy theme
 */
export default function SkillsInput({ skills = [], onChange, placeholder = "Add a skill..." }) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  // Comprehensive skills database across multiple industries
  const commonSkills = [
    // Technology & IT
    'React', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'MySQL', 'AWS', 'Azure', 'Docker',
    'Data Analysis', 'Machine Learning', 'Cybersecurity', 'Network Administration',
    'IT Support', 'System Administration', 'Cloud Computing', 'DevOps',
    
    // Business & Finance
    'Accounting', 'Bookkeeping', 'Financial Analysis', 'Budgeting', 'Auditing',
    'Tax Preparation', 'Payroll Management', 'Financial Planning', 'Investment Analysis',
    'Risk Management', 'Business Analysis', 'Strategic Planning', 'Market Research',
    'Excel', 'QuickBooks', 'SAP', 'Sage', 'Pastel', 'Financial Reporting',
    
    // Sales & Marketing
    'Sales', 'Digital Marketing', 'Social Media Marketing', 'SEO', 'Content Marketing',
    'Email Marketing', 'Customer Relationship Management', 'Lead Generation',
    'Brand Management', 'Market Analysis', 'Advertising', 'Public Relations',
    'Copywriting', 'Sales Strategy', 'Negotiation', 'Cold Calling',
    
    // Healthcare & Medical
    'Patient Care', 'Medical Coding', 'Nursing', 'First Aid', 'CPR',
    'Medical Records Management', 'Pharmacy', 'Laboratory Skills', 'Diagnostics',
    'Healthcare Administration', 'Medical Terminology', 'Patient Education',
    
    // Education & Training
    'Teaching', 'Curriculum Development', 'Lesson Planning', 'Classroom Management',
    'Educational Technology', 'Student Assessment', 'Tutoring', 'Training & Development',
    'E-Learning', 'Instructional Design', 'Child Development',
    
    // Hospitality & Tourism
    'Customer Service', 'Food & Beverage Service', 'Hotel Management',
    'Event Planning', 'Catering', 'Front Desk Operations', 'Housekeeping Management',
    'Tour Guiding', 'Restaurant Management', 'Bartending', 'Cooking',
    
    // Manufacturing & Engineering
    'Quality Control', 'Manufacturing Processes', 'Mechanical Engineering',
    'Electrical Engineering', 'CAD', 'AutoCAD', 'Production Planning',
    'Lean Manufacturing', 'Six Sigma', 'Equipment Maintenance', 'Welding',
    'CNC Operation', 'Assembly', 'Industrial Safety',
    
    // Construction & Trades
    'Carpentry', 'Plumbing', 'Electrical Work', 'Painting', 'Masonry',
    'Construction Management', 'Blueprint Reading', 'Project Estimation',
    'Building Inspection', 'HVAC', 'Roofing', 'Tiling',
    
    // Retail & Customer Service
    'Retail Sales', 'Cash Handling', 'Inventory Management', 'Visual Merchandising',
    'Point of Sale Systems', 'Customer Relations', 'Stock Management',
    'Loss Prevention', 'Store Operations',
    
    // Transportation & Logistics
    'Driving', 'Logistics Management', 'Supply Chain Management', 'Warehouse Operations',
    'Inventory Control', 'Freight Management', 'Route Planning', 'Fleet Management',
    'Forklift Operation', 'Shipping & Receiving',
    
    // Creative & Design
    'Graphic Design', 'UI/UX Design', 'Photography', 'Video Editing',
    'Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Animation',
    'Web Design', 'Interior Design', 'Fashion Design', 'Creative Writing',
    
    // Human Resources
    'Recruitment', 'Employee Relations', 'Performance Management', 'HR Administration',
    'Talent Acquisition', 'Onboarding', 'Payroll Processing', 'Labor Law',
    'Compensation & Benefits', 'Training Coordination',
    
    // Legal & Compliance
    'Legal Research', 'Contract Management', 'Compliance', 'Paralegal Skills',
    'Legal Documentation', 'Case Management', 'Regulatory Compliance',
    
    // Agriculture & Environment
    'Farming', 'Crop Management', 'Animal Husbandry', 'Irrigation',
    'Environmental Management', 'Sustainability', 'Horticulture',
    
    // Soft Skills (Universal)
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
    'Time Management', 'Critical Thinking', 'Adaptability', 'Work Ethic',
    'Attention to Detail', 'Organization', 'Multitasking', 'Conflict Resolution',
    'Decision Making', 'Interpersonal Skills', 'Creativity', 'Reliability',
    
    // Languages
    'English', 'Afrikaans', 'Zulu', 'Xhosa', 'Sotho', 'Tswana', 'Venda',
    'Tsonga', 'Swati', 'Ndebele', 'French', 'Portuguese', 'Mandarin',
    
    // Office & Administration
    'Microsoft Office', 'Word Processing', 'Data Entry', 'Filing',
    'Scheduling', 'Reception', 'Administrative Support', 'Document Management',
    'Meeting Coordination', 'Travel Arrangements', 'Office Management'
  ]

  // Filter suggestions based on input
  const suggestions = inputValue.length > 0
    ? commonSkills.filter(skill => 
        skill.toLowerCase().includes(inputValue.toLowerCase()) &&
        !skills.some(s => s.toLowerCase() === skill.toLowerCase())
      ).slice(0, 5)
    : []

  const handleAddSkill = (skill) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !skills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase())) {
      onChange([...skills, trimmedSkill])
      setInputValue('')
      setShowSuggestions(false)
      inputRef.current?.focus()
    }
  }

  const handleRemoveSkill = (indexToRemove) => {
    onChange(skills.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        handleAddSkill(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      // Remove last skill if backspace on empty input
      handleRemoveSkill(skills.length - 1)
    } else if (e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        handleAddSkill(inputValue)
      }
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setShowSuggestions(e.target.value.length > 0)
  }

  return (
    <div className="relative">
      {/* Skills Container */}
      <div className="w-full min-h-[56px] px-3 py-3 border-2 border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Skill Tags */}
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors touch-manipulation"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}

          {/* Input Field */}
          <div className="flex-1 min-w-[140px] relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(inputValue.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={skills.length === 0 ? placeholder : ''}
              className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-400 text-base py-1"
            />
          </div>

          {/* Add Button */}
          {inputValue && (
            <button
              type="button"
              onClick={() => handleAddSkill(inputValue)}
              className="p-2 hover:bg-blue-50 rounded-full transition-colors touch-manipulation"
              aria-label="Add skill"
            >
              <Plus className="w-5 h-5 text-blue-600" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleAddSkill(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors text-gray-900 border-b border-gray-100 last:border-b-0 text-base touch-manipulation"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <p className="mt-2 text-sm text-gray-600">
        Press Enter or comma to add a skill. Click × to remove.
      </p>
    </div>
  )
}
