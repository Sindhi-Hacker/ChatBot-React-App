/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, HelpCircle, X, Sparkles, AlertCircle, Info } from 'lucide-react';

import { DeviceConfig, ChatSession, UserSubscription, AIModel, ChatMessage } from './types';
import DeviceFrame from './components/DeviceFrame';
import DeveloperConsole from './components/DeveloperConsole';
import DashboardView from './components/DashboardView';
import ChatView from './components/ChatView';
import ImageGenView from './components/ImageGenView';
import VoiceAssistantView from './components/VoiceAssistantView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Global simulated Zustand state
  const [activeRoute, setActiveRoute] = useState<string>('chat');
  
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'models' | 'plans' | 'config' | 'help'>('profile');

  const [config, setConfig] = useState<DeviceConfig>({
    type: 'ios',
    theme: 'dark',
    language: 'en',
    networkStatus: 'wifi',
    pushEnabled: true,
    hapticFeedback: true
  });

  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    status: 'active',
    tokensUsed: 14200,
    tokenLimit: 500000
  });

  // Pre-configured list of enterprise chatbot model proxies
  const models: AIModel[] = [
    { id: 'gemini', name: 'Gemini 3.5 Flash', provider: 'Gemini', description: 'Google flagship ultra-fast multimodal reasoning engine optimized for responsive client workflows.', contextWindow: '1M', maxOutput: '8k', costEstimate: 'Highly Free', premium: false, badgeColor: 'bg-indigo-600' },
    { id: 'gpt4', name: 'GPT-4o Omniplex', provider: 'OpenAI', description: 'Advanced model for multi-source synthesizers and programmatic structural code output.', contextWindow: '128k', maxOutput: '4k', costEstimate: 'Standard Quota', premium: true, badgeColor: 'bg-emerald-600' },
    { id: 'claude', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'State-of-the-art analytical logic, math functions, and clean structural outputs.', contextWindow: '200k', maxOutput: '8k', costEstimate: 'Premium Quota', premium: true, badgeColor: 'bg-amber-600' },
    { id: 'perplexity', name: 'Perplexity Grounding', provider: 'Perplexity', description: 'Specialized search proxy with dynamic web grounding and source citations.', contextWindow: '32k', maxOutput: '4k', costEstimate: 'Standard Quota', premium: true, badgeColor: 'bg-cyan-600' }
  ];

  const [selectedModelId, setSelectedModelId] = useState<string>('gemini');
  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];

  // Simulated conversations database cache
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'session_1',
      title: 'OAuth Expo Security Integration',
      pinned: true,
      modelId: 'gemini',
      updatedAt: new Date().toISOString(),
      messages: [
        { id: '1', role: 'user', content: 'What is the best way to securely cache authorized biometric tokens natively in Expo?', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'sent' },
        { id: '2', role: 'assistant', content: 'The industry-standard approach for React Native Expo environments is to leverage **expo-secure-store**. It encrypts values securely keychain/Keystore-level:\n\n* **Android**: Encrypted with AES-GCM under key stored in Android Keystore.\n* **iOS**: Keys live in system Keychain with hardware secure enclave encryption.\n\nHere is what the wrapper module looks like:\n```typescript\nimport * as SecureStore from "expo-secure-store";\n\nexport async function saveSecret(key: string, secret: string) {\n  await SecureStore.setItemAsync(key, secret, {\n    keychainAccessible: SecureStore.WHEN_UNLOCKED,\n  });\n}\n```\nThis ensures high compliance across financial and medical enterprise portals!', timestamp: new Date(Date.now() - 3500000).toISOString() }
      ]
    },
    {
      id: 'session_2',
      title: 'React Native Micro-interaction',
      pinned: false,
      modelId: 'claude',
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      messages: [
        { id: '3', role: 'user', content: 'Provide standard layout animation logic for React Native drawer selectors.', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'sent' },
        { id: '4', role: 'assistant', content: 'You can combine standard `LayoutAnimation` or harness **react-native-reanimated** for seamless hardware GPU acceleration offsets. If utilizing standard Expo routes, the custom drawer component should use reanimated hooks to handle slide transitions gracefully.', timestamp: new Date(Date.now() - 7100000).toISOString() }
      ]
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('session_1');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Simulated live Toast Notification banners list
  const [pushLogs, setPushLogs] = useState<{ id: string; title: string; body: string; timestamp: string }[]>([]);

  // Synchronise global body CSS theme matching config value
  useEffect(() => {
    const root = document.documentElement;
    if (config.theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0a0a0c';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f4f4f5';
    }
  }, [config.theme]);

  // Handle Dispatching Notification Alert
  const handleDispatchNotification = (title: string, body: string) => {
    const newAlert = {
      id: "push_" + Math.random().toString(36).substring(2, 9),
      title,
      body,
      timestamp: new Date().toISOString()
    };
    setPushLogs(prev => [newAlert, ...prev]);

    // Native browser push toggle if haptic enabled
    if (config.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  // Close dynamic Push alert
  const handleRemovePush = (id: string) => {
    setPushLogs(prev => prev.filter(p => p.id !== id));
  };

  // Core Chat dispatch handler
  const handleSendPrompt = async (text: string, imageAttachment?: string) => {
    // 1. Append user message locally
    const userMsg: ChatMessage = {
      id: "msg_" + Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      status: 'sent',
      imagePreview: imageAttachment
    };

    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          updatedAt: new Date().toISOString(),
          messages: [...session.messages, userMsg]
        };
      }
      return session;
    }));

    // Generate local token usage metrics
    setSubscription(prev => ({
      ...prev,
      tokensUsed: Math.min(prev.tokenLimit, prev.tokensUsed + Math.floor(Math.random() * 2500 + 400))
    }));

    // Check offline status
    if (config.networkStatus === 'offline') {
      const offlineMsg: ChatMessage = {
        id: "msg_" + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: "⚠️ **Offline Error**: Dynamic synchronization failed. Please toggle your Network Status back to 'wifi' or 'cellular' inside the Developer Console deck to restore the pipeline connection.",
        timestamp: new Date().toISOString(),
        status: 'error'
      };
      setTimeout(() => {
        setSessions(prev => prev.map(session => {
          if (session.id === activeSessionId) {
            return { ...session, messages: [...session.messages, offlineMsg] };
          }
          return session;
        }));
      }, 500);
      return;
    }

    // 2. Query sever-side Gemini endpoint
    setIsGenerating(true);
    try {
      const activeSession = sessions.find(s => s.id === activeSessionId);
      const hist = activeSession ? activeSession.messages : [];
      // Pass standard conversation context
      const chatHistoryAndInput = [...hist, userMsg];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistoryAndInput,
          modelId: selectedModelId,
          useSearch: selectedModelId === 'perplexity',
          imageAttachment
        })
      });

      const reply = await response.json();
      
      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          const aiMsg: ChatMessage = {
            id: reply.id,
            role: 'assistant',
            content: reply.content,
            timestamp: reply.timestamp,
            citations: reply.citations
          };
          return {
            ...session,
            title: session.messages.length <= 2 
              ? (text.slice(0, 30) + (text.length > 30 ? '...' : '')) 
              : session.title,
            messages: [...session.messages, aiMsg]
          };
        }
        return session;
      }));

    } catch (error) {
      console.error("Failed to query API chatbot:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add Session
  const handleAddSession = () => {
    const newId = "session_" + Math.random().toString(36).substring(2, 9);
    const newSession: ChatSession = {
      id: newId,
      title: "Synthesizer Log #" + (sessions.length + 1),
      pinned: false,
      modelId: selectedModelId,
      updatedAt: new Date().toISOString(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setActiveRoute('chat');
  };

  // Toggle Pin session
  const handleTogglePinSession = (id: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, pinned: !s.pinned };
      }
      return s;
    }));
  };

  // Clear offline cache
  const handleClearCache = () => {
    setSessions([
      {
        id: 'session_init',
        title: 'Initial Logs Clear',
        pinned: false,
        modelId: 'gemini',
        updatedAt: new Date().toISOString(),
        messages: []
      }
    ]);
    setActiveSessionId('session_init');
    setSubscription(prev => ({ ...prev, tokensUsed: 0 }));
    alert('Local system SQLite cache database logs initialized.');
  };

  return (
    <div className={`w-full h-full flex flex-col md:flex-row shadow-inner transition-colors duration-300 ${
      config.theme === 'dark' 
        ? 'bg-zinc-950 text-gray-150' 
        : 'bg-zinc-50 text-gray-800'
    }`}>
      
      {/* LEFT AREA: INTERACTIVE DEVICE EMULATOR (iPhone/Android Screen) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative min-h-0 bg-transparent overflow-hidden">
        
        {/* Real-time Push Notification banner animations on screen */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-[310px] z-50 pointer-events-none space-y-1.5 px-4">
          <AnimatePresence>
            {pushLogs.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: -45, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="pointer-events-auto w-full p-2.5 rounded-xl border flex items-start gap-2 shadow-lg glass-effect-light dark:glass-effect border-indigo-500/30 text-left bg-zinc-900/95 dark:bg-zinc-950/95"
              >
                <div className="p-1 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
                  <Bell size={12} className="animate-swing" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[10px] font-bold text-indigo-400 font-display truncate">{p.title}</h5>
                  <p className="text-[9px] text-gray-300 line-clamp-2 leading-relaxed mt-0.5">{p.body}</p>
                </div>
                <button
                  onClick={() => handleRemovePush(p.id)}
                  className="text-gray-500 hover:text-white shrink-0 cursor-pointer self-center"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Outer simulated device frame */}
        <DeviceFrame
          config={config}
          subscription={subscription}
          sessions={sessions}
          activeSessionId={activeSessionId}
          selectedModel={selectedModel}
          activeRoute={activeRoute}
          onNavigate={setActiveRoute}
          onSelectSession={setActiveSessionId}
          onAddSession={handleAddSession}
          onTogglePinSession={handleTogglePinSession}
        >
          {/* Dynamically render nested routing screens inside the smartphone chassis */}
          {activeRoute === 'dashboard' && (
            <DashboardView 
              config={config} 
              onNavigate={setActiveRoute} 
            />
          )}

          {activeRoute === 'chat' && (
            <ChatView
              config={config}
              selectedModel={selectedModel}
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSend={handleSendPrompt}
              onAddSession={handleAddSession}
              onSelectSession={setActiveSessionId}
              onTogglePinSession={handleTogglePinSession}
              isGenerating={isGenerating}
            />
          )}

          {activeRoute === 'image-gen' && (
            <ImageGenView 
              config={config} 
            />
          )}

          {activeRoute === 'voice' && (
            <VoiceAssistantView 
              config={config} 
            />
          )}

          {activeRoute === 'settings' && (
            <SettingsView
              config={config}
              models={models}
              selectedModelId={selectedModelId}
              subscription={subscription}
              onSelectModel={setSelectedModelId}
              onUpdateConfig={(upd) => setConfig(prev => ({ ...prev, ...upd }))}
              onUpdateSubscription={(p) => setSubscription(prev => ({ ...prev, plan: p }))}
              onClearCache={handleClearCache}
              activeSettingsTab={activeSettingsTab}
              onSetSettingsTab={setActiveSettingsTab}
            />
          )}
        </DeviceFrame>
      </div>

      {/* RIGHT AREA: DEVELOPER CONTROL PANEL COCKPIT */}
      <DeveloperConsole
        config={config}
        subscription={subscription}
        sessions={sessions}
        activeRoute={activeRoute}
        onUpdateConfig={(upd) => setConfig(prev => ({ ...prev, ...upd }))}
        onDispatchNotification={handleDispatchNotification}
      />

    </div>
  );
}
