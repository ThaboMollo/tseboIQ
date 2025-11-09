import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'
import Footer from '../components/Footer'
import ThemeToggle from '../components/ThemeToggle'
import { privacyPolicyData } from '../data/privacyPolicyText'

const PrivacyPolicy = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <ThemeToggle />
      
      {/* Header */}
      <div className="bg-primary dark:bg-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-secondary hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-12 h-12 text-secondary" />
            <h1 className="text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-300">
            POPIA & GDPR Compliant Data Protection
          </p>
          <p className="text-gray-400 mt-2">
            Last updated: {privacyPolicyData.lastUpdated}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 border border-gray-100 dark:border-gray-700">
            <div className="space-y-8">
              {privacyPolicyData.sections.map((section, index) => (
                <div key={index} className="border-l-4 border-secondary pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-secondary/10 dark:bg-secondary/20 rounded-xl p-6 border border-secondary/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Questions or Concerns?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
                </p>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p><strong>Email:</strong> <a href="mailto:privacy@tseboiq.com" className="text-secondary hover:underline">privacy@tseboiq.com</a></p>
                  <p><strong>Information Officer:</strong> tseboIQ Privacy Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy
