import { useNavigate } from 'react-router-dom'
import { 
  Briefcase, UserCircle, ArrowRight, Sparkles, TrendingUp, Users, 
  CheckCircle, Upload, Zap, Shield, Target, Clock, Star, Quote
} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import Footer from '../components/Footer'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Auto CV Parsing',
      description: 'AI-powered parsing extracts your information instantly and accurately'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Smart Job Matching',
      description: 'Our algorithm finds your top 2 matches based on skills and experience'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Real-Time Updates',
      description: 'Edit your profile anytime and see instant match updates'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Verified Employers',
      description: 'All employer references are verified for your security'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'POPIA-Compliant',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Precision Matching',
      description: 'Advanced AI ensures the best fit for both parties'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Nkosi',
      role: 'Software Developer',
      content: 'tseboIQ helped me land my first role in just 3 weeks. The AI matching was spot-on!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'HR Manager',
      content: 'We found our perfect candidate within days. The quality of matches is exceptional.',
      rating: 5
    },
    {
      name: 'Thandi Mokoena',
      role: 'Marketing Specialist',
      content: 'The CV parsing saved me hours. I just uploaded and everything was ready to go.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ThemeToggle />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-12 h-12 text-secondary animate-pulse" />
            <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              tseboIQ
            </h1>
            <Sparkles className="w-12 h-12 text-accent animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Find Talent. Find Opportunity.<br />
            <span className="text-secondary">Smarter with AI.</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            AI-powered recruitment that connects people to companies faster and more accurately.
            Experience the future of hiring today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-6 justify-center mb-16">
            <button
              onClick={() => navigate('/register/candidate')}
              className="group px-8 py-4 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center gap-3"
            >
              <UserCircle className="w-6 h-6" />
              I&apos;m Looking for a Job
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/register/employer')}
              className="group px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center gap-3"
            >
              <Briefcase className="w-6 h-6" />
              I&apos;m Hiring
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              <span className="font-semibold">1000+ Matches Made</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="font-semibold">95% Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold">POPIA Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get matched in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: <Upload className="w-8 h-8" />,
                title: 'Upload or Post',
                description: 'Job seekers upload their CV. Employers post job requirements. Our AI does the rest.'
              },
              {
                step: 2,
                icon: <Zap className="w-8 h-8" />,
                title: 'AI Analyzes & Matches',
                description: 'Advanced algorithms analyze skills, experience, and requirements to find perfect matches.'
              },
              {
                step: 3,
                icon: <CheckCircle className="w-8 h-8" />,
                title: 'Connect Instantly',
                description: 'Get your top 2 matches immediately. Start conversations and make connections.'
              }
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-xl flex items-center justify-center mb-6 mx-auto text-secondary group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need for successful recruitment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4 text-secondary group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Job Seekers */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary/10 to-accent/10 dark:from-secondary/20 dark:to-accent/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-secondary/20 rounded-full text-secondary font-semibold mb-4">
                For Job Seekers
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Let Your CV Do the Talking
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                We&apos;ll do the matching. Upload once, get matched with opportunities that truly fit your skills and aspirations.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'AI extracts your information automatically',
                  'Get matched with jobs that fit your profile',
                  'See your top 2 opportunities instantly',
                  'Update your profile anytime'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/register/candidate')}
                className="px-8 py-4 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Start Your Job Search
              </button>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="mt-6 p-4 bg-secondary/10 rounded-lg border-l-4 border-secondary">
                    <p className="text-sm font-semibold text-secondary">✓ Auto-filled by AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Candidates</h4>
                {[1, 2].map((i) => (
                  <div key={i} className="mb-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-secondary rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Candidate {i}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Match Score: {95 - i * 5}%</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {['React', 'Node.js', 'TypeScript'].map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary font-semibold mb-4">
                For Employers
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Save Hours of Screening
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Get your top 2 qualified candidates automatically. No more sifting through hundreds of resumes.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Post your job in minutes',
                  'AI finds the best matches',
                  'Review top 2 candidates instantly',
                  'Connect directly with talent'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/register/employer')}
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Post a Job Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real stories from real people
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <Quote className="w-10 h-10 text-secondary/30 mb-4" />
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands who trust tseboIQ to make meaningful connections
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <button
              onClick={() => navigate('/register/candidate')}
              className="px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started as a Candidate
            </button>
            <button
              onClick={() => navigate('/register/employer')}
              className="px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Post a Job Now
            </button>
          </div>
          <p className="mt-8 opacity-75">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/auth')}
              className="underline hover:opacity-80 font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
