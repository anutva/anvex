import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { compressImage, validateImageFile } from '../utils/imageUtils';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setError(null);
    setIsUploading(true);

    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!validateImageFile(file)) {
          setError(`Invalid file: ${file.name}. Please upload JPEG, PNG, GIF, or WebP images under 10MB.`);
          continue;
        }

        if (images.length + newImages.length >= maxImages) {
          setError(`Maximum ${maxImages} images allowed.`);
          break;
        }

        try {
          const compressedImage = await compressImage(file);
          newImages.push(compressedImage);
        } catch (err) {
          console.error('Error compressing image:', err);
          setError(`Failed to process image: ${file.name}`);
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      const fileList = new DataTransfer();
      imageFiles.forEach(file => fileList.items.add(file));
      await handleFileSelect(fileList.files);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
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
    <div className="space-y-3" onPaste={handlePaste} tabIndex={0}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all cursor-pointer ${
          dragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Processing images...</span>
            </div>
          ) : (
            <>
              <Upload className="w-6 sm:w-8 h-6 sm:h-8 text-gray-500 dark:text-gray-400" />
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-blue-600 dark:text-blue-400">Tap to upload</span>
                <span className="hidden sm:inline">, drag and drop, or paste (Ctrl+V)</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF, WebP up to 10MB (max {maxImages} images)
              </div>
            </>
          )}
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

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="overflow-x-auto pb-2 -mb-2">
          <div className="flex gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group flex-shrink-0">
                <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 dark:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 dark:hover:bg-red-700 touch-manipulation"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <ImageIcon className="w-4 h-4" />
          <span>{images.length} image{images.length !== 1 ? 's' : ''} selected</span>
        </div>
      )}
    </div>
  );
};