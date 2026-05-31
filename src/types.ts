/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MessageReaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  avatarUrl?: string;
  status?: 'sending' | 'sent' | 'error';
  imagePreview?: string; // Base64 or URI if image generated/attached
  reactions?: MessageReaction[];
  citations?: { uri: string; title: string }[];
  audioUrl?: string; // Text-to-speech audio bytes URI if generated
}

export interface ChatSession {
  id: string;
  title: string;
  pinned: boolean;
  modelId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'Gemini' | 'OpenAI' | 'Anthropic' | 'Perplexity';
  description: string;
  contextWindow: string;
  maxOutput: string;
  costEstimate: string;
  premium: boolean;
  badgeColor: string;
}

export interface UserSubscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'none';
  renewsAt?: string;
  tokensUsed: number;
  tokenLimit: number;
}

export interface NotificationLog {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  category: 'system' | 'ai' | 'security' | 'billing';
}

export interface DeviceConfig {
  type: 'ios' | 'android' | 'tablet' | 'desktop-web';
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'de' | 'ja';
  networkStatus: 'wifi' | 'cellular' | 'offline';
  pushEnabled: boolean;
  hapticFeedback: boolean;
}
