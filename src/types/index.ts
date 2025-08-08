export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: string[]; // base64 encoded images
  documents?: {
    name: string;
    mimeType: string;
    data: string; // base64 encoded data
  }[];
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Model {
  id: string;
  name: string;
  description: string;
}

export interface ChatRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string | Array<{
      type: 'text' | 'image_url' | 'document';
      text?: string;
      image_url?: {
        url: string;
      };
      document?: {
        name: string;
        mimeType: string;
        data: string;
      };
    }>;
  }>;
  temperature?: number;
  max_tokens?: number;
}