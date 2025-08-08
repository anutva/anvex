import React, { useState, useEffect } from 'react';
import { Settings, School, User } from 'lucide-react';
import MultiSheetTable from '../components/MultiSheetTable';
import SetupModal from '../components/SetupModal';

interface SetupData {
  schoolName: string;
  selectedClass: string;
  selectedSection: string;
  selectedSchool: string;
}

const DocumentsPage: React.FC = () => {
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    // Check if setup data exists in localStorage
    const savedSetup = localStorage.getItem('anvexSetup');
    if (savedSetup) {
      setSetupData(JSON.parse(savedSetup));
    } else {
      setShowSetupModal(true);
    }
  }, []);

  const handleSetupComplete = (data: SetupData) => {
    setSetupData(data);
    setShowSetupModal(false);
  };

  const handleChangeSettings = () => {
    setShowSetupModal(true);
  };

  if (showSetupModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <SetupModal
          isOpen={showSetupModal}
          onComplete={handleSetupComplete}
        />
      </div>
    );
  }

  if (!setupData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-dark-border sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Document Library
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{setupData.schoolName}</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <School className="w-4 h-4" />
                  <span>{setupData.selectedSchool}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleChangeSettings}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 touch-manipulation active:scale-95"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden xs:inline">Change Settings</span>
              <span className="xs:hidden">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Info Cards */}
      <div className="sm:hidden px-4 py-4 grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-dark-card p-3 rounded-lg border border-gray-200 dark:border-dark-border">
          <p className="text-xs text-gray-500 dark:text-gray-400">Class</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {setupData.selectedClass}
            {parseInt(setupData.selectedClass) > 10 && ` - ${setupData.selectedSection}`}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card p-3 rounded-lg border border-gray-200 dark:border-dark-border">
          <p className="text-xs text-gray-500 dark:text-gray-400">School</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{setupData.selectedSchool}</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <MultiSheetTable
          selectedClass={setupData.selectedClass}
          selectedSection={setupData.selectedSection}
        />
      </main>
    </div>
  );
};

export default DocumentsPage;