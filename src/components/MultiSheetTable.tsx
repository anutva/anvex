import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, Calendar, Tag } from 'lucide-react';
import tableData from '../data/tableData.json';

interface TableItem {
  id: number;
  name: string;
  pdfUrl: string;
  category: string;
  date: string;
  subject: string;
}

interface MultiSheetTableProps {
  selectedClass: string;
  selectedSection: string;
}

const MultiSheetTable: React.FC<MultiSheetTableProps> = ({ selectedClass, selectedSection }) => {
  // --- THIS IS THE OPTIMIZED LOGIC BLOCK ---
  const sectionData = React.useMemo(() => {
    const classNumber = parseInt(selectedClass, 10);
    const classData = (tableData as any)[selectedClass];

    if (!classData) {
      return []; // No data for this class at all
    }

    // If class is 10 or below, the data is a direct array. Ignore the section.
    if (classNumber <= 10 && Array.isArray(classData)) {
      return classData;
    }

    // If class is 11 or 12, the data is an object keyed by section/stream.
    // This part remains the same as your old logic.
    return classData[selectedSection] || [];
  }, [selectedClass, selectedSection]);
  // --- END OF OPTIMIZED LOGIC ---
  
  // Group documents by subject to create sheets
  const sheets = React.useMemo(() => {
    const subjectGroups: { [key: string]: TableItem[] } = {};
    
    // This part works perfectly with the new sectionData logic
    sectionData.forEach((item: TableItem) => {
      if (!subjectGroups[item.subject]) {
        subjectGroups[item.subject] = [];
      }
      subjectGroups[item.subject].push(item);
    });
    
    return Object.entries(subjectGroups).map(([subject, data]) => ({
      sheetName: subject,
      data
    }));
  }, [sectionData]);
  
  const [activeSheet, setActiveSheet] = useState(0);

  // When the class or section changes, reset the active tab to the first one
  useEffect(() => {
    setActiveSheet(0);
  }, [selectedClass, selectedSection]);

  const handleDownload = async (pdfUrl: string, fileName: string) => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(pdfUrl, '_blank');
    }
  };

  const handleView = (pdfUrl: string, fileName: string) => {
    window.open(pdfUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
const colors: { [key: string]: string } = {
  'Mathematics': 'bg-blue-100 text-blue-800', 
  'English': 'bg-purple-100 text-purple-800', 
  'Hindi': 'bg-rose-100 text-rose-800', 
  'Sanskrit': 'bg-amber-100 text-amber-800', 
  'Science': 'bg-green-100 text-green-800', 
  'Social Science': 'bg-orange-100 text-orange-800', 
  'SST': 'bg-orange-100 text-orange-800', 
  'Commerce': 'bg-teal-100 text-teal-800', 
  'Computer Science': 'bg-slate-100 text-slate-800', 
  'Psychology': 'bg-pink-100 text-pink-800', 
  'Sociology': 'bg-stone-100 text-stone-800', 
  'Home Science': 'bg-fuchsia-100 text-fuchsia-800', 
  'Physical Education': 'bg-emerald-100 text-emerald-800', // <-- New Line
  'Fine Arts': 'bg-red-100 text-red-800', 
  'Music': 'bg-violet-100 text-violet-800', 
  'General': 'bg-gray-100 text-gray-800', 
  'Guidance': 'bg-cyan-100 text-cyan-800'
};
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (sheets.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="text-center py-12 px-4">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents available</h3>
          <p className="mt-1 text-sm text-gray-500">
            No documents found for Class {selectedClass}
            {parseInt(selectedClass) > 10 ? `, Stream ${selectedSection}` : ''}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Class and Section Info */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Class {selectedClass}
              {parseInt(selectedClass) > 10 && ` - Stream ${selectedSection}`}
            </h2>
            <p className="text-sm text-gray-600">
              {sectionData.length} documents available across {sheets.length} subjects
            </p>
          </div>
          <div className="text-right text-sm text-gray-500 hidden md:block">
            {sheets.map(sheet => sheet.sheetName).join(', ')}
          </div>
        </div>
      </div>

      {/* The rest of your component JSX for rendering the table is unchanged and will work perfectly. */}
      <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 overflow-x-auto" aria-label="Tabs">
            {sheets.map((sheet, index) => (
              <button
                key={index}
                onClick={() => setActiveSheet(index)}
                className={`relative px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                  activeSheet === index
                    ? 'text-blue-600 border-blue-500 bg-blue-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FileText className="inline-block w-4 h-4 mr-2" />
                {sheet.sheetName}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  {sheet.data.length}
                </span>
              </button>
            ))}
          </nav>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full md:table">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white block md:table-row-group">
              {sheets[activeSheet]?.data.map((item) => (
                <tr 
                  key={item.id}
                  className="block p-4 border-b border-gray-200 md:table-row md:p-0 md:border-b-0 md:border"
                >
                  <td className="block font-semibold text-gray-900 md:table-cell md:px-6 md:py-4 md:whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                      <div>
                        {item.name}
                        <div className="text-sm text-gray-500 font-normal md:hidden">PDF Document</div>
                      </div>
                    </div>
                  </td>
                  <td className="block pt-2 md:table-cell md:px-6 md:py-4 md:whitespace-nowrap">
                    <span className="font-bold text-gray-600 md:hidden">Category: </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {item.category}
                    </span>
                  </td>
                  <td className="block pt-2 md:table-cell md:px-6 md-py-4 md:whitespace-nowrap">
                    <span className="font-bold text-gray-600 md:hidden">Date: </span>
                    <span className="text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2 inline-block" />
                      {formatDate(item.date)}
                    </span>
                  </td>
                  <td className="block pt-4 text-center md:table-cell md:px-6 md:py-4 md:whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-3 md:justify-center">
                      <button onClick={() => handleView(item.pdfUrl, item.name)} className="flex-1 md:flex-none inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button onClick={() => handleDownload(item.pdfUrl, item.name)} className="flex-1 md:flex-none inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sheets[activeSheet]?.data.length === 0 && (
          <div className="text-center py-12 px-4">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents in this subject</h3>
            <p className="mt-1 text-sm text-gray-500">No documents found for {sheets[activeSheet]?.sheetName}.</p>
          </div>
        )}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-gray-500">
              Showing {sheets[activeSheet]?.data.length || 0} documents in {sheets[activeSheet]?.sheetName || 'Unknown'}
            </div>
            <div className="text-sm text-gray-500">
              Class {selectedClass}
              {parseInt(selectedClass) > 10 && ` - Stream ${selectedSection}`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiSheetTable;