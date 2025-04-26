import React from 'react';
import { Heart } from 'lucide-react';

interface GameHUDProps {
  score: number;
  lives: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, lives }) => {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-50">
      <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-2 font-bold text-white text-xl shadow-lg">
        Score: {score}
      </div>
      
      <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-6 py-2 shadow-lg">
        {[...Array(3)].map((_, i) => (
          <Heart 
            key={i} 
            size={24} 
            className={`mr-1 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default GameHUD;