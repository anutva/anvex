import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, Calendar, Tag, ChevronRight } from 'lucide-react';
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

const dataModules = import.meta.glob('../data/**/*.json');

const MultiSheetTable: React.FC<MultiSheetTableProps> = ({ selectedClass, selectedSection }) => {
  const [sectionData, setSectionData] = useState<TableItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classNumber = parseInt(selectedClass, 10);
        let path;
        if (classNumber <= 10) {
          path = `../data/${selectedClass}.json`;
        } else {
          path = `../data/${selectedClass}/${selectedSection}.json`;
        }

        if (dataModules[path]) {
          const dataModule = await dataModules[path]();
          setSectionData((dataModule as any).default || []);
        } else {
            setSectionData([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setSectionData([]);
      }
    };

    if (selectedClass) {
      fetchData();
    }
  }, [selectedClass, selectedSection]);
  
  const sheets = React.useMemo(() => {
    const subjectGroups: { [key: string]: TableItem[] } = {};
    
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

  const handleView = (pdfUrl: string) => {
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
    const colors: { [key: string]: { light: string; dark: string } } = {
      'Mathematics': { 
        light: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        dark: 'border-blue-200 dark:border-blue-800'
      },
      'English': { 
        light: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        dark: 'border-purple-200 dark:border-purple-800'
      },
      'Hindi': { 
        light: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
        dark: 'border-rose-200 dark:border-rose-800'
      },
      'Sanskrit': { 
        light: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
        dark: 'border-amber-200 dark:border-amber-800'
      },
      'Science': { 
        light: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        dark: 'border-green-200 dark:border-green-800'
      },
      'Social Science': { 
        light: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        dark: 'border-orange-200 dark:border-orange-800'
      },
      'SST': { 
        light: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        dark: 'border-orange-200 dark:border-orange-800'
      },
      'Commerce': { 
        light: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
        dark: 'border-teal-200 dark:border-teal-800'
      },
      'Computer Science': { 
        light: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
        dark: 'border-slate-200 dark:border-slate-800'
      },
      'Psychology': { 
        light: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
        dark: 'border-pink-200 dark:border-pink-800'
      },
      'Sociology': { 
        light: 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300',
        dark: 'border-stone-200 dark:border-stone-800'
      },
      'Home Science': { 
        light: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
        dark: 'border-fuchsia-200 dark:border-fuchsia-800'
      },
      'Physical Education': { 
        light: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
        dark: 'border-emerald-200 dark:border-emerald-800'
      },
      'Fine Arts': { 
        light: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        dark: 'border-red-200 dark:border-red-800'
      },
      'Music': { 
        light: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
        dark: 'border-violet-200 dark:border-violet-800'
      },
      'General': { 
        light: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        dark: 'border-gray-200 dark:border-gray-800'
      },
      'Guidance': { 
        light: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
        dark: 'border-cyan-200 dark:border-cyan-800'
      }
    };
    return colors[category] || colors['General'];
  };

  if (sheets.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
        <div className="text-center py-12 px-4">
          <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents available</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No documents found for Class {selectedClass}
            {parseInt(selectedClass) > 10 ? `, Stream ${selectedSection}` : ''}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Card - Desktop Only */}
      <div className="hidden sm:block mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 transition-colors duration-300">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Class {selectedClass}
              {parseInt(selectedClass) > 10 && ` - ${selectedSection} Stream`}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {sectionData.length} documents • {sheets.length} subjects
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="w-full bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-dark-border">
          <nav className="flex space-x-0 overflow-x-auto scrollbar-hide" aria-label="Tabs">
            {sheets.map((sheet, index) => (
              <button
                key={index}
                onClick={() => setActiveSheet(index)}
                className={`relative px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap touch-manipulation ${
                  activeSheet === index
                    ? 'text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1.5" />
                  <span className="hidden xs:inline">{sheet.sheetName}</span>
                  <span className="xs:hidden">{sheet.sheetName.slice(0, 3)}</span>
                  <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {sheet.data.length}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
              {sheets[activeSheet]?.data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category).light}`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-300 flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                      {formatDate(item.date)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleView(item.pdfUrl)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(item.pdfUrl, item.name)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-all"
                      >
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

        {/* Mobile Card View */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-200 dark:divide-dark-border">
            {sheets[activeSheet]?.data.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-start">
                      <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${getCategoryColor(item.category).light}`}>
                        <Tag className="w-3 h-3 mr-1" />
                        {item.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleView(item.pdfUrl)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg active:scale-95 transition-all touch-manipulation"
                  >
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(item.pdfUrl, item.name)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg active:scale-95 transition-all touch-manipulation"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {sheets[activeSheet]?.data.length === 0 && (
          <div className="text-center py-12 px-4">
            <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No documents in this subject
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No documents found for {sheets[activeSheet]?.sheetName}.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-dark-border">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
            Showing {sheets[activeSheet]?.data.length || 0} documents in {sheets[activeSheet]?.sheetName || 'Unknown'}
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiSheetTable;