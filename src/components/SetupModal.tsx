import React, { useState } from 'react';
import { X, School, Users, BookOpen, Building, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logToGoogleSheets } from '../utils/googleSheets';

interface SetupData {
  schoolName: string;
  selectedClass: string;
  selectedSection: string; // Will hold either the section OR the stream
  selectedSchool: string;
}

interface SetupModalProps {
  isOpen: boolean;
  onComplete: (data: SetupData) => void;
}

const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onComplete }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<SetupData>({
    schoolName: '',
    selectedClass: '',
    selectedSection: '',
    selectedSchool: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const classes = ['6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const streams = ['Science', 'Commerce', 'Arts'];
  const schools = ['S.V.M', 'R.L.B', 'K.V', 'CATHEDRAL'];

  const handleClassSelect = (cls: string) => {
    setFormData({ ...formData, selectedClass: cls, selectedSection: '' });
  };
  
  const handleSectionOrStreamSelect = (selection: string) => {
    setFormData({ ...formData, selectedSection: selection });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName || !formData.selectedClass || !formData.selectedSection || !formData.selectedSchool) {
      return;
    }
    setIsLoading(true);
    try {
      await logToGoogleSheets({ ...formData, userEmail: user?.email });
    } catch (error) {
      console.error('Failed to log to Google Sheets:', error);
    }
    localStorage.setItem('anvexSetup', JSON.stringify(formData));
    setIsLoading(false);
    onComplete(formData);
  };

  if (!isOpen) return null;

  const selectedClassNum = parseInt(formData.selectedClass, 10);
  const optionsToShow = selectedClassNum > 10 ? streams : sections;
  const labelText = selectedClassNum > 10 ? 'Select Stream' : 'Select Section';

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1: return !!formData.schoolName;
      case 2: return !!formData.selectedClass;
      case 3: return !!formData.selectedSection;
      case 4: return !!formData.selectedSchool;
      default: return false;
    }
  };

  const allStepsComplete = formData.schoolName && formData.selectedClass && formData.selectedSection && formData.selectedSchool;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 dark:bg-black/85 animate-fade-in">
        {/* Modal */}
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-6 sm:px-8 py-6">
            <div className="flex items-center">
              <School className="w-8 h-8 text-white mr-3" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome to Anvex</h2>
                <p className="text-sm sm:text-base text-blue-100">Let's set up your profile</p>
              </div>
            </div>
          </div>

          {/* Progress Steps - Mobile */}
          <div className="sm:hidden px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-dark-border">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all ${
                    isStepComplete(step)
                      ? 'bg-green-500 text-white'
                      : step === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {isStepComplete(step) ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => {
                    setFormData({ ...formData, schoolName: e.target.value });
                    setCurrentStep(2);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all"
                  placeholder="Enter your name"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Class Selector */}
              <div className={`transition-all duration-300 ${formData.schoolName ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <BookOpen className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Select Class
                </label>
                <div className="grid grid-cols-3 xs:grid-cols-4 gap-2 sm:gap-3">
                  {classes.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        handleClassSelect(cls);
                        setCurrentStep(3);
                      }}
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border font-medium transition-all touch-manipulation active:scale-95 ${
                        formData.selectedClass === cls
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                      disabled={isLoading}
                    >
                      <span className="sm:hidden">{cls}</span>
                      <span className="hidden sm:inline">Class {cls}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section/Stream Selector */}
              {formData.selectedClass && (
                <div className="animate-fade-in">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Users className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    {labelText}
                  </label>
                  <div className={`grid gap-2 sm:gap-3 ${
                    selectedClassNum > 10 ? 'grid-cols-3' : 'grid-cols-3 xs:grid-cols-4'
                  }`}>
                    {optionsToShow.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          handleSectionOrStreamSelect(option);
                          setCurrentStep(4);
                        }}
                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border font-medium transition-all touch-manipulation active:scale-95 ${
                          formData.selectedSection === option
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                        disabled={isLoading}
                      >
                        {selectedClassNum <= 10 && <span className="sm:hidden">{option}</span>}
                        {selectedClassNum <= 10 && <span className="hidden sm:inline">Section {option}</span>}
                        {selectedClassNum > 10 && option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* School Selector */}
              <div className={`transition-all duration-300 ${
                formData.selectedSection ? 'opacity-100' : 'opacity-50 pointer-events-none'
              }`}>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <School className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Select Institution
                </label>
                <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-3">
                  {schools.map((school) => (
                    <button
                      key={school}
                      type="button"
                      onClick={() => setFormData({ ...formData, selectedSchool: school })}
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border font-medium transition-all touch-manipulation active:scale-95 ${
                        formData.selectedSchool === school
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                      disabled={isLoading}
                    >
                      {school}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={!allStepsComplete || isLoading}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white py-3 px-6 rounded-lg font-semibold text-base sm:text-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation active:scale-[0.98] ${
                  allStepsComplete && !isLoading ? 'hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  'Complete Setup & Access Documents'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SetupModal;