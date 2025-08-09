import React from 'react';
import { FileSpreadsheet, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Github, href: 'https://github.com/anutva/anvex', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Documents', href: '/documents' },
    { label: 'Anvex.AI', href: '/anvex' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ];

  return (
    <footer className="hidden md:block bg-gray-900 dark:bg-dark-bg text-white border-t border-gray-800 dark:border-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <FileSpreadsheet className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <h3 className="text-xl font-bold">Anvex</h3>
                <p className="text-sm text-gray-400">Study Buddy, With no noise</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 max-w-md">
              Your comprehensive platform for accessing CBSE educational documents and AI-powered study assistance.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 rounded-lg bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a 
                    href={href} 
                    className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Study Materials
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Sample Papers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Syllabus
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                <span>+91 91184 33867</span>
              </li>
              <li className="flex items-center text-sm text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                <a href="mailto:astitvapratapsingh7@icloud.com" className="hover:text-white transition-colors">
                  astitvapratapsingh7@icloud.com
                </a>
              </li>
              <li className="flex items-start text-sm text-gray-300">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                <span>
                  Lucknow, Uttar Pradesh<br />
                  India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              © 2024 Anutva Technologies. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              {legalLinks.map(({ label, href }) => (
                <a 
                  key={label}
                  href={href} 
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;