import React from 'react';
import { useMusic } from '../MusicContext';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

export const PlayerFooter: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    currentTime, 
    duration,
    seek 
  } = useMusic();

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = (x / rect.width) * 100;
    seek(p);
  };

  return (
    <footer className="h-24 bg-slate-900/60 border border-slate-800 rounded-3xl flex items-center px-8 backdrop-blur-xl shadow-2xl relative z-50">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 p-1">
          <img src={currentTrack.cover} alt="" className="w-full h-full object-cover rounded shadow-lg" referrerPolicy="no-referrer" />
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-bold text-slate-100 truncate">{currentTrack.title}</div>
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight truncate">
            {currentTrack.artist} • {currentTrack.genre}
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button onClick={prevTrack} className="text-slate-400 hover:text-cyan-400 transition-colors transform active:scale-90">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={nextTrack} className="text-slate-400 hover:text-cyan-400 transition-colors transform active:scale-90">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500 w-8">{formatTime(currentTime)}</span>
          <div 
            className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer group relative"
            onClick={handleSeek}
          >
            <div 
              className="absolute h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute h-full w-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume/Extras */}
      <div className="w-1/4 flex justify-end items-center gap-4">
        <Volume2 size={16} className="text-slate-500" />
        <div className="w-24 h-1 bg-slate-800 rounded-full relative group">
          <div className="w-[70%] h-full bg-slate-400 group-hover:bg-cyan-400 transition-colors rounded-full" />
        </div>
        <div className="text-[8px] border border-slate-700 px-1.5 py-0.5 rounded uppercase text-slate-500 font-bold tracking-widest hidden md:block">
          HQ Audio
        </div>
      </div>
    </footer>
  );
};
