import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Facebook, Mail, Phone, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary dark:bg-primary-light text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-4 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              tseboIQ
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              AI-powered recruitment connecting talent with opportunity across Africa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-accent transition-brand">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition-brand">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent transition-brand">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-accent transition-brand">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-accent transition-brand">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:iq.tsebo@gmail.com" className="hover:text-accent transition-brand">
                  iq.tsebo@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-accent" />
                <span>+27 (0) 79 520 8970</span>
              </li>
            </ul>
            {/* Social Links */}
            {/* <div className="flex gap-4 mt-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-300 hover:text-accent transition-brand">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-300 hover:text-accent transition-brand">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-300 hover:text-accent transition-brand">
                <Facebook className="w-5 h-5" />
              </a>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 tseboIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              🔒 POPIA Compliant
            </span>
            <span>•</span>
            <span>Secure & Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
