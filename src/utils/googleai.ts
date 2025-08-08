import { ChatRequest } from '../types';

export class GoogleAIAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(request: ChatRequest): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google AI Studio API key is not configured');
    }

    try {
      // Convert messages to Google AI format
      const contents = request.messages.map(msg => {
        if (msg.role === 'system') {
          // Google AI doesn't have a system role, so we'll prepend it to the first user message
          return null;
        }
        
        const parts: any[] = [];
        
        if (typeof msg.content === 'string') {
          parts.push({ text: msg.content });
        } else if (Array.isArray(msg.content)) {
          msg.content.forEach(item => {
            if (item.type === 'text') {
              parts.push({ text: item.text });
            } else if (item.type === 'image_url' && item.image_url?.url) {
              const base64Match = item.image_url.url.match(/^data:image\/[a-z]+;base64,(.+)$/);
              if (base64Match) {
                parts.push({
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Match[1]
                  }
                });
              }
            } else if (item.type === 'document' && item.document) {
              parts.push({
                inlineData: {
                  mimeType: item.document.mimeType,
                  data: item.document.data
                }
              });
            }
          });
        }
        
        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts
        };
      }).filter(Boolean);

      // Prepend system message to first user message if exists
      const systemMessage = request.messages.find(msg => msg.role === 'system');
      if (systemMessage && contents.length > 0 && contents[0]) {
        const systemText = typeof systemMessage.content === 'string'
          ? systemMessage.content
          : systemMessage.content[0]?.text || '';
        
        if (contents[0].parts && contents[0].parts.length > 0 && contents[0].parts[0]) {
          contents[0].parts[0].text = `${systemText}\n\n${contents[0].parts[0].text}`;
        }
      }

      const model = request.model || 'gemini-2.0-flash-lite';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      
      const response = await fetch(`${apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: request.temperature || 0.7,
            maxOutputTokens: request.max_tokens || 12288,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const textParts = data.candidates[0].content.parts
          .filter((part: any) => part.text)
          .map((part: any) => part.text);
        return textParts.join('');
      }

      throw new Error('No response content received');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to communicate with Google AI Studio API');
    }
  }

  static validateApiKey(apiKey: string): boolean {
    return !!(apiKey && apiKey.length > 0 && apiKey !== 'your_google_ai_api_key_here');
  }

  static isVisionModel(modelId: string): boolean {
    const visionModels = [
      'gemini-2.0-flash-exp',
      'gemini-2.0-flash-lite',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-pro-vision'
    ];
    
    return visionModels.some(model => modelId.includes(model));
  }
}