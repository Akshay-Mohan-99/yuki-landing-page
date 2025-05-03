import React, { useRef, useState } from "react";
import { Cat } from "../types";

interface CatSpriteProps {
  cat: Cat;
  onClick: () => void;
  id: string;
  position?: { x: number; y: number };
}

const CatSprite: React.FC<CatSpriteProps> = ({
  cat,
  onClick,
  id,
  position,
}) => {
  const [showGif, setShowGif] = useState(false);
  const touched = useRef(false);

  const handleClick = (e: React.FormEvent) => {
    // e.stopPropagation();
    if (touched.current) return;
    const audioCatClick = new Audio("/sounds/cat_click.mp3");
    audioCatClick.play();
    touched.current = true;
    setShowGif(true);
    setTimeout(() => {
      onClick();
    }, 500);
  };

  return (
    <div
      className="absolute z-30 transform cursor-pointer p-6 select-none"
      style={{
        transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      id={id}
      onClick={showGif ? undefined : handleClick}
      onTouchStart={showGif ? undefined : handleClick}
    >
      {showGif ? (
        <>
          <div
            className={`absolute text-lg font-bold ${
              cat.type === "common"
                ? "text-black"
                : cat.type === "rare"
                ? "text-goldBrand"
                : "text-purpleBrand"
            } animate-pop z-50 left-1/2 top-0 -translate-x-1/2`}
          >
            +{cat.points}
          </div>
          <img
            src="/assets/cat_click_animate.gif"
            alt="Effect"
            className="object-contain pointer-events-none w-32 h-32 select-none"
          />
        </>
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
