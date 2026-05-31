/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Download, Grid, Wand2, Image as ImageIcon } from 'lucide-react';
import { DeviceConfig } from '../types';

interface ImageGenViewProps {
  config: DeviceConfig;
}

export default function ImageGenView({ config }: ImageGenViewProps) {
  const isDark = config.theme === 'dark';
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const handleCreateImage = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedUrl(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio })
      });
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedUrl(data.imageUrl);
      } else {
        throw new Error("Invalid payload format returned");
      }
    } catch (err) {
      console.error("Failed to generate client image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles size={14} />
          </span>
          <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            Imagen Video & Photo Engine
          </span>
        </div>
        <h1 className="text-xl font-bold font-display tracking-tight mt-1">Image Prompt Studio</h1>
        <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Natively compiled to utilize Imagen-3 API models directly on your mobile device profiles.
        </p>
      </div>

      {/* Main Image View Port */}
      <div className={`w-full aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 relative overflow-hidden mb-4 ${
        isDark ? 'bg-zinc-950/40 border-zinc-800' : 'bg-gray-50 border-zinc-200'
      }`}>
        {isGenerating ? (
          <div className="text-center z-10">
            <div className="relative flex justify-center items-center mb-3">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
              <Sparkles size={20} className="text-indigo-400 absolute animate-pulse" />
            </div>
            <p className="text-xs font-medium font-mono text-indigo-400">Synthesizing Pixels...</p>
            <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] leading-relaxed">
              Configuring vectors and resolving lightning details via server side Imagen controller.
            </p>
          </div>
        ) : generatedUrl ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <img 
              src={generatedUrl} 
              alt="Imagen Prompt Outcome" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            {/* Action buttons overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
              <a 
                href={generatedUrl} 
                download={`aura-gen-${Date.now()}.png`}
                className="p-1.5 rounded-lg bg-zinc-900/80 backdrop-blur-md text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
                title="Download local asset"
              >
                <Download size={14} />
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 max-w-xs px-6">
            <ImageIcon size={32} className="mx-auto text-gray-600 mb-2 animate-pulse" />
            <p className="text-xs font-semibold">Prompt Area Clear</p>
            <p className="text-[10px] text-gray-500 mt-1 leading-snug">
              Provide a detailed semantic scene description below to prompt neural generation.
            </p>
          </div>
        )}
      </div>

      {/* Inputs Board */}
      <div className={`p-3.5 rounded-xl border space-y-3.5 ${
        isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div>
          <label className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider block mb-1">
            Prompt description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic neon-drenched robot riding a skateboard down a cyberpunk highway, photorealistic, 4k vector textures..."
            rows={3}
            className={`w-full p-2 text-xs rounded-lg border outline-none ${
              isDark 
                ? 'bg-zinc-950 border-zinc-800 text-white placeholder-gray-600 focus:border-indigo-500' 
                : 'bg-white border-zinc-300 text-gray-900 placeholder-gray-400 focus:border-indigo-600'
            }`}
          />
        </div>

        {/* Aspect Ratio Config */}
        <div>
          <label className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider block mb-1">
            Aspect ratio profile
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {['1:1', '16:9', '9:16'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`py-1 rounded-lg border font-mono transition-colors cursor-pointer ${
                  aspectRatio === ratio
                    ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                    : isDark
                      ? 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900 text-gray-400'
                      : 'bg-gray-100 border-zinc-200 hover:bg-gray-100 text-gray-600'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCreateImage}
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-md ${
            prompt.trim() && !isGenerating
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 cursor-pointer'
              : 'bg-zinc-800 border-zinc-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Wand2 size={14} />
          {isGenerating ? 'Synthesizing...' : 'Prompt Imagen Canvas'}
        </button>
      </div>
    </div>
  );
}
