/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  CreditCard, 
  Check, 
  Cpu, 
  Languages, 
  Bell, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle,
  Database,
  CloudLightning,
  Sparkles
} from 'lucide-react';
import { DeviceConfig, AIModel, UserSubscription } from '../types';

interface SettingsViewProps {
  config: DeviceConfig;
  models: AIModel[];
  selectedModelId: string;
  subscription: UserSubscription;
  onSelectModel: (id: string) => void;
  onUpdateConfig: (updated: Partial<DeviceConfig>) => void;
  onUpdateSubscription: (plan: 'free' | 'pro' | 'enterprise') => void;
  onClearCache: () => void;
  activeSettingsTab: 'profile' | 'models' | 'plans' | 'config' | 'help';
  onSetSettingsTab: (tab: 'profile' | 'models' | 'plans' | 'config' | 'help') => void;
}

export default function SettingsView({
  config,
  models,
  selectedModelId,
  subscription,
  onSelectModel,
  onUpdateConfig,
  onUpdateSubscription,
  onClearCache,
  activeSettingsTab,
  onSetSettingsTab
}: SettingsViewProps) {
  const isDark = config.theme === 'dark';
  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];

  const plans = [
    { id: 'free', name: 'Lite', price: '$0', limit: '10k tokens/mo', features: ['Gemini 3.5 access', '10 free visual prompts', 'Default delay queue'], color: 'border-zinc-800' },
    { id: 'pro', name: 'Professional', price: '$20', limit: '500k tokens/mo', features: ['Imagen-4 high quality', 'Grounding citations', 'Priority fast pipelines', 'Claude & ChatGPT access'], color: 'border-indigo-500 bg-indigo-950/25' },
    { id: 'enterprise', name: 'Enterprise', price: '$200', limit: 'Infinite lines', features: ['Custom enterprise server URL', 'Offline SDK synchronizers', '24/7 priority help tickets'], color: 'border-pink-500' }
  ];

  const handleUpgradePlan = (planId: 'free' | 'pro' | 'enterprise') => {
    onUpdateSubscription(planId);
    alert(`Success! Subscription plan updated to: ${planId.toUpperCase()}`);
  };

  return (
    <div className={`flex-1 overflow-y-auto px-4 py-3 ${isDark ? 'text-gray-150' : 'text-gray-850'}`}>
      
      {/* Sub tabs selectors */}
      <div className={`flex overflow-x-auto pb-2 gap-1.5 border-b mb-4 ${
        isDark ? 'border-zinc-850' : 'border-zinc-150'
      }`}>
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'models', label: 'Models', icon: Cpu },
          { id: 'plans', label: 'Plans', icon: CreditCard },
          { id: 'config', label: 'App', icon: Settings },
          { id: 'help', label: 'Help', icon: HelpCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSettingsTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSetSettingsTab(tab.id as any)}
              className={`flex items-center gap-1 py-1 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all border whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : isDark
                    ? 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 text-gray-400'
                    : 'bg-white border-zinc-200 hover:bg-zinc-50 text-gray-600'
              }`}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE SCREEN */}
      
      {/* 1. PLANS SCREEN */}
      {activeSettingsTab === 'plans' && (
        <div className="space-y-4">
          <div className="text-center mb-1">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-pink-400">Subscription Upgrades</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Scale allocation limits safely across workspace threads.</p>
          </div>

          <div className="space-y-3">
            {plans.map(p => {
              const matches = subscription.plan === p.id;
              return (
                <div 
                  key={p.id} 
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all relative ${p.color} ${
                    isDark ? 'bg-zinc-950/40' : 'bg-white'
                  }`}
                >
                  {matches && (
                    <span className="absolute top-2.5 right-2 text-[9px] font-bold font-mono tracking-widest uppercase bg-indigo-600 text-white py-0.5 px-2 rounded-full flex items-center gap-1 shadow">
                      <Check size={10} /> Active Plan
                    </span>
                  )}
                  <div>
                    <h4 className="text-xs font-bold font-display uppercase tracking-wide">{p.name}</h4>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-lg font-bold font-display">{p.price}</span>
                      <span className="text-[9px] text-gray-400">/ user / mo</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono italic block mt-0.5">{p.limit}</span>
                    
                    <ul className="space-y-1 mt-3.5 border-t border-zinc-800/50 pt-3">
                      {p.features.map((f, i) => (
                        <li key={i} className="text-[10px] text-gray-400 flex items-center gap-1.5 leading-snug">
                          <Check size={10} className="text-indigo-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!matches && (
                    <button
                      onClick={() => handleUpgradePlan(p.id as any)}
                      className="mt-4 w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase transition-colors border border-zinc-700 cursor-pointer"
                    >
                      Initialize Upgrade Flow
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MODELS SELECTOR */}
      {activeSettingsTab === 'models' && (
        <div className="space-y-4">
          <div className="text-center mb-1">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-indigo-400">AI Model Registry</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Toggle active neural networks and adjust proxy endpoints.</p>
          </div>

          <div className="space-y-2">
            {models.map(m => {
              const isSelected = selectedModelId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectModel(m.id)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/15'
                      : isDark
                        ? 'bg-zinc-950/40 border-zinc-805 hover:bg-zinc-900/40'
                        : 'bg-white border-zinc-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1 truncate pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-display">{m.name}</span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-lg ${
                        m.premium ? 'bg-pink-950 text-pink-300' : 'bg-gray-800 text-gray-300'
                      }`}>
                        {m.provider}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{m.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-[9px] font-mono text-gray-400">
                      <span>Window: {m.contextWindow}</span>
                      <span>•</span>
                      <span>Rate: {m.costEstimate}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-indigo-600 text-white shrink-0">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PROFILE SETTINGS */}
      {activeSettingsTab === 'profile' && (
        <div className="space-y-5">
          <div className="flex flex-col items-center text-center p-2 mb-1">
            <div className={`w-20 h-20 rounded-full border-2 border-indigo-500 relative flex items-center justify-center p-1 bg-zinc-900/40`}>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                alt="Profile Avatar" 
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-indigo-600 rounded-full border border-zinc-950 flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            </div>
            <h3 className="font-bold font-display text-sm mt-3.5">Developer Environment</h3>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">Enterprise Member</span>
          </div>

          {/* Secure data profile sections */}
          <div className="space-y-2 text-xs">
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-zinc-950/40 border-zinc-805' : 'bg-white border-zinc-200'
            }`}>
              <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-mono mb-1.5">
                <span>Account Sync Details</span>
                <span className="text-emerald-500">Live Secure Status</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">User ID:</span>
                <span className="font-mono text-gray-300">www.alikhanjalbani00@gmail.com</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">Plan Authority:</span>
                <span className="font-mono text-indigo-400 uppercase font-bold">{subscription.plan}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. APP / CONFIG SETTINGS */}
      {activeSettingsTab === 'config' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border space-y-3 bg-zinc-950/30 border-zinc-800">
            <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-gray-400 mb-1">
              Interactive Hardware Drivers
            </h4>
            
            {/* Theme selector */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="flex items-center gap-1.5 text-gray-300">
                <CloudLightning size={14} className="text-yellow-400" />
                Theme Mode
              </span>
              <div className="flex items-center gap-1">
                {['light', 'dark'].map(tNode => (
                  <button
                    key={tNode}
                    onClick={() => onUpdateConfig({ theme: tNode as any })}
                    className={`px-2.5 py-1 text-[10px] rounded border font-bold capitalize cursor-pointer ${
                      config.theme === tNode
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-zinc-950 text-gray-400 border-zinc-800'
                    }`}
                  >
                    {tNode}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="flex items-center gap-1.5 text-gray-300">
                <Languages size={14} className="text-indigo-400" />
                Default Language
              </span>
              <select
                value={config.language}
                onChange={(e) => onUpdateConfig({ language: e.target.value as any })}
                className="p-1 px-1.5 text-[10px] font-bold bg-zinc-950 border border-zinc-800 rounded text-gray-300 cursor-pointer outline-none"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="de">Deutsch (DE)</option>
                <option value="ja">日本語 (JA)</option>
              </select>
            </div>

            {/* Haptic controls */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-gray-300">Haptic Feedback</span>
              <input
                type="checkbox"
                checked={config.hapticFeedback}
                onChange={(e) => onUpdateConfig({ hapticFeedback: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-zinc-800 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl border space-y-2 bg-zinc-950/30 border-zinc-800">
            <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-gray-400 mb-1">
              Data Cache Diagnostics
            </h4>
            <div className="flex justify-between items-center text-xs py-1">
              <span className="text-gray-400">Total local database log size:</span>
              <span className="font-mono text-gray-300 font-bold">4.2 KB</span>
            </div>
            <button
              onClick={onClearCache}
              className="w-full py-1.5 rounded-lg bg-red-950/15 hover:bg-red-950/30 border border-red-900/30 text-red-400 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Clear Local SQL Offline Cache
            </button>
          </div>
        </div>
      )}

      {/* 5. HELP SCREEN */}
      {activeSettingsTab === 'help' && (
        <div className="space-y-4">
          <div className="text-center mb-1">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gray-400">Help Center & Docs</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Resolve technical integration problems or request quotas.</p>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { q: 'How do I run this app on standard Android device?', a: 'Download the source folders from the developer inspect panel, open them in an Expo blank-typescript app, and execute npx expo run:android.' },
              { q: 'How is Gemini key allocated?', a: 'At runtime, keys are secure and managed via AI Studio project variables. No secret strings expose to browser outputs.' },
              { q: 'Where do offline conversation logs persist?', a: 'We utilize standard React Native SQLite / expo-secure-store cache layers for reliable local persistence.' }
            ].map((faq, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                isDark ? 'bg-zinc-950/40 border-zinc-805' : 'bg-white border-zinc-200'
              }`}>
                <h5 className="font-bold font-display text-[11px] mb-1">{faq.q}</h5>
                <p className="text-[10px] text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
