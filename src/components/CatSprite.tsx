import React, { useEffect, useMemo, useRef, useState } from "react";
import { Cat } from "../types";

interface CatSpriteProps {
  cat: Cat;
  onClick: () => void;
  id: string;
}

const GRAVITY = 0.001; // Pixels per ms²
const BOOST_FACTOR = 1 + window.innerHeight / 2500;

const CatSprite: React.FC<CatSpriteProps> = ({ cat, onClick, id }) => {
  const [position, setPosition] = useState(cat.position);
  const [showGif, setShowGif] = useState(false);

  const initialVelocity = useMemo(() => {
    const startPos = cat.position;
    const centerY = window.innerHeight / 2;
    const distanceToCenter = startPos.y - centerY;

    const baseVy = Math.sqrt(2 * GRAVITY * Math.abs(distanceToCenter));

    const initialVy = -baseVy * BOOST_FACTOR; // boosted upward

    const initialVx = startPos.x < window.innerWidth / 2 ? 0.1 : -0.1;

    return { vx: initialVx, vy: initialVy };
  }, [cat.position]);

  // Store velocity in a ref instead of state
  const velocityRef = useRef<{ vx: number; vy: number }>(initialVelocity);

  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const animate = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setPosition((prev) => {
        const newVx = velocityRef.current.vx;
        const newVy = velocityRef.current.vy + GRAVITY * dt;
        velocityRef.current = { vx: newVx, vy: newVy };

        const newX = prev.x + newVx * dt;
        const newY = prev.y + newVy * dt;
        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId); // <== Clean up
    };
  }, []);

  const handleClick = (e: React.FormEvent) => {
    e.stopPropagation();
    const audioCatClick = new Audio("/sounds/cat_click.mp3");
    audioCatClick.play();
    setShowGif(true);
    // Hide GIF after 2 seconds (adjust to match your GIF duration)
    setTimeout(() => {
      setShowGif(false);
      onClick();
    }, 700);
  };

  return (
    <div
      className="absolute z-30 transform cursor-pointer p-6 select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      id={id}
      onClick={showGif ? undefined : handleClick}
    >
      {showGif ? (
        <img
          src="/assets/cat_click_animate.gif"
          alt="Effect"
          className="object-contain pointer-events-none w-32 h-32 select-none"
        />
      ) : (
        <img
          src={cat.image}
          alt="Cat"
          className="object-contain pointer-events-none w-32 h-32 select-none"
          draggable="false"
        />
      )}
    </div>
  );
};

export default CatSprite;
