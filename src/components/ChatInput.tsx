import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Image as ImageIcon, Paperclip, Mic, X, ArrowLeft, File as FileIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ImageUpload } from './ImageUpload';
import { DocumentUpload } from './DocumentUpload';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendMessageWithImages: (message: string, images: string[]) => void;
  onSendMessageWithDocuments: (message: string, documents: File[]) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendMessageWithImages,
  onSendMessageWithDocuments,
  isLoading,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePasteInTextarea = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
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
      setShowImageUpload(true);
      
      // Process images similar to ImageUpload component
      try {
        const { compressImage, validateImageFile } = await import('../utils/imageUtils');
        const newImages: string[] = [];
        
        for (const file of imageFiles) {
          if (validateImageFile(file) && images.length + newImages.length < 5) {
            try {
              const compressedImage = await compressImage(file);
              newImages.push(compressedImage);
            } catch (err) {
              console.error('Error compressing pasted image:', err);
            }
          }
        }
        
        if (newImages.length > 0) {
          setImages(prev => [...prev, ...newImages]);
        }
      } catch (err) {
        console.error('Error processing pasted images:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      if (documents.length > 0) {
        onSendMessageWithDocuments(message.trim(), documents);
        setDocuments([]);
      } else if (images.length > 0) {
        onSendMessageWithImages(message.trim(), images);
        setImages([]);
      } else {
        onSendMessage(message.trim());
      }
      setMessage('');
      setShowImageUpload(false);
      setShowDocumentUpload(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [message]);

  const clearImages = () => {
    setImages([]);
    setShowImageUpload(false);
  };

  const clearDocuments = () => {
    setDocuments([]);
    setShowDocumentUpload(false);
  };

  return (
    <div className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Image Upload Section */}
      {showImageUpload && (
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Images ({images.length}/5)
            </span>
            <button
              onClick={clearImages}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Clear all images"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={5}
          />
        </div>
      )}

      {/* Document Upload Section */}
      {showDocumentUpload && (
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Documents ({documents.length}/5)
            </span>
            <button
              onClick={clearDocuments}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Clear all documents"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <DocumentUpload
            documents={documents}
            onDocumentsChange={setDocuments}
            maxDocuments={5}
          />
        </div>
      )}
      
      {/* Input Section */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3 items-end">
          {/* Back button */}
          <button
            type="button"
            onClick={() => {
              if (location.state?.from) {
                navigate(location.state.from);
              } else {
                navigate("/");
              }
            }}
            className="p-2.5 sm:p-3 rounded-lg transition-all flex-shrink-0 touch-manipulation active:scale-95 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Attachment buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowImageUpload(!showImageUpload);
                setShowDocumentUpload(false);
              }}
              className={`p-2.5 sm:p-3 rounded-lg transition-all flex-shrink-0 touch-manipulation active:scale-95 relative ${
                showImageUpload || images.length > 0
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              disabled={disabled || isLoading}
              title="Add images"
            >
              <ImageIcon className="w-5 h-5" />
              {images.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {images.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDocumentUpload(!showDocumentUpload);
                setShowImageUpload(false);
              }}
              className={`p-2.5 sm:p-3 rounded-lg transition-all flex-shrink-0 touch-manipulation active:scale-95 relative ${
                showDocumentUpload || documents.length > 0
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              disabled={disabled || isLoading}
              title="Add documents"
            >
              <FileIcon className="w-5 h-5" />
              {documents.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 dark:bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                  {documents.length}
                </span>
              )}
            </button>
          </div>
          
          {/* Text Input Container */}
          <div className={`flex-1 relative transition-all duration-200 ${
            isFocused ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
          } rounded-lg`}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onPaste={handlePasteInTextarea}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={disabled ? "Complete setup to start chatting..." : "Type a message..."}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-colors"
              rows={1}
              style={{ maxHeight: '120px' }}
              disabled={disabled || isLoading}
            />
            
            {/* Mobile mic button */}
            <button
              type="button"
              className="sm:hidden absolute right-2 bottom-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors touch-manipulation"
              disabled={disabled || isLoading}
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className={`p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 touch-manipulation active:scale-95 ${
              message.trim() && !isLoading && !disabled
                ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Character count for mobile */}
        {message.length > 100 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right sm:hidden">
            {message.length} characters
          </div>
        )}
      </form>
    </div>
  );
};