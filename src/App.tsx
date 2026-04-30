/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { PlaylistPanel, VisualizerPanel } from './components/AudioPanels';
import { PlayerFooter } from './components/PlayerFooter';
import { MusicProvider } from './MusicContext';
import { motion } from 'motion/react';

export default function App() {
  return (
    <MusicProvider>
      <div className="min-h-screen bg-[#020205] text-slate-100 flex items-center justify-center font-sans overflow-hidden p-4 md:p-8">
        {/* Main Application Container - Fixed Size Look */}
        <div className="w-full max-w-[1200px] h-[850px] bg-[#020205] border border-slate-900 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col p-8 overflow-hidden relative">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-gradient-to-b from-cyan-950/20 to-transparent pointer-events-none" />

          {/* Header Section */}
          <header className="flex justify-between items-center mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-3xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                SYNTH•SNAKE v1.0
              </h1>
            </div>
            
            <div className="flex items-center gap-10">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-1">Latency</div>
                <div className="text-2xl font-mono text-cyan-400 leading-none tracking-tighter">0.02ms</div>
              </div>
              <div className="text-right border-l border-slate-800/50 pl-10">
                <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-1">Engine Status</div>
                <div className="text-2xl font-mono text-fuchsia-500 leading-none tracking-tighter uppercase">Optimal</div>
              </div>
            </div>
          </header>

          <main className="flex-1 flex gap-10 mb-8 relative z-10 min-h-0">
            {/* Left Panel: Playlist */}
            <PlaylistPanel />

            {/* Center Panel: Snake Game */}
            <section className="flex-1 rounded-3xl relative overflow-hidden flex items-center justify-center">
              <SnakeGame />
            </section>

            {/* Right Panel: Audio Visualizer */}
            <VisualizerPanel />
          </main>

          {/* Player Controls Footer */}
          <PlayerFooter />
        </div>
      </div>
    </MusicProvider>
  );
}
