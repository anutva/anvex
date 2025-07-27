import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, AlertTriangle, Menu, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Keep for the back button
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ErrorBanner } from "./ErrorBanner";
import { ChatHistory } from "./ChatHistory";
import { OpenRouterAPI } from "../utils/openrouter";
import { ChatHistoryManager } from "../utils/chatHistory";
import { ANUSARTH_SYSTEM_PROMPT } from "../utils/systemPrompt";
import { Message, ChatSession } from "../types";
import SetupModal from "./SetupModal"; // --- IMPORT THE SETUP MODAL ---

// Define the shape of the data from the setup form
interface SetupData {
  schoolName: string;
  selectedClass: string;
  selectedSection: string;
  selectedSchool: string;
}

export const ChatInterface: React.FC = () => {
  // Back button logic - REMAINS UNCHANGED
  const navigate = useNavigate();
  const location = useLocation();
  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/");
    }
  };

  // --- NEW STATE FOR SETUP AND MODAL ---
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Existing chat state
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedModel] = useState("google/gemma-3-27b-it:free");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey] = useState(import.meta.env.VITE_OPENROUTER_API_KEY || "");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- CHECK FOR SETUP DATA ON INITIAL LOAD ---
  useEffect(() => {
    const savedSetupData = localStorage.getItem("anusarSetup");
    if (savedSetupData) {
      setSetupData(JSON.parse(savedSetupData));
      setIsSetupModalOpen(false); // User is known, don't open modal
    } else {
      setIsSetupModalOpen(true); // User is unknown, open modal
    }
  }, []);

  // --- NEW HANDLER FOR WHEN MODAL COMPLETES ---
  const handleSetupComplete = (data: SetupData) => {
    setSetupData(data); // Store the data in our state
    setIsSetupModalOpen(false); // Close the modal
  };

  // --- MODIFIED SEND MESSAGE FUNCTION ---
  const sendMessage = async (content: string, images: string[] = []) => {
    if (!isApiKeyValid) {
      setError("Please configure your OpenRouter API key in the .env file");
      return;
    }
    // ... (rest of the validation logic)

    // --- PERSONALIZE THE SYSTEM PROMPT ---
    let personalizedSystemPrompt = ANUSARTH_SYSTEM_PROMPT;
    if (setupData) {
      personalizedSystemPrompt =
        `The user's name is ${setupData.schoolName}. ` +
        `They are in Class ${setupData.selectedClass}, Section ${setupData.selectedSection} ` +
        `at ${setupData.selectedSchool}. Please use this information to provide ` +
        `contextual and personalized help. For example, you can refer to common ` +
        `curriculums for that class. Always be friendly and refer to them by name if appropriate.\n\n` +
        `--- Original Prompt Begins ---\n` +
        ANUSARTH_SYSTEM_PROMPT;
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
      const api = new OpenRouterAPI(apiKey);
      const systemMessage = {
        role: "system" as const,
        content: personalizedSystemPrompt,
      }; // Use the new prompt
      // ... (rest of the API call logic)
      const chatMessages = [
        systemMessage,
        ...updatedSession.messages.map((msg) => ({
          role: msg.role,
          content:
            msg.images && msg.images.length > 0
              ? [
                  { type: "text" as const, text: msg.content },
                  ...msg.images.map((image) => ({
                    type: "image_url" as const,
                    image_url: { url: image },
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

  // --- ALL OTHER FUNCTIONS REMAIN THE SAME ---
  // (handleSendMessage, handleSendMessageWithImages, clearChat, etc.)
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
  const isApiKeyValid = OpenRouterAPI.validateApiKey(apiKey);
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
    // We use a React fragment <> to hold both the modal and the main div
    <>
      {/* --- RENDER THE MODAL CONDITIONALLY --- */}
      <SetupModal isOpen={isSetupModalOpen} onComplete={handleSetupComplete} />

      {/* Your original chat interface JSX */}
      <div className="h-screen flex bg-gray-50">
        <ChatHistory
          sessions={chatSessions}
          currentSessionId={currentSession?.id || null}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          isOpen={isHistoryOpen}
          onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isHistoryOpen ? "lg:ml-80" : ""
          }`}
        >
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* The Back Button - UNCHANGED */}
                <button
                  onClick={handleGoBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                {!isHistoryOpen && (
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                  >
                    <Menu className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  {/* --- PERSONALIZED HEADER --- */}
                  <h1 className="text-xl font-semibold text-gray-900">
                    Anusarth.AI
                  </h1>
                  {setupData && (
                    <p className="text-sm text-gray-500">
                      Welcome, {setupData.schoolName}!
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {currentSession?.messages &&
                  currentSession.messages.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Clear Chat
                    </button>
                  )}
              </div>
            </div>
          </header>
          {!isApiKeyValid && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-600">
                    API Key Required
                  </p>
                  <p className="text-sm text-gray-600">
                    Please add your OpenRouter API key to the{" "}
                    <code className="bg-gray-100 px-1 rounded">.env</code> file.
                    Set{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      VITE_OPENROUTER_API_KEY=your_key_here
                    </code>
                  </p>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="px-6 py-4">
              <ErrorBanner error={error} onDismiss={() => setError(null)} />
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {(!currentSession?.messages ||
              currentSession.messages.length === 0) &&
            !setupData ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">
                  Please complete the setup to begin.
                </p>
              </div>
            ) : !currentSession?.messages ||
              currentSession.messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-blue-800" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Namaste, {setupData?.schoolName || "friend"}! I'm
                    Anusarth.AI
                  </h2>
                  <p className="text-gray-500 max-w-md">
                    I'm ready to help you with your studies for Class{" "}
                    {setupData?.selectedClass || ""}. Ask me anything!
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {currentSession.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-4 p-6 bg-white">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          Anusarth.AI
                        </span>
                        <span className="text-xs text-gray-500">
                          Thinking...
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
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
          <ChatInput
            onSendMessage={handleSendMessage}
            onSendMessageWithImages={handleSendMessageWithImages}
            isLoading={isLoading}
            disabled={!isApiKeyValid || !setupData}
          />
        </div>
      </div>
    </>
  );
};
