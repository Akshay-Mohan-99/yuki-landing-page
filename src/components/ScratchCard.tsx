import React, { useRef, useEffect, useState } from "react";

interface ScratchCardProps {
  foregroundImage: string;
  backgroundImage: string;
  brushSize: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  foregroundImage,
  backgroundImage,
  brushSize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cleared, setCleared] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize canvas and draw the foreground image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Load and draw foreground image
    const img = new Image();
    img.crossOrigin = "anonymous"; // Add crossOrigin attribute
    img.src = foregroundImage;
    img.onload = () => {
      const canvasRatio = canvas.width / canvas.height;
      const imageRatio = img.width / img.height;

      let sx = 0,
        sy = 0,
        sWidth = img.width,
        sHeight = img.height;

      if (canvasRatio > imageRatio) {
        // Canvas is wider, crop height
        sHeight = img.width / canvasRatio;
        sy = (img.height - sHeight) / 2;
      } else {
        // Canvas is taller, crop width
        sWidth = img.height * canvasRatio;
        sx = (img.width - sWidth) / 2;
      }

      ctx.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
      ctx.globalCompositeOperation = "destination-out";
    };
  }, [foregroundImage, canvasSize]);

  // Track percentage cleared
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const getPercentageCleared = () => {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixelData.length; i += 4) {
          if (pixelData[i] === 0) {
            transparentPixels++;
          }
        }

        return (transparentPixels / (pixelData.length / 4)) * 100;
      } catch (error) {
        console.error("Error getting image data:", error);
        return 0;
      }
    };

    // Check percentage cleared periodically
    const interval = setInterval(() => {
      const percentage = getPercentageCleared();
      setCleared(percentage);

      // Auto reveal if more than 50% is scratched
      if (percentage > 50) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [canvasSize]);

  // Mouse/Touch handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clientX, clientY;

    if ("touches" in e) {
      // e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full touch-none cursor-pointer"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {cleared < 50 && (
        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-lg">
          <span className="bg-black bg-opacity-50 px-4 py-2 rounded-full">
            Scratch to reveal
          </span>
        </div>
      )}
    </div>
  );
};

export default ScratchCard;
