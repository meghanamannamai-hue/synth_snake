import React from 'react';
import { useMusic } from '../MusicContext';
import { DUMMY_TRACKS } from '../types';
import { motion } from 'motion/react';

export const PlaylistPanel: React.FC = () => {
  const { currentTrack, setTrack } = useMusic();

  return (
    <section className="w-64 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-inner">
      <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4 font-bold">Neural Playlist</h2>
      <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {DUMMY_TRACKS.map((track, index) => {
          const isActive = track.id === currentTrack.id;
          return (
            <motion.div 
              key={track.id}
              onClick={() => setTrack(index)}
              className={`p-3 cursor-pointer transition-all rounded-xl flex items-center gap-3 group border ${
                isActive 
                ? 'bg-cyan-500/10 border-cyan-500/30' 
                : 'hover:bg-slate-800/50 border-transparent hover:border-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                isActive ? 'bg-cyan-500/20' : 'bg-slate-800 group-hover:bg-slate-700'
              }`}>
                {isActive ? (
                  <div className="flex gap-[2px] items-end h-3">
                    <motion.div animate={{ height: [2, 10, 4, 8, 2] }} transition={{ duration: 1, repeat: Infinity }} className="w-1 bg-cyan-400" />
                    <motion.div animate={{ height: [4, 2, 8, 4, 4] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1 bg-cyan-400" />
                    <motion.div animate={{ height: [8, 4, 2, 10, 8] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1 bg-cyan-400" />
                  </div>
                ) : (
                  <div className="w-1 h-3 bg-slate-600 group-hover:bg-slate-400" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className={`text-sm font-bold truncate ${isActive ? 'text-cyan-100' : 'text-slate-300'}`}>
                  {track.title}
                </div>
                <div className={`text-[10px] uppercase truncate ${isActive ? 'text-cyan-400/70' : 'text-slate-500'}`}>
                  {track.artist}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-auto p-4 bg-gradient-to-t from-fuchsia-500/10 to-transparent border-t border-fuchsia-500/20 rounded-b-2xl">
        <div className="text-[10px] text-fuchsia-400 mb-1 font-bold italic tracking-wider">SYSTEM TIP</div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-mono">Eat pink cores to increase grid frequency.</p>
      </div>
    </section>
  );
};

export const VisualizerPanel: React.FC = () => {
  const { isPlaying } = useMusic();
  
  return (
    <section className="w-64 flex flex-col gap-4">
      <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4 font-bold">Spectrum</h2>
        <div className="h-48 flex items-end gap-[4px] px-2">
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i}
              animate={isPlaying ? { height: [
                `${20 + Math.random() * 20}%`, 
                `${60 + Math.random() * 40}%`, 
                `${30 + Math.random() * 30}%`
              ] } : { height: '10%' }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear', delay: i * 0.05 }}
              className={`flex-1 rounded-t-sm ${i > 4 ? 'bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.3)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]'}`}
            />
          ))}
        </div>
      </div>
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="text-[10px] uppercase text-slate-500 font-bold mb-3 tracking-widest">Grid Metrics</div>
        <div className="space-y-3">
          <div className="flex justify-between text-xs border-b border-slate-800/50 pb-1">
             <span className="text-slate-500 font-mono italic">BITRATE</span>
             <span className="text-cyan-400 font-mono">320 KBPS</span>
          </div>
          <div className="flex justify-between text-xs">
             <span className="text-slate-500 font-mono italic">SIGNAL</span>
             <span className="text-fuchsia-400 font-mono uppercase">Optimal</span>
          </div>
        </div>
      </div>
    </section>
  );
};
