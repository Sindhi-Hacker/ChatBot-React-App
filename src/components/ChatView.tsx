/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  Flame, 
  CheckCircle, 
  Copy, 
  Share2, 
  Search, 
  Plus, 
  Smile, 
  Code,
  Globe,
  CornerDownRight,
  Pin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, ChatSession, DeviceConfig, AIModel } from '../types';

interface ChatViewProps {
  config: DeviceConfig;
  selectedModel: AIModel;
  sessions: ChatSession[];
  activeSessionId: string;
  onSend: (text: string, imageAttachment?: string) => Promise<void>;
  onAddSession: () => void;
  onSelectSession: (id: string) => void;
  onTogglePinSession: (id: string) => void;
  isGenerating: boolean;
}

export default function ChatView({
  config,
  selectedModel,
  sessions,
  activeSessionId,
  onSend,
  onAddSession,
  onSelectSession,
  onTogglePinSession,
  isGenerating
}: ChatViewProps) {
  const isDark = config.theme === 'dark';
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reactionsOpenId, setReactionsOpenId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [imagePayload, setImagePayload] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isGenerating]);

  // Handle message sending
  const handleSendPrompt = () => {
    if (!inputText.trim() && !imagePayload) return;
    onSend(inputText, imagePayload || undefined);
    setInputText('');
    setImagePayload(null);
  };

  // Convert image file upload to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Standard demo environment only supports image payloads currently.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePayload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulating mobile web Speech Recording
  const triggerVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser version. Simulating mic input instead.');
      setInputText('Simulated audio dictation: Outline standard React Native state synchronization.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = config.language === 'es' ? 'es-ES' : 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setInputText(prev => prev + ' ' + speechToText);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Live TTS Trigger
  const triggerTTSPlayback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const sentence = new SpeechSynthesisUtterance(text.replace(/[*#`]/g, ''));
      sentence.pitch = 1.0;
      sentence.rate = 1.0;
      window.speechSynthesis.speak(sentence);
    }
  };

  // Message Copy functionality
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Localized string support helper
  const t = (key: string) => {
    const translations: any = {
      en: { placeholder: 'Type to chat...', askAura: 'Ask Aura AI Anything...' },
      es: { placeholder: 'Escriba un mensaje...', askAura: 'Pregúntale a Aura AI...' },
      de: { placeholder: 'Schreibe eine Nachricht...', askAura: 'Frage Aura AI...' },
      ja: { placeholder: '型をチャットする...', askAura: 'オーラAIに質問する...' }
    };
    return translations[config.language]?.[key] || translations.en[key];
  };

  // Text Formatter with code highlighting fallback
  const renderFormattedText = (messageId: string, text: string) => {
    if (!text) return null;

    // Detect code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code body
        const codeLines = part.slice(3, -3).trim().split('\n');
        const lang = codeLines[0].match(/^[a-zA-Z0-9]+$/) ? codeLines[0] : 'code';
        const codeContent = lang !== 'code' ? codeLines.slice(1).join('\n') : codeLines.join('\n');

        return (
          <div key={index} className="my-2.5 rounded-xl overflow-hidden border border-zinc-800 font-mono text-xs text-left">
            <div className="bg-zinc-950 px-3 py-1.5 flex justify-between items-center text-[10px] text-gray-400 border-b border-zinc-800">
              <span className="flex items-center gap-1.5 font-sans font-medium uppercase tracking-wider text-[9px]">
                <Code size={12} className="text-indigo-400" /> {lang}
              </span>
              <button 
                onClick={() => handleCopyMessage(codeContent)}
                className="hover:text-indigo-400 transition-colors flex items-center gap-1 text-[9px] cursor-pointer"
              >
                <Copy size={10} /> Copy
              </button>
            </div>
            <pre className="p-3 bg-zinc-900/40 overflow-x-auto text-gray-300 leading-relaxed max-w-full">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Format simple markdown links and items inline
      const lines = part.split('\n');
      return (
        <p key={index} className="whitespace-pre-wrap leading-relaxed text-xs">
          {lines.map((line, lIdx) => {
            let processedLine: any = line;
            // Headers
            if (line.startsWith('### ')) {
              return <h4 key={lIdx} className="text-sm font-semibold mt-3 mb-1 text-indigo-400 font-display">{line.slice(4)}</h4>;
            } else if (line.startsWith('## ')) {
              return <h3 key={lIdx} className="text-base font-bold mt-4 mb-2 text-indigo-400 font-display">{line.slice(3)}</h3>;
            } else if (line.startsWith('* ') || line.startsWith('- ')) {
              return (
                <span key={lIdx} className="flex items-start gap-1.5 ml-2 mt-1">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>{line.slice(2)}</span>
                </span>
              );
            }
            return <span key={lIdx}>{processedLine}<br/></span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full relative">
      {/* Search overlay & Chat Title bar */}
      <div className={`px-4 py-2 border-b flex items-center justify-between gap-3 ${
        isDark ? 'border-zinc-800 bg-zinc-950/20' : 'border-zinc-100 bg-gray-50/20'
      }`}>
        <div className="flex-1 truncate">
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full ${
              selectedModel.premium ? 'bg-indigo-950 text-indigo-300 border border-indigo-900' : 'bg-gray-800 text-gray-300'
            }`}>
              {selectedModel.provider}
            </span>
          </div>
          <h2 className="text-xs font-bold font-display truncate mt-0.5">
            {activeSession?.title || 'Blank Conversation'}
          </h2>
        </div>

        {/* Action icons bar */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onAddSession}
            className={`p-1.5 rounded-lg hover:bg-zinc-800/30 text-gray-400 transition-colors cursor-pointer`}
            title="New Chat Session"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Deck */}
      <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${
        isDark ? 'bg-gradient-to-b from-zinc-950/20 to-zinc-900/10' : 'bg-gradient-to-b from-gray-50/20 to-zinc-100/10'
      }`}>
        {activeSession?.messages?.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-80 mt-12">
            <span className="text-3xl mb-3 animate-pulse">🌌</span>
            <h3 className="text-sm font-semibold font-display">{t('askAura')}</h3>
            <p className="text-[10px] text-gray-500 mt-1 max-w-xs px-4">
              Equipped with robust LLM backends including Gemini. Output files will sync to your secure cache.
            </p>
          </div>
        ) : (
          activeSession?.messages?.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Message Bubble */}
                  <div className={`p-3 rounded-2xl border text-left shadow-sm ${
                    isUser 
                      ? isDark 
                        ? 'bg-indigo-600/95 border-indigo-500 text-white rounded-tr-none' 
                        : 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none'
                      : isDark
                        ? 'bg-zinc-900/80 border-zinc-800 text-gray-100 rounded-tl-none'
                        : 'bg-white border-zinc-200 text-gray-900 rounded-tl-none'
                  }`}>
                    {/* Render attachment preview inside bubble if any */}
                    {msg.imagePreview && (
                      <div className="mb-2 rounded-lg overflow-hidden max-h-32 bg-zinc-950">
                        <img src={msg.imagePreview} alt="Image upload payload" className="w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    {/* Main content formatting */}
                    <div className="text-xs break-words">
                      {renderFormattedText(msg.id, msg.content)}
                    </div>

                    {/* Citations/Grounding outputs */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3.5 pt-2 border-t border-zinc-800 text-[10px] text-gray-400">
                        <div className="flex items-center gap-1 font-semibold mb-1 uppercase tracking-wider text-[8px] text-indigo-400">
                          <Globe size={10} /> Grounded references
                        </div>
                        <ul className="space-y-1">
                          {msg.citations.map((cit, cIdx) => (
                            <li key={cIdx} className="truncate">
                              <a href={cit.uri} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors underline flex items-center gap-1 truncate">
                                <CornerDownRight size={10} /> {cit.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub action nodes list */}
                <div className="flex items-center gap-3.5 mt-1.5 px-1.5 text-[10px] text-gray-400">
                  <span className="font-mono text-[9px]">{msg.timestamp.slice(11, 16)}</span>
                  {!isUser && (
                    <>
                      <button 
                        onClick={() => triggerTTSPlayback(msg.content)} 
                        className="hover:text-indigo-400 transition-colors cursor-pointer" 
                        title="Speak response"
                      >
                        Listen
                      </button>
                      <span>•</span>
                      <button 
                        onClick={() => handleCopyMessage(msg.content)} 
                        className="hover:text-indigo-400 transition-colors flex items-center gap-0.5 cursor-pointer"
                      >
                        Copy
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Generating skeleton loader state */}
        {isGenerating && (
          <div className="flex flex-col items-start">
            <div className={`p-4 rounded-2xl border bg-zinc-900/40 border-zinc-800 text-gray-400 rounded-tl-none max-w-[85%]`}>
              <div className="flex items-center space-x-1.5 text-xs text-gray-500 font-mono">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <span className="pl-1 uppercase tracking-widest text-[8px] italic text-indigo-400">synthesizing output...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Upload payload drawer indicator */}
      {imagePayload && (
        <div className={`px-4 py-1.5 border-t flex items-center justify-between ${
          isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500">Attachment:</span>
            <div className="w-10 h-10 rounded border border-indigo-500 overflow-hidden">
              <img src={imagePayload} alt="Media thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
          <button 
            onClick={() => setImagePayload(null)} 
            className="text-[10px] text-red-400 hover:underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input controls bar */}
      <div className={`p-3 border-t bg-zinc-950/20 ${
        isDark ? 'border-zinc-800' : 'border-zinc-100'
      }`}>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-300'
        } focus-within:ring-1 focus-within:ring-indigo-500 transition-all`}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
            title="Attach image file"
          >
            <Paperclip size={14} />
          </button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />

          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder={t('placeholder')}
            className={`flex-1 text-xs border-none outline-none focus:ring-0 ${
              isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
            }`}
          />

          <button
            onClick={triggerVoiceRecognition}
            className={`transition-colors cursor-pointer ${
              isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-pink-400'
            }`}
            title="Speech recognition dictation"
          >
            <Mic size={14} />
          </button>

          <button
            onClick={handleSendPrompt}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              inputText.trim() || imagePayload
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-gray-500 cursor-not-allowed'
            }`}
            disabled={!inputText.trim() && !imagePayload}
          >
            <Send size={12} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
