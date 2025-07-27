import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageUpload } from './ImageUpload';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendMessageWithImages: (message: string, images: string[]) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendMessageWithImages,
  isLoading,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
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
      if (images.length > 0) {
        onSendMessageWithImages(message.trim(), images);
        setImages([]);
      } else {
        onSendMessage(message.trim());
      }
      setMessage('');
      setShowImageUpload(false);
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
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Image Upload Section */}
      {showImageUpload && (
        <div className="p-4 border-b border-gray-200">
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={5}
          />
        </div>
      )}
      
      {/* Input Section */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-3 items-end">
          <Link
            to="/documents"
            className="p-3 rounded-lg transition-colors flex-shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200"
            title="Back to homepage"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <button
            type="button"
            onClick={() => setShowImageUpload(!showImageUpload)}
            className={`p-3 rounded-lg transition-colors flex-shrink-0 ${
              showImageUpload || images.length > 0
                ? 'bg-gray-100 text-blue-600 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
            }`}
            disabled={disabled || isLoading}
            title="Add images"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onPaste={handlePasteInTextarea}
            placeholder="Type your message here... (Shift+Enter for new line, Ctrl+V to paste images)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 overflow-hidden bg-white text-gray-900"
            rows={1}
            style={{ maxHeight: '7.5rem' }}
            disabled={disabled || isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
        </div>
      </form>
    </div>
  );
};