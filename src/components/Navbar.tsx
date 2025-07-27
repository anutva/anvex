import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileSpreadsheet, Home, BookOpen, MessageSquare } from 'lucide-react'; // Changed the icon for Anusarth for clarity

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Anusar
              </h1>
              <p className="text-xs text-gray-500">
                Study Buddy with no noise.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link
              to="/documents"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/documents')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Documents
            </Link>

            {/* --- THIS LINK IS NOW CORRECT --- */}
            <Link
              to="/anusarth"
              state={{ from: location.pathname }} // This line was added
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/anusarth')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Anusarth.AI
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;