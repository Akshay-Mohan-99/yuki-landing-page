import React, { useState, useEffect, useCallback, useRef } from "react";
import { Cat } from "../types";
import { generateCat } from "../utils/gameUtils";
import CatSprite from "./CatSprite";
import GameHUD from "./GameHUD";

interface GameScreenProps {
  score: number;
  lives: number;
  onScoreUpdate: (points: number) => void;
  onLivesUpdate: () => void;
  onGameOver: () => void;
}

const GRAVITY = 0.001; // pixels/ms²
const BOOST_FACTOR = 1 + window.innerHeight / 2500;

const GameScreen: React.FC<GameScreenProps> = ({
  score,
  lives,
  onScoreUpdate,
  onLivesUpdate,
  onGameOver,
}) => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [difficulty, setDifficulty] = useState(1);
  const [spawnCount, setSpawnCount] = useState(1);
  const [tick, setTick] = useState(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const animationGameloopFrameRef = useRef<number>();
  const lastCatTime = useRef(Date.now());
  const lastTimeRef = useRef(performance.now());
  const currentLives = useRef(lives);

  const catStatesRef = useRef<
    Record<
      string,
      {
        position: { x: number; y: number };
        velocity: { vx: number; vy: number };
        hasEntered: boolean;
      }
    >
  >({});

  // Difficulty scaling
  useEffect(() => {
    if (Math.min(1 + Math.floor(score / 6), 5) !== spawnCount) {
      setSpawnCount(Math.min(1 + Math.floor(score / 6), 5));
    }
    if (Math.min(3, 1 + Math.floor(score / 50)) !== difficulty) {
      setDifficulty(Math.min(3, 1 + Math.floor(score / 50)));
    }
  }, [score]);

  useEffect(() => {
    currentLives.current = lives;
  }, [lives]);

  // Cat spawn
  const spawnCat = useCallback(() => {
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current.getBoundingClientRect();
      const newCat = generateCat(width, height);

      // Initialize physics state
      const centerY = window.innerHeight / 2;
      const distanceToCenter = newCat.position.y - centerY;
      const baseVy = Math.sqrt(2 * GRAVITY * Math.abs(distanceToCenter));
      const initialVy = -baseVy * BOOST_FACTOR;
      const initialVx = newCat.position.x < window.innerWidth / 2 ? 0.1 : -0.1;

      catStatesRef.current[newCat.id] = {
        position: { ...newCat.position },
        velocity: { vx: initialVx, vy: initialVy },
        hasEntered: false,
      };

      setCats((prev) => [...prev, newCat]);
      setTick((prev) => prev + 1);
    }
  }, []);

  // Central animation loop
  useEffect(() => {
    const loop = (now: number) => {
      const dt = now - lastTimeRef.current;
      if (currentLives.current <= 0) {
        return;
      }

      lastTimeRef.current = now;
      const updatedCats: Cat[] = [];
      for (const cat of cats) {
        const state = catStatesRef.current[cat.id];
        if (!state) continue;

        state.velocity.vy += GRAVITY * dt;
        state.position.x += state.velocity.vx * dt;
        state.position.y += state.velocity.vy * dt;

        const containerHeight =
          gameAreaRef.current?.getBoundingClientRect().height ??
          window.innerHeight;

        // Mark as entered if it is within the visible screen
        if (!state.hasEntered && state.position.y < containerHeight) {
          state.hasEntered = true;
        }

        // Only count as missed if it has already entered and is now below the screen
        if (state.hasEntered && state.position.y > containerHeight) {
          onLivesUpdate();
          delete catStatesRef.current[cat.id];
          continue;
        }

        updatedCats.push(cat);
      }

      setCats(updatedCats);
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tick]);

  // Spawn logic loop
  useEffect(() => {
    const gameLoop = () => {
      if (currentLives.current <= 0) {
        catStatesRef.current = {};
        setCats([]);
        onGameOver();
        return;
      }
      const now = Date.now();

      if (now - lastCatTime.current > 2500 / difficulty) {
        for (let i = 0; i < spawnCount; i++) {
          setTimeout(() => {
            if (currentLives.current <= 0) {
              return;
            }
            const audioCatPop = new Audio("/sounds/cat_pop.mp3");
            audioCatPop.play();
            spawnCat();
          }, i * 200);
        }
        lastCatTime.current = now;
      }

      animationGameloopFrameRef.current = requestAnimationFrame(gameLoop);
    };

    if (currentLives.current > 0) {
      animationGameloopFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationGameloopFrameRef.current) {
        cancelAnimationFrame(animationGameloopFrameRef.current);
      }
    };
  }, [difficulty, spawnCount]);

  // Handle click
  const handleCatClick = (cat: Cat) => {
    onScoreUpdate(cat.points);
    delete catStatesRef.current[cat.id];
    setCats((prev) => prev.filter((c) => c.id !== cat.id));
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden">
      <GameHUD score={score} lives={lives} />
      <div ref={gameAreaRef} className="relative w-full h-full">
        {cats.map((cat) => (
          <CatSprite
            key={cat.id}
            id={cat.id}
            cat={cat}
            position={catStatesRef.current[cat.id]?.position}
            onClick={() => handleCatClick(cat)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
