import { ChatRequest } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export class OpenRouterAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(request: ChatRequest): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'OpenRouter Chat App',
        },
        body: JSON.stringify({
          ...request,
          stream: true,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.choices?.[0]?.delta?.content) {
                  fullResponse += parsed.choices[0].delta.content;
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to communicate with OpenRouter API');
    }
  }

  static validateApiKey(apiKey: string): boolean {
    return apiKey && apiKey.length > 0 && apiKey !== 'your_openrouter_api_key_here';
  }

  static isVisionModel(modelId: string): boolean {
    const visionModels = [
      'openai/gpt-4-vision-preview',
      'openai/gpt-4o',
      'openai/gpt-4o-mini',
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-haiku',
      'anthropic/claude-3-5-sonnet',
      'google/gemini-pro-vision',
      'google/gemini-1.5-pro',
      'google/gemini-1.5-flash',
      'google/gemma-3-27b-it:free'
    ];
    
    return visionModels.some(model => modelId.includes(model.split('/')[1]));
  }
}