import { useNavigate } from 'react-router-dom'
import { Target, Eye, Heart, Zap, User, ArrowLeft } from 'lucide-react'
import Footer from '../components/Footer'
import ThemeToggle from '../components/ThemeToggle'

export default function About() {
  const navigate = useNavigate()

  const values = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Efficiency',
      description: 'Streamline recruitment with AI-powered automation that saves time and resources.'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Transparency',
      description: 'Clear processes and honest communication at every step of the journey.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Empowerment',
      description: 'Enable both job seekers and employers to make informed, confident decisions.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Continuously evolve with cutting-edge technology to serve our community better.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <ThemeToggle />
      
      {/* Header */}
      <div className="bg-primary dark:bg-gray-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-secondary hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <h1 className="text-5xl font-bold mb-6">About tseboIQ</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            Connecting African talent with opportunity through intelligent, fair, and simple recruitment technology.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-20">
          
          {/* Origin Story */}
          <section>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                tseboIQ was born from the idea that connecting people to opportunity should be simple, fair, and intelligent. 
                In a world where talent is abundant but often overlooked, and where employers struggle to find the right fit, 
                we saw an opportunity to bridge the gap.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                By leveraging artificial intelligence and modern technology, we created a platform that understands both 
                the needs of job seekers and the requirements of employers, making meaningful connections that drive careers 
                and businesses forward.
              </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-secondary/10 to-accent/10 dark:from-secondary/20 dark:to-accent/20 rounded-2xl p-10 border border-secondary/20">
              <div className="w-16 h-16 bg-secondary/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To empower African talent with AI-driven career pathways, making quality employment opportunities 
                accessible to everyone while helping businesses discover exceptional candidates efficiently.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-10 border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                A smarter, transparent, and inclusive job ecosystem where every individual has the opportunity to 
                showcase their potential, and every employer can find their perfect match with confidence.
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg flex items-center justify-center mb-4 text-secondary">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Founder */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Meet the Founder
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Thabo Mollo Mponya
                </h3>
                <p className="text-secondary font-semibold mb-4">Founder & CEO</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  A passionate technologist and entrepreneur dedicated to solving Africa&apos;s employment challenges 
                  through innovation. With a vision to democratize access to opportunities, Thabo founded tseboIQ 
                  to create a platform where talent meets opportunity seamlessly.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers and employers who trust tseboIQ to make meaningful connections.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/register/candidate')}
                className="px-8 py-4 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Find Your Next Job
              </button>
              <button
                onClick={() => navigate('/register/employer')}
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Post a Job
              </button>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  )
}
