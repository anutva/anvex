import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, Grid } from 'lucide-react';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/documents', label: 'Documents', icon: BookOpen },
    { path: '/anvex', label: 'AI Chat', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border z-50 pb-safe-bottom">
      <div className="grid grid-cols-3 h-16">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            state={{ from: location.pathname }}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
              isActive(path)
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <div className={`p-1 rounded-lg transition-all ${
              isActive(path) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}>
              <Icon className={`w-5 h-5 ${
                isActive(path) ? 'scale-110' : ''
              }`} />
            </div>
            <span className={`text-xs font-medium ${
              isActive(path) ? 'scale-105' : ''
            }`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;