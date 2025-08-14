import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, AlertTriangle, Menu, X, Settings } from "lucide-react";
import { ChatMessage } from "../components/ChatMessage";
import { ChatInput } from "../components/ChatInput";
import { ErrorBanner } from "../components/ErrorBanner";
import { ChatHistory } from "../components/ChatHistory";
import { GoogleAIAPI } from "../utils/googleai";
import { ChatHistoryManager } from "../utils/chatHistory";
import { ANVEX_SYSTEM_PROMPT } from "../utils/systemPrompt";
import { Message, ChatSession } from "../types";
import SetupModal from "../components/SetupModal";
import { ThemeSwitcher, MobileThemeSwitcher } from "../components/ThemeSwitcher";

interface SetupData {
  schoolName: string;
  selectedClass: string;
  selectedSection: string;
  selectedSchool: string;
}

export const ChatInterface: React.FC = () => {
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedModel] = useState("gemini-2.0-flash-lite");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey] = useState(import.meta.env.VITE_GOOGLE_AI_API_KEY || "");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSetupData = localStorage.getItem("anvexSetup");
    if (savedSetupData) {
      setSetupData(JSON.parse(savedSetupData));
      setIsSetupModalOpen(false);
    } else {
      setIsSetupModalOpen(true);
    }
  }, []);

  const handleSetupComplete = (data: SetupData) => {
    setSetupData(data);
    setIsSetupModalOpen(false);
  };

  const sendMessage = async (content: string, images: string[] = [], documents: { name: string, mimeType: string, data: string }[] = []) => {
    if (!isApiKeyValid) {
      setError("Please configure your Google AI Studio API key in the .env file");
      return;
    }

    let personalizedSystemPrompt = ANVEX_SYSTEM_PROMPT;
    if (setupData) {
      personalizedSystemPrompt =
        `The user's name is ${setupData.schoolName}. ` +
        `They are in Class ${setupData.selectedClass}, Section ${setupData.selectedSection} ` +
        `at ${setupData.selectedSchool}. Please use this information to provide ` +
        `contextual and personalized help. For example, you can refer to common ` +
        `curriculums for that class. Always be friendly and refer to them by name if appropriate.\n\n` +
        `--- Original Prompt Begins ---\n` +
        ANVEX_SYSTEM_PROMPT;
    }

    let baseSession = currentSession;
    if (!baseSession) {
      baseSession = ChatHistoryManager.createNewSession(selectedModel);
      setCurrentSession(baseSession);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      images: images.length > 0 ? images : undefined,
      documents: documents.length > 0 ? documents : undefined,
      timestamp: new Date(),
    };
    const updatedSession: ChatSession = {
      ...baseSession,
      messages: [...baseSession.messages, userMessage],
      title:
        baseSession.messages.length === 0
          ? ChatHistoryManager.generateSessionTitle(content)
          : baseSession.title,
      model: selectedModel,
      updatedAt: new Date(),
    };
    setCurrentSession(updatedSession);
    setIsLoading(true);
    setError(null);

    try {
      const api = new GoogleAIAPI(apiKey);
      const systemMessage = {
        role: "system" as const,
        content: personalizedSystemPrompt,
      };
      const chatMessages = [
        systemMessage,
        ...updatedSession.messages.map((msg) => ({
          role: msg.role,
          content:
            (msg.images && msg.images.length > 0) || (msg.documents && msg.documents.length > 0)
              ? [
                  { type: "text" as const, text: msg.content },
                  ...(msg.images || []).map((image) => ({
                    type: "image_url" as const,
                    image_url: { url: image },
                  })),
                  ...(msg.documents || []).map((doc) => ({
                    type: "document" as const,
                    document: doc,
                  })),
                ]
              : msg.content,
        })),
      ];
      const response = await api.sendMessage({
        model: selectedModel,
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 2000,
      });
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage],
        updatedAt: new Date(),
      };
      setCurrentSession(finalSession);
      saveCurrentSession(finalSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const sessions = ChatHistoryManager.getAllSessions();
    setChatSessions(sessions);
    if (sessions.length === 0) {
      const newSession = ChatHistoryManager.createNewSession(selectedModel);
      setCurrentSession(newSession);
    }
  }, [selectedModel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const isApiKeyValid = GoogleAIAPI.validateApiKey(apiKey);

  const saveCurrentSession = (session: ChatSession) => {
    ChatHistoryManager.saveChatSession(session);
    setChatSessions(ChatHistoryManager.getAllSessions());
  };

  const handleNewChat = () => {
    const newSession = ChatHistoryManager.createNewSession(selectedModel);
    setCurrentSession(newSession);
    setError(null);
    setIsHistoryOpen(false);
  };

  const handleSessionSelect = (session: ChatSession) => {
    setCurrentSession(session);
    setError(null);
    setIsHistoryOpen(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    ChatHistoryManager.deleteSession(sessionId);
    const updatedSessions = ChatHistoryManager.getAllSessions();
    setChatSessions(updatedSessions);
    if (currentSession?.id === sessionId) {
      if (updatedSessions.length > 0) {
        setCurrentSession(updatedSessions[0]);
      } else {
        const newSession = ChatHistoryManager.createNewSession(selectedModel);
        setCurrentSession(newSession);
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, []);
  };

  const handleSendMessageWithImages = async (
    content: string,
    images: string[]
  ) => {
    await sendMessage(content, images);
  };

  const handleSendMessageWithDocuments = async (
    content: string,
    documents: File[]
  ) => {
    const processedDocuments = await Promise.all(
      documents.map(async (file) => {
        const data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
        return {
          name: file.name,
          mimeType: file.type,
          data,
        };
      })
    );
    await sendMessage(content, [], processedDocuments);
  };

  const clearChat = () => {
    if (currentSession) {
      const clearedSession: ChatSession = {
        ...currentSession,
        messages: [],
        title: "New Chat",
        updatedAt: new Date(),
      };
      setCurrentSession(clearedSession);
      saveCurrentSession(clearedSession);
    }
    setError(null);
  };

  return (
    <>
      <SetupModal isOpen={isSetupModalOpen} onComplete={handleSetupComplete} />

      <div className="h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Chat History Sidebar */}
        <ChatHistory
          sessions={chatSessions}
          currentSessionId={currentSession?.id || null}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          isOpen={isHistoryOpen}
          onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        />

        {/* Main Chat Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isHistoryOpen ? "lg:ml-80" : ""
          }`}
        >
          {/* Header */}
          <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 sm:px-6 py-3 sm:py-4 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Menu Button */}
                {!isHistoryOpen && (
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden touch-manipulation"
                  >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}

                {/* Logo & Title */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Anvex.AI
                    </h1>
                    {setupData && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Welcome, {setupData.schoolName}!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Mobile Settings Button */}
                <button
                  onClick={() => setIsSetupModalOpen(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors sm:hidden touch-manipulation"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Theme Switcher */}
                <div className="hidden sm:block">
                  <ThemeSwitcher />
                </div>
                <div className="sm:hidden">
                  <MobileThemeSwitcher />
                </div>

                {/* Clear Chat Button - Desktop Only */}
                {currentSession?.messages && currentSession.messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="hidden sm:block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    Clear Chat
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* API Key Warning */}
          {!isApiKeyValid && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 sm:px-6 py-3 sm:py-4 transition-colors duration-300">
              <div className="flex items-start sm:items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    API Key Required
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Please add your Google AI Studio API key to the{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">.env</code> file.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <ErrorBanner error={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {(!currentSession?.messages || currentSession.messages.length === 0) && !setupData ? (
              <div className="h-full flex items-center justify-center p-4">
                <p className="text-gray-500 dark:text-gray-400">
                  Please complete the setup to begin.
                </p>
              </div>
            ) : !currentSession?.messages || currentSession.messages.length === 0 ? (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-blue-800 dark:text-blue-200" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Namaste, {setupData?.schoolName || "friend"}! I'm Anvex.AI
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    I'm ready to help you with your studies for Class{" "}
                    {setupData?.selectedClass || ""}. Ask me anything!
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentSession.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-white dark:bg-dark-card">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Anvex.AI
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Thinking...
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card transition-colors duration-300">
            <ChatInput
              onSendMessage={handleSendMessage}
              onSendMessageWithImages={handleSendMessageWithImages}
              onSendMessageWithDocuments={handleSendMessageWithDocuments}
              isLoading={isLoading}
              disabled={!isApiKeyValid || !setupData}
            />
            {/* Mobile Clear Chat */}
            {currentSession?.messages && currentSession.messages.length > 0 && (
              <div className="sm:hidden px-4 pb-safe-bottom">
                <button
                  onClick={clearChat}
                  className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Clear Chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile overlay when history is open */}
        {isHistoryOpen && (
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30 lg:hidden animate-fade-in"
            onClick={() => setIsHistoryOpen(false)}
          />
        )}
      </div>
    </>
  );
};
