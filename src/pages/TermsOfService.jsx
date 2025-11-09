import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import Footer from '../components/Footer'
import ThemeToggle from '../components/ThemeToggle'

export default function TermsOfService() {
  const navigate = useNavigate()

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using tseboIQ, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.'
    },
    {
      title: '2. User Responsibilities',
      content: 'Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.'
    },
    {
      title: '3. Job Seekers',
      subsections: [
        'You must provide truthful and accurate information in your CV and profile.',
        'You are responsible for the content you upload, including CVs and supporting documents.',
        'You grant tseboIQ permission to parse, analyze, and match your information with potential employers.',
        'You understand that tseboIQ does not guarantee job placement or interview opportunities.'
      ]
    },
    {
      title: '4. Employers',
      subsections: [
        'You must provide accurate job descriptions and requirements.',
        'You agree not to post discriminatory, misleading, or fraudulent job listings.',
        'You are responsible for all communication and hiring decisions with candidates.',
        'You agree to comply with all applicable employment laws and regulations.'
      ]
    },
    {
      title: '5. Content Ownership',
      content: 'You retain ownership of all content you submit to tseboIQ. By submitting content, you grant tseboIQ a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content for the purpose of providing our services.'
    },
    {
      title: '6. Prohibited Activities',
      subsections: [
        'Posting false, misleading, or fraudulent information.',
        'Harassing, threatening, or discriminating against other users.',
        'Attempting to gain unauthorized access to our systems.',
        'Using automated tools to scrape or collect data from the platform.',
        'Violating any applicable laws or regulations.'
      ]
    },
    {
      title: '7. Privacy and Data Protection',
      content: 'Your use of tseboIQ is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. We are committed to POPIA and GDPR compliance.'
    },
    {
      title: '8. Intellectual Property',
      content: 'All content, features, and functionality of tseboIQ, including but not limited to text, graphics, logos, and software, are the exclusive property of tseboIQ and are protected by copyright, trademark, and other intellectual property laws.'
    },
    {
      title: '9. Limitation of Liability',
      content: 'tseboIQ provides the platform "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid to use our services, if any.'
    },
    {
      title: '10. Termination',
      content: 'We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason at our sole discretion. Upon termination, your right to use the platform will immediately cease.'
    },
    {
      title: '11. Modifications to Terms',
      content: 'We may update these Terms of Service from time to time. We will notify users of any material changes by posting the new terms on this page. Your continued use of the platform after such changes constitutes acceptance of the new terms.'
    },
    {
      title: '12. Governing Law',
      content: 'These Terms of Service are governed by and construed in accordance with the laws of South Africa. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of South Africa.'
    },
    {
      title: '13. Contact Information',
      content: 'If you have any questions about these Terms of Service, please contact us at legal@tseboiq.com.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
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
            <FileText className="w-12 h-12 text-secondary" />
            <h1 className="text-5xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-xl text-gray-300">
            Last updated: January 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-100 dark:border-gray-700">
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                Welcome to tseboIQ. These Terms of Service govern your use of our platform and services. 
                Please read them carefully before using our services.
              </p>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div key={index} className="border-l-4 border-secondary pl-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {section.title}
                    </h2>
                    {section.content && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {section.content}
                      </p>
                    )}
                    {section.subsections && (
                      <ul className="space-y-2 mt-4">
                        {section.subsections.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                            <span className="text-secondary mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-secondary/10 dark:bg-secondary/20 rounded-xl border border-secondary/30">
                <p className="text-gray-800 dark:text-gray-200 font-semibold mb-2">
                  Questions about our Terms?
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Contact our legal team at{' '}
                  <a href="mailto:legal@tseboiq.com" className="text-secondary hover:underline font-semibold">
                    legal@tseboiq.com
                  </a>
                </p>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="text-secondary hover:text-accent font-semibold underline"
                >
                  Read our Privacy Policy
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
