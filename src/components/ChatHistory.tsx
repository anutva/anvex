import React, { useState } from 'react';
import { History, MessageSquare, Trash2, Plus, ChevronLeft } from 'lucide-react';
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

  const groupedSessions = sessions.reduce((groups, session) => {
    const dateKey = formatDate(session.updatedAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-3 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
        title="Open Chat History"
      >
        <History className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onToggle}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 flex flex-col shadow-xl lg:shadow-none">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-semibold text-gray-900">Anusarth</h2>
            </div>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto">
          {Object.keys(groupedSessions).length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-sm">No chat history yet</p>
              <p className="text-xs text-gray-500 mt-1">Start a conversation to see it here</p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedSessions).map(([dateGroup, groupSessions]) => (
                <div key={dateGroup} className="mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                    {dateGroup}
                  </h3>
                  <div className="space-y-1">
                    {groupSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`group relative rounded-lg transition-all duration-200 ${
                          currentSessionId === session.id
                            ? 'bg-gray-100 border border-indigo-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onMouseEnter={() => setHoveredSession(session.id)}
                        onMouseLeave={() => setHoveredSession(null)}
                      >
                        <button
                          onClick={() => onSessionSelect(session)}
                          className="w-full text-left p-3 rounded-lg"
                        >
                          <div className="flex items-start gap-3">
                            <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              currentSessionId === session.id ? 'text-indigo-600' : 'text-gray-400'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                currentSessionId === session.id ? 'text-indigo-900' : 'text-gray-900'
                              }`}>
                                {session.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {session.messages.length} messages
                              </p>
                            </div>
                          </div>
                        </button>
                        
                        {hoveredSession === session.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your educational assistant for Indian students
          </p>
        </div>
      </div>
    </>
  );
};