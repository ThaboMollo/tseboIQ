import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Loader2, AlertCircle, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react'
import { parseCV } from '../services/affindaParser'
import ThemeToggle from '../components/ThemeToggle'
import SkillsInput from '../components/SkillsInput'

export default function CandidateForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Upload, 2: Parsing, 3: Edit Form, 4: Complete
  const [file, setFile] = useState(null)
  const [, setParsing] = useState(false)
  const [parseError, setParseError] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    languages: []
  })

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase()
      if (fileType === 'pdf' || fileType === 'docx') {
        setFile(selectedFile)
        setParseError(null)
      } else {
        setParseError('Please upload a PDF or DOCX file')
      }
    }
  }

  const handleUploadAndParse = async () => {
    if (!file) return

    setParsing(true)
    setParseError(null)
    setStep(2)

    try {
      console.log('📄 Starting CV parsing...')
      const result = await parseCV(file)
      
      console.log('✅ CV parsing result:', result)
      
      // Extract data from result (handles both Affinda and local parser)
      const parsedData = result.data || result
      
      // Split full name into first and last name
      const fullName = parsedData.full_name || ''
      const nameParts = fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      // Map parsed data to form structure
      const mappedData = {
        firstName: firstName,
        lastName: lastName,
        email: parsedData.email || '',
        phone: parsedData.phone_number || '',
        location: parsedData.address || '',
        summary: parsedData.profile_summary || '',
        skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
        experience: Array.isArray(parsedData.employment_history) ? parsedData.employment_history : [],
        education: Array.isArray(parsedData.education) ? parsedData.education : [],
        certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : [],
        languages: Array.isArray(parsedData.languages) ? parsedData.languages : []
      }
      
      console.log('📋 Mapped form data:', mappedData)
      setFormData(mappedData)

      setParsing(false)
      setStep(3)
    } catch (error) {
      console.error('❌ CV parsing error:', error)
      setParseError(error.message || 'Failed to parse CV. Please try again or fill the form manually.')
      setParsing(false)
      setStep(1)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSkillsChange = (newSkills) => {
    setFormData(prev => ({ ...prev, skills: newSkills }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate skills
    if (formData.skills.length === 0) {
      setParseError('Please add at least one skill')
      return
    }
    
    // Store candidate data in localStorage temporarily
    localStorage.setItem('candidateData', JSON.stringify(formData))
    localStorage.setItem('userRole', 'candidate')
    
    // Navigate to auth
    navigate('/auth', { state: { from: '/register/candidate' } })
  }

  const handleSkipUpload = () => {
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-primary py-12 px-4 transition-colors duration-300">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary dark:text-white mb-2">Create Your Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Upload your CV or fill in your details manually</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-accent' : 'text-gray-400 dark:text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-accent text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Upload CV</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-accent' : 'text-gray-400 dark:text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-accent text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Parse Data</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-accent' : 'text-gray-400 dark:text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-accent text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Review & Submit</span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload CV */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="mb-6">
                <Upload className="w-16 h-16 text-accent mx-auto mb-4" />
                <h2 className="text-2xl font-heading font-bold text-primary dark:text-white mb-2">Upload Your CV</h2>
                <p className="text-gray-600 dark:text-gray-300">We&apos;ll automatically extract your information</p>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="cv-upload"
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 cursor-pointer hover:border-accent transition-brand">
                    {file ? (
                      <div className="flex items-center justify-center space-x-3">
                        <FileText className="w-8 h-8 text-accent" />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{file.name}</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">PDF or DOCX (max 10MB)</p>
                      </div>
                    )}
                  </div>
                </label>

                {parseError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{parseError}</p>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleUploadAndParse}
                    disabled={!file}
                    className="w-full bg-gradient-button text-white py-3 px-6 rounded-xl font-semibold hover:shadow-hover disabled:opacity-50 disabled:cursor-not-allowed transition-brand"
                  >
                    Parse CV with AI
                  </button>
                  
                  <button
                    onClick={handleSkipUpload}
                    className="w-full bg-white dark:bg-primary text-gray-700 dark:text-white py-3 px-6 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-accent transition-brand"
                  >
                    Skip & Fill Manually
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Parsing */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Parsing Your CV</h2>
              <p className="text-gray-600">Our AI is extracting your information...</p>
            </div>
          </div>
        )}

        {/* Step 3: Edit Form */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
              <p className="text-gray-600">Please verify and update your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Professional Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Professional Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Brief overview of your professional background and career goals..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills *
                </label>
                <SkillsInput
                  skills={formData.skills}
                  onChange={handleSkillsChange}
                  placeholder="Type a skill and press Enter (e.g., React, Python, Project Management)"
                />
                {formData.skills.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">At least one skill is required</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Sign Up
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
