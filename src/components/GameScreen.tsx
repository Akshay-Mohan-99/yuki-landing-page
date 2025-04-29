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

const GameScreen: React.FC<GameScreenProps> = ({
  score,
  lives,
  onScoreUpdate,
  onLivesUpdate,
  onGameOver,
}) => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [difficulty, setDifficulty] = useState(1);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastCatTime = useRef(Date.now());

  // Increase difficulty as score increases
  useEffect(() => {
    setDifficulty(Math.min(3, 1 + Math.floor(score / 30)));
  }, [score]);

  // Cat spawn logic
  const spawnCat = useCallback(() => {
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current.getBoundingClientRect();
      const newCat = generateCat(width, height);

      setCats((prevCats) => [...prevCats, newCat]);

      const trackCatMovement = (catId: string) => {
        let hasEntered = false;
        const intervalId = setInterval(() => {
          const catElement = document.getElementById(catId); // 👈 get the DOM element
          if (catElement && gameAreaRef.current) {
            const { width, height } =
              gameAreaRef.current.getBoundingClientRect();
            const rect = catElement.getBoundingClientRect(); // 👈 live position
            if (!hasEntered) {
              if (rect.x >= 0 && rect.x <= width && rect.y < height) {
                hasEntered = true;
              }
            } else {
              if (rect.y > height) {
                clearInterval(intervalId);
                onLivesUpdate();
                setCats((prev) => prev.filter((c) => c.id !== catId));
              }
            }
          }
        }, 100);
      };

      trackCatMovement(newCat.id);
    }
  }, [onLivesUpdate]);

  // Game loop
  useEffect(() => {
    if (lives <= 0) {
      onGameOver();
      return;
    }

    const gameLoop = () => {
      const now = Date.now();
      // Calculate how many cats to spawn based on score
      const spawnCount = Math.min(1 + Math.floor(score / 6), 5); // Max 5 cats at once

      // Spawn cats based on difficulty
      if (now - lastCatTime.current > 2000 / difficulty) {
        for (let i = 0; i < spawnCount; i++) {
          setTimeout(() => {
            const audioCatPop = new Audio("/sounds/cat_pop.mp3");
            audioCatPop.play();
            spawnCat();
          }, i * 200); // delay increases by 100ms for each iteration
        }
        lastCatTime.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lives, difficulty, spawnCat, onGameOver]);

  // Handle cat click
  const handleCatClick = (cat: Cat) => {
    const audioCatClick = new Audio("/sounds/cat_click.mp3");
    audioCatClick.play();
    // Add points
    onScoreUpdate(cat.points);

    // Remove cat from state
    setCats((prevCats) => prevCats.filter((c) => c.id !== cat.id));

    // Create and animate score popup
    if (gameAreaRef.current) {
      const popup = document.createElement("div");
      popup.className = `absolute text-lg font-bold ${
        cat.type === "common"
          ? "text-green-400"
          : cat.type === "rare"
          ? "text-blue-400"
          : "text-purpleBrand"
      } z-30`;
      popup.style.left = `${cat.position.x}px`;
      popup.style.top = `${cat.position.y}px`;
      popup.textContent = `+${cat.points}`;

      gameAreaRef.current.appendChild(popup);

      // Animate popup
      let y = cat.position.y;
      const animate = () => {
        y -= 2;
        popup.style.top = `${y}px`;
        popup.style.opacity = `${1 - (cat.position.y - y) / 50}`;

        if (y > cat.position.y - 50) {
          requestAnimationFrame(animate);
        } else {
          popup.remove();
        }
      };

      requestAnimationFrame(animate);
    }
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
            onClick={() => handleCatClick(cat)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
