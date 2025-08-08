import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onDismiss }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-4 transition-colors duration-300">
      <div className="flex items-start gap-2 sm:gap-3">
        <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1 break-words">{error}</p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 -m-1 text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 touch-manipulation"
          aria-label="Dismiss error"
        >
          <X className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>
      </div>
    </div>
  );
};