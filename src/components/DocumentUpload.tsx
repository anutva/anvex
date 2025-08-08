import React, { useRef, useState } from 'react';
import { Upload, X, File as FileIcon, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  documents: File[];
  onDocumentsChange: (documents: File[]) => void;
  maxDocuments?: number;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  onDocumentsChange,
  maxDocuments = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    setError(null);

    const newDocuments: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (documents.length + newDocuments.length >= maxDocuments) {
        setError(`Maximum ${maxDocuments} documents allowed.`);
        break;
      }
      newDocuments.push(file);
    }

    if (newDocuments.length > 0) {
      onDocumentsChange([...documents, ...newDocuments]);
    }
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    onDocumentsChange(updatedDocuments);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all cursor-pointer ${
          dragOver 
            ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-6 sm:w-8 h-6 sm:h-8 text-gray-500 dark:text-gray-400" />
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium text-green-600 dark:text-green-400">Tap to upload documents</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Max {maxDocuments} documents
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start sm:items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-xs sm:text-sm text-red-700 dark:text-red-300 flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Document Previews */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-sm truncate">{doc.name}</span>
              </div>
              <button
                onClick={() => removeDocument(index)}
                className="p-1 text-gray-500 hover:text-red-500 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};