/**
 * Chat Service - Handles StyleChat API calls
 */

import { apiClient } from './client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  response: string;
}

export const chatService = {
  /**
   * Send a message to the chat API
   */
  async sendMessage(message: string, history: ChatMessage[]): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>('/chat/send', {
      message,
      history,
    });
  },
};
