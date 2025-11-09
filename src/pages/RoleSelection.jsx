import { useNavigate } from 'react-router-dom'
import { Briefcase, UserCircle, ArrowRight, Sparkles, TrendingUp, Users, CheckCircle, Upload, Zap } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function RoleSelection() {
  const navigate = useNavigate()

  const handleRoleSelection = (role) => {
    localStorage.setItem('userRole', role)
    if (role === 'candidate') {
      navigate('/register/candidate')
    } else {
      navigate('/register/employer')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <ThemeToggle />
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-10 h-10 text-secondary animate-pulse" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              tseboIQ
            </h1>
            <Sparkles className="w-10 h-10 text-accent animate-pulse" />
          </div>
          <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-semibold mb-3">
            AI-Powered Recruitment Platform
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Connect talent with opportunity through intelligent matching
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users className="w-5 h-5 text-secondary" />
              <span className="font-semibold">Smart Matching</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="font-semibold">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold">Instant Results</span>
            </div>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
          {/* Candidate Card */}
          <button
            onClick={() => handleRoleSelection('candidate')}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border-2 border-transparent hover:border-secondary overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 dark:from-secondary/10 dark:to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary opacity-10 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-secondary/20 to-accent/20 dark:from-secondary/30 dark:to-accent/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <UserCircle className="w-14 h-14 text-secondary" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-secondary transition-colors">
                Looking for a Job
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-left leading-relaxed">
                Upload your CV and let our AI match you with the perfect opportunities. Get personalized job recommendations based on your skills and experience.
              </p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 group-hover:translate-x-2 transition-transform duration-300">
                  <div className="w-2 h-2 bg-secondary rounded-full group-hover:scale-150 transition-transform" />
                  <span>AI-powered CV parsing</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  <div className="w-2 h-2 bg-secondary rounded-full group-hover:scale-150 transition-transform" />
                  <span>Instant job matching</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-150">
                  <div className="w-2 h-2 bg-secondary rounded-full group-hover:scale-150 transition-transform" />
                  <span>Top 2 recommendations</span>
                </li>
              </ul>
              
              <div className="flex items-center justify-between text-secondary font-bold text-lg group-hover:gap-6 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
              </div>
            </div>
          </button>

          {/* Employer Card */}
          <button
            onClick={() => handleRoleSelection('employer')}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border-2 border-transparent hover:border-primary overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Briefcase className="w-14 h-14 text-primary" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                Posting a Job
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-left leading-relaxed">
                Post your job opening and discover the best candidates. Our AI analyzes your requirements and finds the perfect matches from our talent pool.
              </p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 group-hover:translate-x-2 transition-transform duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                  <span>Quick job posting</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                  <span>Smart candidate matching</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 group-hover:translate-x-2 transition-transform duration-300 delay-150">
                  <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                  <span>Top 2 candidate profiles</span>
                </li>
              </ul>
              
              <div className="flex items-center justify-between text-primary font-bold text-lg group-hover:gap-6 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* How It Works Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Get matched in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  1
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 dark:from-secondary/30 dark:to-accent/30 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                  Choose Your Role
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Select whether you're looking for a job or posting one. Upload your CV or create a job listing.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  2
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                  AI Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Our AI instantly analyzes your profile or job requirements and matches them with our database.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  3
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-secondary/20 dark:from-accent/30 dark:to-secondary/30 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                  Get Matched
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Receive your top 2 personalized matches instantly. Connect with opportunities or talent right away.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 space-y-4">
          <div className="flex items-center justify-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Powered by AI
            </span>
            <span>•</span>
            <span>Secure</span>
            <span>•</span>
            <span>POPIA Compliant</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            2024 tseboIQ. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/auth')}
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
