import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Send, Linkedin, Twitter, Facebook } from 'lucide-react'
import Footer from '../components/Footer'
import ThemeToggle from '../components/ThemeToggle'

export default function Contact() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const form = e.target
    
    // Submit to Netlify
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(() => {
        console.log('Contact form submitted successfully')
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setFormData({ name: '', email: '', subject: '', message: '' })
        }, 3000)
      })
      .catch((error) => {
        console.error('Form submission error:', error)
        alert('There was an error submitting your message. Please try again or email us directly at iq.tsebo@gmail.com')
      })
  }

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
          
          <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Email */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
                <a href="mailto:iq.tsebo@gmail.com" className="text-secondary hover:underline">
                  iq.tsebo@gmail.com
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  For general inquiries
                </p>
                <a href="mailto:support@tseboiq.com" className="text-secondary hover:underline block mt-2">
                  support@tseboiq.com
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  For technical support
                </p>
                <a href="mailto:privacy@tseboiq.com" className="text-secondary hover:underline block mt-2">
                  privacy@tseboiq.com
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  For data privacy queries
                </p>
              </div>

              {/* Phone */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Call Us</h3>
                <p className="text-gray-700 dark:text-gray-300">+27 (0) 123 456 789</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Mon-Fri: 8:00 AM - 5:00 PM SAST
                </p>
              </div>

              {/* Location */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Visit Us</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Johannesburg, South Africa
                </p>
              </div>

              {/* Social Media */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Send us a Message
                </h2>

                {submitted ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      Thank you for contacting us. We&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form 
                    name="contact" 
                    method="POST" 
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    {/* Netlify form detection */}
                    <input type="hidden" name="form-name" value="contact" />
                    {/* Honeypot field for spam protection */}
                    <p className="hidden">
                      <label>
                        Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
                      </label>
                    </p>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows="6"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
