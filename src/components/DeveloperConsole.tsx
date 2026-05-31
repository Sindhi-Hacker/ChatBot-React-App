/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Terminal, 
  Settings, 
  FolderTree, 
  Play, 
  Code,
  Network,
  Cpu,
  RefreshCw,
  Bell,
  CheckCircle,
  Clock
} from 'lucide-react';
import { DeviceConfig, UserSubscription, ChatSession } from '../types';

interface DeveloperConsoleProps {
  config: DeviceConfig;
  subscription: UserSubscription;
  sessions: ChatSession[];
  activeRoute: string;
  onUpdateConfig: (updated: Partial<DeviceConfig>) => void;
  onDispatchNotification: (title: string, body: string) => void;
}

export default function DeveloperConsole({
  config,
  subscription,
  sessions,
  activeRoute,
  onUpdateConfig,
  onDispatchNotification
}: DeveloperConsoleProps) {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'structure' | 'logs'>('diagnostics');
  const [pushTitle, setPushTitle] = useState('Workspace Synchronized');
  const [pushBody, setPushBody] = useState('Enterprise cloud thread buffers updated successfully.');

  const fileTree = [
    { name: 'app/_layout.tsx', desc: 'Main provider router wrapper' },
    { name: 'app/(drawer)/_layout.tsx', desc: 'Biometric authorization & layouts' },
    { name: 'app/(drawer)/chat.tsx', desc: 'Markdown sound transcript chat view' },
    { name: 'components/HapticButton.tsx', desc: 'Expo-Haptic vibration controller' },
    { name: 'package.json', desc: 'Natively packed mobile library definitions' },
    { name: 'tsconfig.json', desc: 'Type resolver configuration mappings' }
  ];

  const handlePushTrigger = () => {
    onDispatchNotification(pushTitle, pushBody);
  };

  return (
    <div className="flex-1 max-w-full md:max-w-[420px] border-l border-zinc-800 bg-zinc-950 flex flex-col h-full text-xs text-gray-300">
      
      {/* Dev Bar Title */}
      <div className="px-4 py-3 border-b border-zinc-850 flex justify-between items-center bg-zinc-950">
        <div className="flex items-center space-x-2">
          <Terminal size={14} className="text-indigo-400" />
          <span className="font-bold font-display uppercase tracking-widest text-[10px]">Aura dev console deck</span>
        </div>
        <span className="p-1 px-2 rounded-lg bg-zinc-900 text-[9px] font-mono border border-zinc-850 text-indigo-400">
          SDK 51.0 ACTIVE
        </span>
      </div>

      {/* Dev tabs */}
      <div className="grid grid-cols-3 border-b border-zinc-850 text-center font-mono text-[9px] uppercase tracking-wide">
        {(['diagnostics', 'structure', 'logs'] as any).map((tab: string) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-2 border-r border-zinc-850 font-bold transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-zinc-900/60 text-indigo-400 border-b-2 border-b-indigo-500' 
                : 'hover:bg-zinc-900 text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* TAB 1: DIAGNOSTICS DECK */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            
            {/* Device Profile Adjusters */}
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 space-y-3">
              <h4 className="flex items-center gap-1.5 font-bold font-display text-[10px] uppercase tracking-wider text-indigo-400">
                <Settings size={12} /> Live Device Simulation
              </h4>

              {/* Hardware environment toggle */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-gray-400 block uppercase">Signal Channel</label>
                <div className="grid grid-cols-3 gap-1">
                  {['wifi', 'cellular', 'offline'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onUpdateConfig({ networkStatus: mode as any })}
                      className={`py-1 text-[9px] font-bold uppercase rounded border transition-colors cursor-pointer ${
                        config.networkStatus === mode
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                          : 'bg-zinc-950 border-zinc-850 hover:bg-zinc-900 text-gray-500'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages switch */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-gray-400 block uppercase">Local Adaptor</label>
                <div className="grid grid-cols-4 gap-1">
                  {['en', 'es', 'de', 'ja'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => onUpdateConfig({ language: lang as any })}
                      className={`py-1 text-[10px] font-mono uppercase rounded border transition-colors cursor-pointer ${
                        config.language === lang
                          ? 'bg-indigo-600/35 border-indigo-500 text-indigo-400'
                          : 'bg-zinc-950 border-zinc-850 hover:bg-zinc-900 text-gray-500'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Push Dispatcher */}
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 space-y-3">
              <h4 className="flex items-center gap-1.5 font-bold font-display text-[10px] uppercase tracking-wider text-indigo-400">
                <Bell size={12} /> Simulated Push alert
              </h4>
              <p className="text-[10px] text-gray-500">
                Dispatch an immediate background webhook notification directly into the simulated viewport!
              </p>
              
              <div className="space-y-2 text-[10px]">
                <input 
                  type="text"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  placeholder="Push Alert Title"
                  className="w-full p-1.5 rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-indigo-500 text-white"
                />
                <input 
                  type="text"
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  placeholder="Push message content body"
                  className="w-full p-1.5 rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-indigo-500 text-white"
                />
                <button
                  onClick={handlePushTrigger}
                  className="w-full py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase text-[9px] tracking-wider transition-colors cursor-pointer"
                >
                  Dispatch Push Message
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: EXPO REPO DIRECTORY TREE */}
        {activeTab === 'structure' && (
          <div className="space-y-4">
            <h4 className="flex items-center gap-1.5 font-bold font-display text-[10px] uppercase tracking-wider text-indigo-400">
              <FolderTree size={12} /> Expo Router File Structure
            </h4>
            <p className="text-[10px] text-gray-500 leading-snug">
              These fully specified, typescript-strict files reside in your project workspace directory `/src/expo-code/` for immediate native compilation.
            </p>

            <div className="space-y-2.5">
              {fileTree.map((f, i) => (
                <div key={i} className="p-2.5 rounded-lg border border-zinc-850 bg-zinc-900/30 flex justify-between items-start gap-2">
                  <div className="truncate">
                    <span className="font-mono text-indigo-400 font-bold block truncate text-[11px]">{f.name}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 block truncate">{f.desc}</span>
                  </div>
                  <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">TSX</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ZUSTAND STATE ENGINE LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-4 font-mono text-[10px]">
            <h4 className="flex items-center gap-1.5 font-bold font-display text-[10px] uppercase tracking-wider text-indigo-400">
              <Cpu size={12} /> Zustand Reactive Engine Store
            </h4>
            
            <div className="p-3 rounded-lg border border-zinc-850 bg-zinc-950 space-y-2 leading-relaxed">
              <div className="flex justify-between border-b border-zinc-900 pb-1">
                <span className="text-gray-500">store_state:</span>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>
              <div>
                <span className="text-gray-500">active_thread:</span>
                <span className="text-zinc-300"> "{activeRoute.toUpperCase()}_VIEW"</span>
              </div>
              <div>
                <span className="text-gray-500">cached_conversations:</span>
                <span className="text-amber-400"> {sessions.length} sessions active</span>
              </div>
              <div>
                <span className="text-gray-500">cloud_synced_token:</span>
                <span className="text-indigo-400"> "JWT_3498A#A831"</span>
              </div>
              <div className="pt-2 border-t border-zinc-900">
                <span className="text-gray-500">biometrics:</span>
                <span className="text-pink-400"> "FACE_ID_ENABLED"</span>
              </div>
              <div>
                <span className="text-gray-500">haptics:</span>
                <span className="text-indigo-400 uppercase font-semibold">{config.hapticFeedback ? 'vibration_drivers_loaded' : 'inactive'}</span>
              </div>
              <div>
                <span className="text-gray-500">offline_databases:</span>
                <span className="text-gray-400"> "SQL_LOG_CACHE_OK"</span>
              </div>
            </div>

            {/* Diagnostic system log ticker */}
            <div className="rounded-lg bg-black p-3 border border-zinc-900 max-h-[120px] overflow-y-auto">
              <div className="text-[8px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-1 mb-1 border-b border-zinc-900 pb-1">
                <Clock size={10} /> Live System Terminal Output
              </div>
              <div className="text-[9px] text-indigo-400">[info] Web socket server proxy connected on port 3000</div>
              <div className="text-[9px] text-gray-400">[state] Offline cache sync verified. Quotas matched.</div>
              <div className="text-[9px] text-gray-400">[router] Switched to Route: '{activeRoute}'</div>
              <div className="text-[9px] text-pink-400">[haptic] Triggered feedback effect (impact_light)</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
