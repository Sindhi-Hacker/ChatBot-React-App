/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, 
  Smartphone, 
  Battery, 
  Wifi, 
  Signal, 
  Layout, 
  MessageSquare, 
  MapPin, 
  HelpCircle, 
  Settings, 
  Plus, 
  Compass, 
  Cpu, 
  LogOut, 
  Sparkles, 
  CheckSquare, 
  Eye, 
  Pin,
  Flame,
  User,
  Bell,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DeviceConfig, ChatSession, UserSubscription, AIModel } from '../types';

interface DeviceFrameProps {
  config: DeviceConfig;
  subscription: UserSubscription;
  sessions: ChatSession[];
  activeSessionId: string;
  selectedModel: AIModel;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onSelectSession: (id: string) => void;
  onAddSession: () => void;
  onTogglePinSession: (id: string) => void;
  children: React.ReactNode;
}

export default function DeviceFrame({
  config,
  subscription,
  sessions,
  activeSessionId,
  selectedModel,
  activeRoute,
  onNavigate,
  onSelectSession,
  onAddSession,
  onTogglePinSession,
  children
}: DeviceFrameProps) {
  const isDark = config.theme === 'dark';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Authentications states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigateTo = (route: string) => {
    onNavigate(route);
    setIsDrawerOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsDrawerOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  // Nav categories
  const menuItems = [
    { route: 'dashboard', label: 'Dashboard', icon: Layout },
    { route: 'chat', label: 'AI Chat', icon: MessageSquare },
    { route: 'image-gen', label: 'Image Studio', icon: Sparkles },
    { route: 'voice', label: 'Voice Assistant', icon: Compass },
    { route: 'settings', label: 'Settings & billing', icon: Settings },
  ];

  // Simulated push banner overlay
  const pinnedSessions = sessions.filter(s => s.pinned);

  return (
    <div className="flex flex-col items-center justify-center p-2 relative h-full w-full select-none">
      
      {/* Dynamic Shell Sizing based on device selected configurations (iPhone/Android mockup frame) */}
      <div 
        className={`relative rounded-[32px] border-[10px] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 w-full max-w-[340px] aspect-[9/19] select-none ${
          isDark 
            ? 'bg-zinc-950 border-zinc-800 shadow-zinc-950/40' 
            : 'bg-zinc-100 border-zinc-350 shadow-gray-400/30'
        }`}
      >
        {/* Notch / Speaker bar for simulated iOS */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-b-xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-zinc-800 rounded-full"></div>
        </div>

        {/* Dynamic Mobile Top Bar Status indicators */}
        <div className={`px-5 pt-4 pb-1.5 flex justify-between items-center text-[10px] font-mono font-semibold z-40 select-none ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <span>12:11 PM</span>
          <div className="flex items-center space-x-1 pr-1">
            <Signal size={12} />
            <Wifi size={12} />
            <div className="flex items-center space-x-0.5">
              <span>94%</span>
              <Battery size={14} />
            </div>
          </div>
        </div>

        {/* Outer view frame contents */}
        {isAuthenticated ? (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* IN-APP VIEW WRAPPER HEADER BAR */}
            <div className={`px-3 py-2 border-b flex items-center justify-between ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className={`p-1.5 rounded-lg hover:bg-zinc-800/20 transition-all cursor-pointer ${
                  isDark ? 'text-indigo-400' : 'text-indigo-600'
                }`}
              >
                <Menu size={16} />
              </button>

              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold font-display uppercase tracking-wider text-indigo-500">AURA AI</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              </div>

              {/* Quick profile circle shortcut */}
              <button 
                onClick={() => navigateTo('settings')}
                className="w-6 h-6 rounded-full border border-indigo-500 overflow-hidden cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>

            {/* MAIN INNER CHASSIS ROUTE VIEWPORT CONTAINER */}
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              {children}
            </div>

            {/* SLIDING APP DRAWER OVERLAY PANEL */}
            <AnimatePresence>
              {isDrawerOpen && (
                <>
                  {/* Backdrop screen lock */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsDrawerOpen(false)}
                    className="absolute inset-0 bg-black z-45"
                  />

                  {/* Sidebar Drawer container body */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className={`absolute top-0 bottom-0 left-0 w-[240px] z-50 flex flex-col justify-between py-4 border-r ${
                      isDark ? 'bg-zinc-950 border-zinc-900 text-gray-100' : 'bg-white border-zinc-200 text-gray-900'
                    }`}
                  >
                    <div>
                      {/* Drawer profile head */}
                      <div className="px-4 pb-3 border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">A</div>
                          <div>
                            <h4 className="text-[11px] font-bold truncate max-w-[120px]">ALIKHAN JALBANI</h4>
                            <p className="text-[8px] font-mono text-indigo-400 uppercase font-semibold">{subscription.plan} ACCOUNT</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsDrawerOpen(false)}
                          className="text-gray-400 hover:text-white cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Routes list selector menu */}
                      <div className="px-2 py-3 space-y-1">
                        <p className="text-[8px] font-bold font-mono text-gray-500 uppercase tracking-widest pl-2 mb-2">Systems Menu</p>
                        {menuItems.map((item) => {
                          const Icon = item.icon;
                          const matches = activeRoute === item.route;
                          return (
                            <button
                              key={item.route}
                              onClick={() => navigateTo(item.route)}
                              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold justify-between transition-colors cursor-pointer ${
                                matches
                                  ? 'bg-indigo-600/15 text-indigo-400'
                                  : isDark
                                    ? 'hover:bg-zinc-900 text-gray-400 hover:text-white'
                                    : 'hover:bg-zinc-50 text-gray-600 hover:text-black'
                              }`}
                            >
                              <span className="flex items-center gap-2.5">
                                <Icon size={14} />
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Offline Cached Pinned Chats section */}
                      <div className="px-2 py-2 border-t border-zinc-800/40">
                        <p className="text-[8px] font-bold font-mono text-gray-500 uppercase tracking-widest pl-2 mb-1.5 flex items-center gap-1">
                          <Pin size={10} /> Pinned Workspace
                        </p>
                        <div className="space-y-0.5 max-h-[110px] overflow-y-auto">
                          {pinnedSessions.map(session => (
                            <button
                              key={session.id}
                              onClick={() => {
                                onSelectSession(session.id);
                                navigateTo('chat');
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-medium truncate block cursor-pointer ${
                                activeSessionId === session.id
                                  ? 'bg-indigo-600/10 text-indigo-400'
                                  : 'hover:underline text-gray-400 hover:text-white'
                              }`}
                            >
                              # {session.title}
                            </button>
                          ))}
                          {pinnedSessions.length === 0 && (
                            <p className="text-[8px] text-gray-500 italic px-2 py-1">No chats pinned securely.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer drawer commands */}
                    <div className="px-3 pt-3 border-t border-zinc-805 space-y-2">
                      <div className="flex items-center justify-between text-[9px] text-gray-500 bg-zinc-900/40 p-1.5 rounded-lg">
                        <span>Rate quota:</span>
                        <span className="font-mono text-emerald-400 font-bold">{subscription.tokensUsed} tokens</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-red-400 flex items-center justify-center gap-1 font-bold text-[10px] uppercase border border-zinc-800 cursor-pointer"
                      >
                        <LogOut size={12} /> Log Out Offline
                      </button>
                    </div>

                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </div>
        ) : (
          /* EMBEDDED AUTH LOGIN CONTAINER */
          <div className="flex-1 p-6 flex flex-col justify-center text-center">
            <span className="text-4xl animate-bounce mb-3">🛡️</span>
            <h2 className="text-sm font-bold font-display uppercase tracking-widest text-indigo-500">Aura Secure Lock</h2>
            <p className="text-[10px] text-gray-500 mt-1 mb-6 leading-relaxed">
              Biometric & Email validation required to reload cloud synchronize threads.
            </p>

            <form onSubmit={handleLogin} className="space-y-2.5 text-xs text-left">
              <div>
                <label className="text-[9px] font-mono text-gray-400 block mb-0.5">Email identifier</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="www.alikhanjalbani00@gmail.com"
                  required
                  className="w-full p-2 rounded-lg bg-zinc-900 text-white border border-zinc-800 outline-none focus:border-indigo-500 text-xs"
                />
              </div>
              <div className="pb-2">
                <label className="text-[9px] font-mono text-gray-400 block mb-0.5">Access token passphrase</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full p-2 rounded-lg bg-zinc-900 text-white border border-zinc-800 outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider shadow shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Authenticate Offline Auth
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between gap-1 text-[8px] text-gray-500 font-mono">
              <span className="hover:underline cursor-pointer">SSO Google</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Apple Sync</span>
            </div>
          </div>
        )}

        {/* Home gesture indicator pill */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-zinc-700/85 rounded-full z-45"></div>
      </div>
    </div>
  );
}
