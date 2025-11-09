import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Briefcase, LogOut, Edit, Star, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { calculateMatchScore } from '../utils/matchingAlgorithm'
import ThemeToggle from '../components/ThemeToggle'

// Helper function to convert experience level to years
const getExperienceYears = (level) => {
  const levelMap = {
    'entry': 0,
    'mid': 3,
    'senior': 6,
    'lead': 10,
    'principal': 10
  }
  return levelMap[level?.toLowerCase()] || 0
}

export default function CandidateDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [topMatches, setTopMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    loadDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        navigate('/auth')
        return
      }

      // Load candidate profile
      const { data: candidateData } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (candidateData) {
        setProfile(candidateData)
      } else {
        // Fallback to localStorage data if not in DB yet
        const storedData = JSON.parse(localStorage.getItem('candidateData') || '{}')
        setProfile(storedData)
      }

      // Load top 2 job matches from Supabase
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .limit(10)

      if (jobsData && jobsData.length > 0 && candidateData) {
        // Calculate match scores using the matching algorithm
        const candidateProfile = {
          skills: candidateData.skills || [],
          experience: candidateData.experience_years || 0
        }

        const matchedJobs = jobsData.map(job => {
          const jobSpec = {
            required_skills: job.skills || [],
            min_experience: getExperienceYears(job.experienceLevel || job.experience_level)
          }

          const matchScore = calculateMatchScore(candidateProfile, jobSpec)

          return {
            id: job.id,
            jobTitle: job.jobTitle || job.job_title,
            companyName: job.companyName || job.company_name,
            location: job.location,
            matchScore,
            salaryRange: job.salaryRange || job.salary_range || 'Competitive',
            skills: job.skills || []
          }
        })

        // Sort by match score and take top 2
        const top2 = matchedJobs
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 2)

        setTopMatches(top2)
      } else {
        setTopMatches([])
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-primary flex items-center justify-center transition-colors duration-300">
        <ThemeToggle />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-primary transition-colors duration-300">
      <ThemeToggle />
      {/* Header */}
      <header className="bg-white dark:bg-primary-light shadow-card border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-heading font-bold text-primary dark:text-white">tseboIQ</h1>
              <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                Candidate
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-accent transition-brand"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-primary-light rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold text-primary dark:text-white">Your Profile</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-accent hover:text-accent-light transition-brand"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary dark:text-white">
                      {profile?.firstName} {profile?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Job Seeker</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-primary dark:text-white">{profile?.email}</p>
                    </div>
                  </div>

                  {profile?.phone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-primary dark:text-white">{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile?.location && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="text-primary dark:text-white">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {profile?.summary && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Summary</p>
                        <p className="text-primary dark:text-white text-sm">{profile.summary}</p>
                      </div>
                    </div>
                  </div>
                )}

                {profile?.skills && profile.skills.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Matches Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-heading font-bold text-primary dark:text-white">Top Job Matches</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">AI-powered recommendations based on your profile</p>
            </div>

            <div className="space-y-6">
              {topMatches.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-primary-light rounded-2xl shadow-card p-6 hover:shadow-hover transition-brand border-2 border-transparent hover:border-accent"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-primary dark:text-white mb-1">
                        {job.jobTitle}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{job.companyName}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span>{job.salaryRange}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-1 mb-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-2xl font-bold text-accent">
                          {job.matchScore}%
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">Match Score</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-gradient-button text-white py-3 px-6 rounded-xl font-semibold hover:shadow-hover transition-brand">
                    View Details & Apply
                  </button>
                </div>
              ))}
            </div>

            {topMatches.length === 0 && (
              <div className="bg-white dark:bg-primary-light rounded-2xl shadow-card p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-primary dark:text-white mb-2">
                  No matches yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete your profile to get personalized job recommendations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
