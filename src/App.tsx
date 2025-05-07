import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import GameScreen from "./components/GameScreen";
import GameOverScreen from "./components/GameOverScreen";
import Leaderboard from "./components/Leaderboard";
import { sendVerificationEmail } from "./utils/gameUtils";
import { initAudio } from "./utils/audioManager";

function App() {
  const [gameState, setGameState] = useState<{
    status: "landing" | "playing" | "gameOver" | "leaderboard";
    score: number;
    lives: number;
    playerEmail: string | null;
    emailVerified: boolean;
  }>({
    status: "landing",
    score: 0,
    lives: 3,
    playerEmail: null,
    emailVerified: false,
  });
  useEffect(() => {
    initAudio();
  }, []);

  // Reset game state
  const resetGame = () => {
    localStorage.setItem("submitted", "false");
    setGameState((prevState) => ({
      ...prevState,
      status: "playing",
      score: 0,
      lives: 3,
    }));
  };

  // Start game from landing page
  const startGame = () => {
    resetGame();
  };

  // Update score
  const updateScore = (points: number) => {
    setGameState((prevState) => ({
      ...prevState,
      score: prevState.score + points,
    }));
  };

  // Update lives
  const updateLives = () => {
    setGameState((prevState) => {
      const newLives = prevState.lives - 1;

      // Check for game over
      // if (newLives <= 0) {
      //   return {
      //     ...prevState,
      //     lives: 0,
      //     status: 'gameOver'
      //   };
      // }

      return {
        ...prevState,
        lives: newLives,
      };
    });
  };

  // Handle game over
  const handleGameOver = () => {
    setGameState((prevState) => ({
      ...prevState,
      status: "gameOver",
    }));
  };

  // Handle email submission
  const handleSubmitEmail = async (
    email: string,
    name: string,
    scoreId?: string | null
  ) => {
    setGameState((prevState) => ({
      ...prevState,
      playerEmail: email,
      playerName: name,
    }));

    // Simulate sending verification email
    try {
      const generatedScoreId = await sendVerificationEmail(
        email,
        name,
        gameState.score,
        scoreId
      );

      if (generatedScoreId) {
        setGameState((prevState) => ({
          ...prevState,
          emailVerified: true,
        }));

        return generatedScoreId;
      }
    } catch (error) {
      console.error("Failed to verify email:", error);
    }
    return null;
  };

  // Render based on game state
  return (
    <div
      className="bg-violetBrand bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/landing_bg.svg')" }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <>
              {gameState.status === "landing" && (
                <LandingPage startGame={startGame} />
              )}

              {gameState.status === "playing" && (
                <GameScreen
                  score={gameState.score}
                  lives={gameState.lives}
                  onScoreUpdate={updateScore}
                  onLivesUpdate={updateLives}
                  onGameOver={handleGameOver}
                />
              )}

              {gameState.status === "gameOver" && (
                <GameOverScreen
                  score={gameState.score}
                  onRestart={resetGame}
                  onSubmitEmail={handleSubmitEmail}
                />
              )}
            </>
          }
        />
        <Route
          path="leaderboard"
          element={
            <Leaderboard
              currentScore={gameState.score}
              playerEmail={gameState.playerEmail}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
