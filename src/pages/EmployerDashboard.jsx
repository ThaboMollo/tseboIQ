import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, LogOut, Plus, Star, MapPin, Mail, Phone, TrendingUp, Users } from 'lucide-react'
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

export default function EmployerDashboard() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [topMatches, setTopMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)

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

      // Load employer's jobs
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)

      if (jobsData && jobsData.length > 0) {
        setJobs(jobsData)
        setSelectedJob(jobsData[0].id)
      } else {
        // Fallback to localStorage data if not in DB yet
        const storedData = JSON.parse(localStorage.getItem('jobData') || '{}')
        if (Object.keys(storedData).length > 0) {
          const mockJob = { id: 1, ...storedData }
          setJobs([mockJob])
          setSelectedJob(1)
        }
      }

      // Load top 2 candidate matches from Supabase
      if (jobsData && jobsData.length > 0) {
        const firstJob = jobsData[0]
        const jobSkills = firstJob.skills || []

        const { data: candidatesData } = await supabase
          .from('candidates')
          .select('*')
          .limit(20)

        if (candidatesData && candidatesData.length > 0) {
          // Calculate match scores using the matching algorithm
          const jobSpec = {
            required_skills: jobSkills,
            min_experience: getExperienceYears(firstJob.experienceLevel || firstJob.experience_level)
          }

          const matchedCandidates = candidatesData.map(candidate => {
            const candidateProfile = {
              skills: candidate.skills || [],
              experience: candidate.experience_years || 0
            }

            const matchScore = calculateMatchScore(candidateProfile, jobSpec)

            return {
              id: candidate.id,
              firstName: candidate.firstName || 'Unknown',
              lastName: candidate.lastName || 'User',
              email: candidate.email || 'No email',
              phone: candidate.phone || 'No phone',
              location: candidate.location || 'Location not specified',
              matchScore,
              skills: candidate.skills || [],
              experience: candidate.experience_years ? `${candidate.experience_years} years` : 'Not specified',
              summary: candidate.summary || 'No summary available'
            }
          })

          // Sort by match score and take top 2
          const top2 = matchedCandidates
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 2)

          setTopMatches(top2)
        } else {
          setTopMatches([])
        }
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

  const handlePostNewJob = () => {
    navigate('/register/employer')
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
                Employer
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePostNewJob}
                className="flex items-center space-x-2 bg-gradient-button text-white px-4 py-2 rounded-xl hover:shadow-hover transition-brand"
              >
                <Plus className="w-5 h-5" />
                <span>Post New Job</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-accent transition-brand"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Listings Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-primary-light rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold text-primary dark:text-white">Your Jobs</h2>
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                  {jobs.length}
                </span>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedJob === job.id
                        ? 'border-accent bg-accent/10'
                        : 'border-gray-200 dark:border-gray-600 hover:border-accent'
                    }`}
                    onClick={() => setSelectedJob(job.id)}
                  >
                    <h3 className="font-semibold text-primary dark:text-white mb-1">
                      {job.jobTitle || job.job_title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {job.companyName || job.company_name}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {job.location}
                    </div>
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No jobs posted yet</p>
                    <button
                      onClick={handlePostNewJob}
                      className="mt-3 text-accent hover:text-accent-light text-sm font-semibold transition-brand"
                    >
                      Post your first job
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Candidate Matches Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-heading font-bold text-primary dark:text-white">Top Candidate Matches</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">AI-powered recommendations for your open positions</p>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white dark:bg-primary-light rounded-2xl shadow-card p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-primary dark:text-white mb-2">
                  Post a job to see matches
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Create your first job posting to get AI-powered candidate recommendations
                </p>
                <button
                  onClick={handlePostNewJob}
                  className="bg-gradient-button text-white px-6 py-3 rounded-xl font-semibold hover:shadow-hover transition-brand"
                >
                  Post a Job
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {topMatches.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-white dark:bg-primary-light rounded-2xl shadow-card p-6 hover:shadow-hover transition-brand border-2 border-transparent hover:border-accent"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-accent">
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-bold text-primary dark:text-white mb-1">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {candidate.experience} of experience
                          </p>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {candidate.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {candidate.phone}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {candidate.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className="text-2xl font-bold text-accent">
                            {candidate.matchScore}%
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">Match Score</span>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-gray-700 text-sm">{candidate.summary}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
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
                      View Full Profile & Contact
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
