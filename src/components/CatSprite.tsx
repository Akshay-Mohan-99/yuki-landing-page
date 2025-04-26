import React, { useEffect, useRef, useState } from 'react';
import { Cat } from '../types';

interface CatSpriteProps {
  cat: Cat;
  onClick: () => void;
}

const GRAVITY = 0.0010; // Pixels per ms²

const CatSprite: React.FC<CatSpriteProps> = ({ cat, onClick }) => {
  const [position, setPosition] = useState(cat.position);
  const [velocity, setVelocity] = useState<{ vx: number; vy: number }>(() => {
    // Generate the initial position just below the screen
    const startPos = cat.position;
  
    // Set initial velocity based on the spawn side
    let initialVx = 0;
    let initialVy = 0;
  
    // Since the cat starts just below the screen, we'll shoot it upward
    // Always shoot upward initially
    initialVy = -0.8;

    // Adjust initialVx based on where the cat spawns
    if (startPos.x < window.innerWidth / 2) {
      // Left side of screen → move slightly right
      initialVx = 0.1; // Always positive
    } else {
      // Right side of screen → move slightly left
      initialVx = -0.1; // Always negative
    }

    return ({ vx: initialVx, vy: initialVy });
  });
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
  
    const startTime = performance.now();
  
    const animate = (now: number) => {
      const elapsed = now - startTime;
  
      setPosition(prev => {
        const dt = 16; // approximate 60fps frame delta (ms)
        const newVx = velocity.vx;
        const newVy = velocity.vy + GRAVITY * elapsed; // gravity pulling down
  
        const newX = prev.x + newVx * dt;
        const newY = prev.y + newVy * dt;

        return { x: newX, y: newY };
      });
  
      requestAnimationFrame(animate);
    };
  
    requestAnimationFrame(animate);
  }, [cat]);
  

  const getCatClassName = () => {
    let baseClass = "absolute transform transition-transform duration-100 cursor-pointer select-none";

    switch (cat.type) {
      case 'common':
        baseClass += " hover:scale-110";
        break;
      case 'rare':
        baseClass += " hover:scale-110 animate-bounce";
        break;
      case 'legendary':
        baseClass += " hover:scale-110 animate-pulse";
        break;
    }

    return baseClass;
  };

  return (
    <div 
      ref={elementRef}
      className={`absolute z-30 transform cursor-pointer 
        w-24 h-24 md:w-24 md:h-24 lg:w-32 lg:h-32
        `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <img 
        src={cat.image} 
        alt="Cat" 
        className="w-full h-full object-contain pointer-events-none"
        draggable="false"
      />
    </div>
  );
  
  
};

export default CatSprite;
