import { ChatProvider } from './chatbot-config.model';

export interface ChatAuditConversationSummary {
  conversationId: number;
  provider: ChatProvider;
  model: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatAuditConversationListResponse {
  items: ChatAuditConversationSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ChatAuditUser {
  id: number;
  email: string;
  fullName: string;
}

export interface ChatAuditMessage {
  role: 'user' | 'assistant' | string;
  content: string;
  inDomain: boolean | null;
  createdAt: string;
}

export interface ChatAuditConversationDetail {
  conversationId: number;
  user: ChatAuditUser;
  provider: ChatProvider;
  model: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatAuditMessage[];
}
