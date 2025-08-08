import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, Eye, Users, FileText, Award, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const features = [
    {
      icon: Eye,
      title: 'PDF Viewer',
      description: 'View documents directly in your browser with zoom, rotation, and navigation controls.',
      gradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      borderColor: 'border-blue-100 dark:border-blue-800',
      iconBg: 'bg-blue-600 dark:bg-blue-500',
    },
    {
      icon: Download,
      title: 'Instant Downloads',
      description: 'Download any document with a single tap. Files are properly named and ready for offline access.',
      gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-100 dark:border-green-800',
      iconBg: 'bg-green-600 dark:bg-green-500',
    },
    {
      icon: Users,
      title: 'Anvex.AI',
      description: 'The intelligent study partner that understands you. Personalized guidance to help you excel.',
      gradient: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
      borderColor: 'border-purple-100 dark:border-purple-800',
      iconBg: 'bg-purple-600 dark:bg-purple-500',
    },
  ];

  const stats = [
    { value: '7', label: 'Class Levels' },
    { value: '8', label: 'Sections per Class' },
    { value: '5', label: 'CBSE Schools' },
    { value: '100+', label: 'Documents' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Anvex
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto px-4 animate-fade-in animation-delay-200">
              Your comprehensive platform for accessing educational documents, worksheets, 
              and study materials across all classes and subjects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 animate-fade-in animation-delay-400">
              <Link
                to="/documents"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Access Documents
                <ArrowRight className="w-4 h-4 ml-2 hidden sm:block" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-4 text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 shadow-md hover:shadow-lg touch-manipulation"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 dark:opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 dark:opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 dark:opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Academic Success
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Streamlined access to CBSE educational resources with powerful features designed for students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.gradient} p-6 sm:p-8 rounded-2xl border ${feature.borderColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 touch-manipulation`}
              >
                <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-blue-100 dark:text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <FileText className="w-12 sm:w-16 h-12 sm:h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-8 px-4">
            Access thousands of educational documents organized by class, section, and school. 
            Get started in seconds with our streamlined setup process.
          </p>
          <Link
            to="/documents"
            className="inline-flex items-center px-6 sm:px-8 py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation"
          >
            <Award className="w-5 h-5 mr-2" />
            Start Exploring
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;