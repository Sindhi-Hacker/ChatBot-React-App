/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, HelpCircle, Activity, RefreshCw } from 'lucide-react';
import { DeviceConfig } from '../types';

interface VoiceAssistantViewProps {
  config: DeviceConfig;
}

export default function VoiceAssistantView({ config }: VoiceAssistantViewProps) {
  const isDark = config.theme === 'dark';
  const [isActive, setIsActive] = useState(false);
  const [speechState, setSpeechState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [lastSpeechInput, setLastSpeechInput] = useState('');
  const [assistantReply, setAssistantReply] = useState('');

  // Clean-up synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const triggerVocalResponse = async (transcript: string) => {
    setSpeechState('thinking');
    try {
      // Direct call to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: transcript }],
          modelId: 'gemini-3.5-flash'
        })
      });
      const data = await response.json();
      const textToSpeak = data.content || "I didn't capture that. Could you please repeat?";
      
      setAssistantReply(textToSpeak);
      setSpeechState('speaking');

      // Speak back
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SynthesisUtteranceWrapper(textToSpeak);
        utterance.onend = () => setSpeechState('idle');
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback delay if no synthesis
        setTimeout(() => setSpeechState('idle'), 4000);
      }
    } catch (err) {
      console.error(err);
      setSpeechState('idle');
    }
  };

  class SynthesisUtteranceWrapper extends SpeechSynthesisUtterance {
    constructor(text: string) {
      super(text.replace(/[*#`]/g, ''));
      this.pitch = 1.05;
      this.rate = 0.95;
    }
  }

  const toggleVoiceSession = () => {
    if (speechState !== 'idle') {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setSpeechState('idle');
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      setLastSpeechInput("Mock query: Compile Expo APK bundles.");
      setSpeechState('thinking');
      setTimeout(() => {
        triggerVocalResponse("Compile Expo APK bundles.");
      }, 1000);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = config.language === 'es' ? 'es-ES' : 'en-US';

    recognition.onstart = () => {
      setSpeechState('listening');
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setLastSpeechInput(resultText);
      triggerVocalResponse(resultText);
    };

    recognition.onerror = () => {
      setSpeechState('idle');
    };

    recognition.onend = () => {
      // Only reset if not thinking/speaking
      if (speechState === 'listening') {
        setSpeechState('idle');
      }
    };

    recognition.start();
  };

  return (
    <div className={`flex-1 overflow-hidden p-4 flex flex-col items-center justify-between ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
      
      {/* Header Info */}
      <div className="text-center w-full mt-2">
        <span className={`text-[10px] font-mono tracking-widest uppercase bg-indigo-950/40 text-indigo-400 px-3 py-1 rounded-full border border-indigo-900/30`}>
          Aura Vocal Synth
        </span>
        <h2 className="text-lg font-bold font-display mt-2">Omni-Directional Voice Mode</h2>
        <p className="text-[10px] text-gray-500 max-w-xs mx-auto mt-1 leading-snug">
          Speak naturally. Standard WebSpeech and PCM listeners are running on native device container.
        </p>
      </div>

      {/* Futuristic Waveform Canvas Visual & Central Trigger */}
      <div className="w-full max-w-[280px] aspect-square flex flex-col items-center justify-center relative my-6">
        
        {/* Animated wave layers */}
        {(speechState === 'listening' || speechState === 'speaking') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-indigo-500/10 border border-indigo-500/20 animate-ping absolute duration-1000"></div>
            <div className="w-60 h-60 rounded-full bg-pink-500/5 border border-pink-500/10 animate-ping absolute duration-1500"></div>
          </div>
        )}

        {/* Central mic capsule */}
        <button
          onClick={toggleVoiceSession}
          className={`w-32 h-32 rounded-full border flex flex-col items-center justify-center z-10 transition-all shadow-glow hover:scale-[1.02] cursor-pointer ${
            speechState === 'listening'
              ? 'bg-red-600/90 border-red-500 text-white shadow-glow-active'
              : speechState === 'speaking'
                ? 'bg-pink-600/90 border-pink-500 text-white shadow-glow-active'
                : speechState === 'thinking'
                  ? 'bg-amber-600/95 border-amber-500 text-white animate-pulse'
                  : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500'
          }`}
        >
          {speechState === 'listening' ? (
            <Activity className="animate-pulse" size={32} />
          ) : speechState === 'thinking' ? (
            <RefreshCw className="animate-spin" size={32} />
          ) : (
            <Mic size={32} />
          )}
          <span className="text-[9px] font-mono uppercase font-bold tracking-widest mt-2">
            {speechState === 'idle' && 'Tap to speak'}
            {speechState === 'listening' && 'Listening...'}
            {speechState === 'thinking' && 'Thinking...'}
            {speechState === 'speaking' && 'Speaking...'}
          </span>
        </button>

        {/* Real-time styled voice frequency sine graph */}
        <div className="w-full absolute bottom-0 h-6 flex items-center justify-center gap-1 overflow-hidden opacity-85">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                speechState === 'listening' 
                  ? 'bg-red-500' 
                  : speechState === 'speaking' 
                    ? 'bg-pink-500' 
                    : 'bg-indigo-800'
              }`}
              style={{
                height: speechState === 'listening' 
                  ? `${Math.max(10, Math.sin(i * 0.8) * 24 + Math.random() * 8)}px`
                  : speechState === 'speaking'
                    ? `${Math.max(10, Math.cos(i * 0.5) * 22 + Math.random() * 10)}px`
                    : '4px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Terminal logs showing inputs and outputs */}
      <div className={`w-full p-3 rounded-2xl border text-left flex-1 max-h-[140px] overflow-y-auto mb-2 ${
        isDark ? 'bg-zinc-950/80 border-zinc-805 text-gray-300' : 'bg-gray-50 border-zinc-200 text-gray-800'
      }`}>
        <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-1.5 mb-1.5 text-[9px] font-mono uppercase tracking-widest text-indigo-400">
          <Volume2 size={12} /> Transcript Stream
        </div>
        {lastSpeechInput && (
          <div className="text-[11px] font-display flex gap-1">
            <span className="text-red-400 font-bold font-mono">You:</span>
            <span>"{lastSpeechInput}"</span>
          </div>
        )}
        {assistantReply && (
          <div className="text-[11px] font-display mt-1.5 flex gap-1">
            <span className="text-indigo-400 font-bold font-mono">Aura:</span>
            <span className="truncate max-w-[200px]">"{assistantReply}"</span>
          </div>
        )}
        {!lastSpeechInput && !assistantReply && (
          <div className="text-[10px] text-gray-500 italic text-center py-4">
            Voice output will print in real-time as speech is synthesized.
          </div>
        )}
      </div>

    </div>
  );
}
