/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Cpu, 
  Layers, 
  Clock, 
  Compass, 
  ArrowUpRight, 
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { DeviceConfig } from '../types';

interface DashboardViewProps {
  config: DeviceConfig;
  onNavigate: (route: string) => void;
  openaiCount?: number;
}

export default function DashboardView({ config, onNavigate }: DashboardViewProps) {
  const isDark = config.theme === 'dark';

  // Metrics Data
  const metrics = [
    { title: 'AI Completion Speed', value: '1.24s', change: '-18%', trend: 'good', icon: Clock, color: 'text-emerald-500' },
    { title: 'Total Tokens Consumed', value: '142,884', change: '85% active limit', trend: 'warning', icon: Cpu, color: 'text-indigo-500' },
    { title: 'Saved Conversations', value: '29 logs', change: '+3 today', trend: 'good', icon: Layers, color: 'text-amber-500' },
  ];

  const recentChats = [
    { id: '1', title: 'OAuth Expo Security Integration', time: '12m ago', activeModel: 'Gemini 3.5' },
    { id: '2', title: 'React Native Micro-interaction', time: '2h ago', activeModel: 'Claude 3.1' },
    { id: '3', title: 'Perplexity Search Grounding Web', time: '1d ago', activeModel: 'Perplexity AI' },
  ];

  return (
    <div className={`flex-1 overflow-y-auto px-4 py-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Wave Greeting */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xl">✨</span>
          <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            Enterprise Workspace Active
          </span>
        </div>
        <h1 className="text-2xl font-bold font-display tracking-tight mt-1">
          Welcome back, Developer
        </h1>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Aura AI Mobile client compiled with native container profiles.
        </p>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
        {metrics.map((m, index) => {
          const Icon = m.icon;
          return (
            <div 
              key={index} 
              className={`p-4 rounded-2xl border ${
                isDark 
                  ? 'bg-zinc-900/50 border-zinc-800' 
                  : 'bg-white border-zinc-200'
              } transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{m.title}</span>
                <span className={`p-1.5 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-gray-100'} ${m.color}`}>
                  <Icon size={14} />
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-xl font-bold font-display">{m.value}</span>
              </div>
              <div className="mt-1 flex items-center space-x-1">
                <span className="text-[10px] text-gray-400 font-mono">Status:</span>
                <span className={`text-[10px] font-medium ${
                  m.trend === 'good' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {m.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Core Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Animated Usage Graph Widget */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={14} className="text-indigo-500" />
              Usage Telemetry & Allocation
            </h3>
            <span className="text-[10px] font-mono text-gray-500">Live 7 Days</span>
          </div>

          {/* Simple custom vector graph */}
          <div className="h-32 w-full mt-3 flex items-end justify-between relative">
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <path 
                d="M 0 110 Q 50 60 100 80 T 200 30 T 300 10 T 400 60 T 500 40 L 500 120 L 0 120 Z" 
                fill="url(#gradient-chart)" 
                opacity="0.15"
              />
              <path 
                d="M 0 110 Q 50 60 100 80 T 200 30 T 300 10 T 400 60 T 500 40" 
                fill="none" 
                stroke={isDark ? '#6366f1' : '#4f46e5'} 
                strokeWidth="2.5"
              />
              <defs>
                <linearGradient id="gradient-chart" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Simulated tooltips */}
            <div className="absolute top-[20px] left-[55%] -translate-x-1/2 flex flex-col items-center">
              <div className="bg-indigo-600 text-white text-[8px] px-1 rounded font-mono font-medium -mb-1">
                Peak
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 border border-white" />
            </div>

            {/* Custom high-performance label axes */}
            <div className={`text-[9px] font-mono absolute left-2 bottom-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
              Mon
            </div>
            <div className="text-[9px] font-mono absolute right-2 bottom-2 text-gray-400">
              Sun
            </div>
          </div>
        </div>

        {/* Recent Operations */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <h3 className="text-xs font-bold font-display uppercase tracking-wider mb-3">
            Recent Conversations
          </h3>
          <div className="space-y-2">
            {recentChats.map((c) => (
              <button 
                key={c.id}
                onClick={() => onNavigate('chat')}
                className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all group ${
                  isDark 
                    ? 'border-zinc-800 hover:bg-zinc-800/40 bg-zinc-950/20' 
                    : 'border-zinc-200 hover:bg-gray-50 bg-gray-50/20'
                }`}
              >
                <div>
                  <div className="text-[11px] font-medium font-display truncate max-w-[150px]">{c.title}</div>
                  <div className="text-[9px] text-gray-500 flex items-center space-x-1.5 mt-0.5">
                    <span>{c.time}</span>
                    <span>•</span>
                    <span className="text-indigo-400 font-mono">{c.activeModel}</span>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <ArrowUpRight size={14} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Core Quick Launcher Shortcuts */}
      <div className={`p-4 rounded-2xl border mt-4 ${
        isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <h3 className="text-xs font-bold font-display uppercase tracking-wider mb-3">
          Launch Smart Assistants
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => onNavigate('image-gen')}
            className={`p-3 rounded-xl text-left border flex items-start justify-between transition-all hover:scale-[1.01] ${
              isDark ? 'bg-zinc-950/40 border-zinc-800 hover:bg-zinc-950/80' : 'bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50/80'
            }`}
          >
            <div>
              <div className="text-[11px] font-semibold flex items-center gap-1 text-indigo-500">
                <Sparkles size={12} fill="currentColor" /> Image Studio
              </div>
              <p className="text-[9px] text-gray-500 mt-1 leading-snug">Generate visuals natively via Imagen</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('voice')}
            className={`p-3 rounded-xl text-left border flex items-start justify-between transition-all hover:scale-[1.01] ${
              isDark ? 'bg-zinc-950/40 border-zinc-800 hover:bg-zinc-950/80' : 'bg-pink-50/40 border-pink-100 hover:bg-pink-50/80'
            }`}
          >
            <div>
              <div className="text-[11px] font-semibold flex items-center gap-1 text-pink-500">
                <Compass size={12} /> Voice Deck
              </div>
              <p className="text-[9px] text-gray-500 mt-1 leading-snug">Command Aura with Speech API controls</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
