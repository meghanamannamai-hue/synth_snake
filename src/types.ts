export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  url: string;
  cover: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'AI Unit 01',
    genre: 'Synthwave',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73456.mp3',
    cover: 'https://images.unsplash.com/photo-1614850523296-e8c041de4392?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Deep Grid Drift',
    artist: 'SynthMind',
    genre: 'Techno',
    url: 'https://cdn.pixabay.com/audio/2021/11/24/audio_33215830c2.mp3',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Cybernetic Pulse',
    artist: 'PulseGen',
    genre: 'Cyberpunk',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop'
  }
];

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  highScore: number;
}
