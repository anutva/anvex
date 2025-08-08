import React, { useState, useEffect } from 'react';
import { History, MessageSquare, Trash2, Plus, ChevronLeft, Clock, Search } from 'lucide-react';
import { ChatSession } from '../types';
import { ChatHistoryManager } from '../utils/chatHistory';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
  isOpen,
  onToggle,
}) => {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [touchedSession, setTouchedSession] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString('en-IN');
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const dateKey = formatDate(session.updatedAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  // Handle touch interactions for mobile
  const handleTouchStart = (sessionId: string) => {
    setTouchedSession(sessionId);
    setTimeout(() => {
      if (touchedSession === sessionId) {
        setHoveredSession(sessionId);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    setTouchedSession(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation"
        title="Open Chat History"
      >
        <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden animate-fade-in"
        onClick={onToggle}
      />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-full sm:w-80 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border z-50 flex flex-col shadow-xl lg:shadow-none transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Anvex</h2>
            </div>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden touch-manipulation active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg touch-manipulation active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
            />
          </div>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto">
          {Object.keys(groupedSessions).length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {searchQuery ? 'No matching chats found' : 'No chat history yet'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {searchQuery ? 'Try a different search term' : 'Start a conversation to see it here'}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedSessions).map(([dateGroup, groupSessions]) => (
                <div key={dateGroup} className="mb-4">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {dateGroup}
                  </h3>
                  <div className="space-y-1">
                    {groupSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`group relative rounded-lg transition-all duration-200 ${
                          currentSessionId === session.id
                            ? 'bg-gray-100 dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                        onMouseEnter={() => setHoveredSession(session.id)}
                        onMouseLeave={() => setHoveredSession(null)}
                        onTouchStart={() => handleTouchStart(session.id)}
                        onTouchEnd={handleTouchEnd}
                      >
                        <button
                          onClick={() => onSessionSelect(session)}
                          className="w-full text-left p-3 rounded-lg touch-manipulation"
                        >
                          <div className="flex items-start gap-3">
                            <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              currentSessionId === session.id 
                                ? 'text-indigo-600 dark:text-indigo-400' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                currentSessionId === session.id 
                                  ? 'text-indigo-900 dark:text-indigo-100' 
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {session.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </button>
                        
                        {(hoveredSession === session.id || touchedSession === session.id) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this chat?')) {
                                onDeleteSession(session.id);
                              }
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all touch-manipulation"
                            title="Delete chat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Your educational assistant for Indian students
          </p>
        </div>
      </div>
    </>
  );
};