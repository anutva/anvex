import { ChatSession, Message } from '../types';

const STORAGE_KEY = 'anvex_chat_history';

export class ChatHistoryManager {
  static saveChatSession(session: ChatSession): void {
    try {
      const sessions = this.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.unshift(session);
      }
      
      // Keep only the last 50 sessions
      const limitedSessions = sessions.slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedSessions));
    } catch (error) {
      console.error('Failed to save chat session:', error);
    }
  }

  static getAllSessions(): ChatSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      return sessions.map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
      return [];
    }
  }

  static deleteSession(sessionId: string): void {
    try {
      const sessions = this.getAllSessions();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Failed to delete chat session:', error);
    }
  }

  static generateSessionTitle(firstMessage: string): string {
    const words = firstMessage.split(' ').slice(0, 6);
    let title = words.join(' ');
    if (firstMessage.split(' ').length > 6) {
      title += '...';
    }
    return title || 'New Chat';
  }

  static createNewSession(model: string): ChatSession {
    return {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      model,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}