import React, { useState } from 'react';
import { X, School, Users, BookOpen, Building, Atom, Briefcase, Palette } from 'lucide-react';
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
  const [formData, setFormData] = useState<SetupData>({
    schoolName: '',
    selectedClass: '',
    selectedSection: '',
    selectedSchool: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. DEFINE THE LISTS ---
  const classes = ['6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const streams = ['Science', 'Commerce', 'Arts'];
  const schools = ['S.V.M', 'R.L.B', 'K.V', 'CATHEDRAL'];

  const handleClassSelect = (cls: string) => {
    // When class changes, always clear the section/stream selection
    setFormData({ ...formData, selectedClass: cls, selectedSection: '' });
  };
  
  const handleSectionOrStreamSelect = (selection: string) => {
    setFormData({ ...formData, selectedSection: selection });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName || !formData.selectedClass || !formData.selectedSection || !formData.selectedSchool) {
      alert('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      await logToGoogleSheets(formData); 
    } catch (error) {
      console.error('Failed to log to Google Sheets:', error);
    }
    localStorage.setItem('anusarSetup', JSON.stringify(formData));
    setIsLoading(false);
    onComplete(formData);
  };

  if (!isOpen) return null;

  const selectedClassNum = parseInt(formData.selectedClass, 10);
  
  // --- 2. DETERMINE WHICH LIST TO RENDER ---
  const optionsToShow = selectedClassNum > 10 ? streams : sections;
  const labelText = selectedClassNum > 10 ? 'Select Stream' : 'Select Section';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center">
              <School className="w-8 h-8 text-white mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome to Anusar</h2>
                <p className="text-blue-100">Let's set up your profile</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* School Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><Building className="w-4 h-4 mr-2 text-gray-500" />School Name</label>
                <input type="text" value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your school name" required disabled={isLoading} />
              </div>

              {/* Class Selector */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><BookOpen className="w-4 h-4 mr-2 text-gray-500" />Select Class</label>
                <div className="grid grid-cols-4 gap-3">
                  {classes.map((cls) => (
                    <button key={cls} type="button" onClick={() => handleClassSelect(cls)} className={`py-3 px-4 rounded-lg border font-medium transition-colors ${ formData.selectedClass === cls ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-400' }`} disabled={isLoading}>Class {cls}</button>
                  ))}
                </div>
              </div>

              {/* --- 3. DYNAMIC SECTION/STREAM BLOCK --- */}
              {formData.selectedClass && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><Users className="w-4 h-4 mr-2 text-gray-500" />{labelText}</label>
                  <div className={`grid gap-3 ${selectedClassNum > 10 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                    {optionsToShow.map((option) => (
                      <button key={option} type="button" onClick={() => handleSectionOrStreamSelect(option)} className={`py-3 px-4 rounded-lg border font-medium transition-colors ${ formData.selectedSection === option ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-400' }`} disabled={isLoading}>
                        {selectedClassNum <= 10 && `Section `}{option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* School Selector */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2"><School className="w-4 h-4 mr-2 text-gray-500" />Select Institution</label>
                <div className="grid grid-cols-4 gap-3">
                  {schools.map((school) => (
                    <button key={school} type="button" onClick={() => setFormData({ ...formData, selectedSchool: school })} className={`py-3 px-4 rounded-lg border font-medium transition-colors ${ formData.selectedSchool === school ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-400' }`} disabled={isLoading}>{school}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button type="submit" disabled={!formData.schoolName || !formData.selectedClass || !formData.selectedSection || !formData.selectedSchool || isLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                {isLoading ? ( <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Processing...</div> ) : ( 'Complete Setup & Access Documents' )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Loading Overlay can remain the same */}
    </>
  );
};

export default SetupModal;