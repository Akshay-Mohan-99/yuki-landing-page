import React from 'react';
import { Play, Trophy } from 'lucide-react';

interface LandingPageProps {
  startGame: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ startGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white">
      <div className="flex flex-row justify-center pointer-events-auto mb-8">
        <img
          src="/assets/yuki_logo.png"
          alt="Yuki"
          className="h-20 w-auto"
        />
      </div>
      <button 
        onClick={startGame}
        className="fixed top-4 right-4 inline-block text-sm group  "
      >
        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-white transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
          <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-purpleBrand"></span>
          <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
          <span className="relative flex justify-center items-center">
            <Trophy size={18} className="text-yellow-300 mr-2" />
            <span className="font-bold text-white">Leadership Board</span>
          </span>
        </span>
        <span
          className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
          data-rounded="rounded-lg"
        ></span>
      </button>

      
      {/* <div className="max-w-md bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-2xl mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">How to Play</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="mr-2 text-yellow-300">•</span> 
            <span>Click on cats as they appear on screen</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-yellow-300">•</span> 
            <span>Different cats are worth different points</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-300">•</span> 
            <span>Common cats: 1 point</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-300">•</span> 
            <span>Rare cats: 3 points</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-pink-300">•</span> 
            <span>Legendary cats: 5 points</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-red-300">•</span> 
            <span>Miss 3 cats and it's game over!</span>
          </li>
        </ul>
      </div> */}
      
      <button 
        onClick={startGame}
        className="relative inline-block text-lg group"
      >
        {/* <Play className="mr-2 group-hover:animate-pulse" size={24} />
        Start Game */}
        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-white transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
          <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-purpleBrand"></span>
          <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
          <span className="relative">Start Game</span>
        </span>
        <span
          className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
          data-rounded="rounded-lg"
        ></span>
      </button>
      
      <p className="mt-8 text-sm text-white/70">© 2025 Yuki. All rights reserved.</p>
    </div>
  );
};

export default LandingPage;