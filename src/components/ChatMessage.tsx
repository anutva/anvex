import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Image as ImageIcon, Copy, Check, Maximize2, X, File as FileIcon } from 'lucide-react';
import { Message } from '../types';
import 'katex/dist/katex.min.css';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      
      return !inline && match ? (
        <div className="relative group my-3">
          <div className="absolute right-2 top-2 z-10">
            <button
              onClick={() => handleCopyCode(codeString)}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 dark:bg-gray-700 text-white p-1.5 rounded hover:bg-gray-700 dark:hover:bg-gray-600"
              title="Copy code"
            >
              {copiedCode === codeString ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <SyntaxHighlighter
            style={document.documentElement.classList.contains('dark') ? oneDark : tomorrow}
            language={match[1]}
            PreTag="div"
            className="rounded-lg text-sm"
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }: any) => (
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-4 sm:mt-6 mb-3 sm:mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-4 sm:mt-5 mb-2 sm:mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mt-3 sm:mt-4 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 space-y-1 ml-2">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 space-y-1 ml-2">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="ml-2">
        {children}
      </li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-3 sm:pl-4 py-2 my-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 italic text-sm sm:text-base">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4 -mx-4 sm:mx-0">
        <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-gray-50 dark:bg-gray-800">
        {children}
      </thead>
    ),
    th: ({ children }: any) => (
      <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
        {children}
      </td>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-600 dark:text-gray-300">
        {children}
      </em>
    ),
    a: ({ children, href }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline touch-manipulation"
      >
        {children}
      </a>
    ),
    hr: () => (
      <hr className="my-4 sm:my-6 border-gray-300 dark:border-gray-600" />
    ),
  };

  return (
    <div className={`flex gap-3 sm:gap-4 p-4 sm:p-6 ${
      isUser 
        ? 'bg-gray-50 dark:bg-gray-800/50' 
        : 'bg-white dark:bg-dark-card'
    } transition-colors duration-300`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-blue-600 dark:bg-blue-500' 
          : 'bg-green-600 dark:bg-green-500'
      }`}>
        {isUser ? (
          <User className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
        ) : (
          <Bot className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
            {isUser ? 'You' : 'Anvex'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="max-w-none">
          {/* Display images if present */}
          {message.images && message.images.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {message.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-all touch-manipulation"
                      onClick={() => setExpandedImage(image)}
                    />
                    <button
                      onClick={() => setExpandedImage(image)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display documents if present */}
          {message.documents && message.documents.length > 0 && (
            <div className="mb-3 space-y-2">
              {message.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-sm truncate">{doc.name}</span>
                </div>
              ))}
            </div>
          )}
          
          {isUser ? (
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : (
            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={MarkdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setExpandedImage(null)}
        >
          <img
            src={expandedImage}
            alt="Expanded view"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};