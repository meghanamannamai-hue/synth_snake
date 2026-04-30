import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track, DUMMY_TRACKS } from './types';

interface MusicContextType {
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  duration: number;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (percent: number) => void;
  setTrack: (index: number) => void;
  currentTime: number;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(DUMMY_TRACKS[currentTrackIndex].url);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('loadedmetadata', handleMetadata);
    } else {
      audioRef.current.src = DUMMY_TRACKS[currentTrackIndex].url;
      if (isPlaying) audioRef.current.play();
    }

    return () => {
      audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current?.removeEventListener('ended', handleEnded);
      audioRef.current?.removeEventListener('loadedmetadata', handleMetadata);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => nextTrack();

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const seek = (percent: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (percent / 100) * audioRef.current.duration;
    }
  };

  const setTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <MusicContext.Provider value={{ 
      currentTrack: DUMMY_TRACKS[currentTrackIndex], 
      isPlaying, 
      progress, 
      duration,
      currentTime,
      togglePlay, 
      nextTrack, 
      prevTrack, 
      seek,
      setTrack
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
};
