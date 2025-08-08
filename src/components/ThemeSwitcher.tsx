import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="Toggle theme"
      >
        <div className="relative w-5 h-5">
          {/* Animated icon transition */}
          <Sun className={`absolute inset-0 w-5 h-5 text-gray-600 dark:text-gray-400 transition-all duration-300 ${
            resolvedTheme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`} />
          <Moon className={`absolute inset-0 w-5 h-5 text-gray-600 dark:text-gray-400 transition-all duration-300 ${
            resolvedTheme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`} />
        </div>
      </button>

      {/* Dropdown menu */}
      <div className={`absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => {
              setTheme(value);
              setIsOpen(false);
            }}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
            {theme === value && (
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Mobile-optimized theme switcher
export const MobileThemeSwitcher: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun className={`absolute inset-0 w-6 h-6 text-gray-600 dark:text-gray-400 transition-all duration-300 ${
          resolvedTheme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'
        }`} />
        <Moon className={`absolute inset-0 w-6 h-6 text-gray-600 dark:text-gray-400 transition-all duration-300 ${
          resolvedTheme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
        }`} />
      </div>
    </button>
  );
};