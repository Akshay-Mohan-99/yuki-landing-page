export interface Cat {
  id: string;
  image: string;
  points: number;
  type: 'common' | 'rare' | 'legendary';
  speed: number;
  position: {
    x: number,
    y: number
  }
}

export interface Player {
  email: string;
  id: string;
  score: number;
  verified: boolean;
  date: string;
}

export interface Scores {
  user_id: string;
  name: string;
  score: number;
  date: string;
}

export interface GameState {
  score: number;
  lives: number;
  gameStatus: 'idle' | 'playing' | 'gameOver';
  activeCats: Cat[];
}