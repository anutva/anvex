import React, { useState, useEffect } from 'react';
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
    const savedSetup = localStorage.getItem('anusarSetup');
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <SetupModal
          isOpen={showSetupModal}
          onComplete={handleSetupComplete}
        />
      </div>
    );
  }

  if (!setupData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Document Library
              </h1>
              <p className="text-gray-600 mt-1">
                {setupData.schoolName} - {setupData.selectedSchool}
              </p>
            </div>
            <button
              onClick={handleChangeSettings}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200"
            >
              Change Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MultiSheetTable
          selectedClass={setupData.selectedClass}
          selectedSection={setupData.selectedSection}
        />
      </main>
    </div>
  );
};

export default DocumentsPage;