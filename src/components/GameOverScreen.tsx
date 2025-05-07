import React, { useEffect, useState } from "react";
import { RefreshCw, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onSubmitEmail: (
    email: string,
    name: string,
    scoreId?: string | null
  ) => Promise<string | null>;
}

function getLatestUser(type: string) {
  let latestUser = null;
  let latestTimestamp = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key?.startsWith("user-")) {
      const user = JSON.parse(localStorage.getItem(key) || "{}");

      if (user.savedAt && user.savedAt > latestTimestamp) {
        latestTimestamp = user.savedAt;
        latestUser = { key, ...user };
      }
    }
  }

  if (latestUser) {
    if (type === "email") return latestUser.email;
    else if (type === "name") return latestUser.name;
  } else {
    return "";
  }
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onRestart,
  onSubmitEmail,
}) => {
  const [email, setEmail] = useState(getLatestUser("email"));
  const [name, setName] = useState(getLatestUser("name"));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(
    localStorage.getItem("submitted") !== "false"
  );
  const [error, setError] = useState("");
  const [scoreId, setScoreId] = useState<string | null>(
    localStorage.getItem("submitted") === "false"
      ? null
      : localStorage.getItem("submitted")
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (email && name && !submitted && !loading) {
      handleSubmit();
    }
  }, [submitted, loading]);

  const handleUpdateName = () => {
    setName("");
    setEmail("");
    setSubmitted(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    setLoading(true);
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    const generatedScore = await onSubmitEmail(email, name, scoreId);
    setScoreId(generatedScore);
    setSubmitted(true);
    localStorage.setItem("submitted", generatedScore ?? "true");
    setError("");
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden">
      <div className=" p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-white ">
        <h2 className="text-3xl font-bold text-center mb-2">Game Over!</h2>
        <div className="text-center mb-6">
          <p className="text-xl mb-1">Your Score</p>
          <p className="text-5xl font-bold text-yellow-300 mb-4">{score}</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {!submitted ? (
              <>
                <p className="text-center mb-4">
                  Submit your email to join the leaderboard!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What do we call you?"
                      className="w-full px-4 py-3 rounded-lg bg-white backdrop-blur-sm border border-white/20 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="w-full px-4 py-3 rounded-lg bg-white backdrop-blur-sm border border-white/20 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    {error && (
                      <p className="mt-1 text-red-300 text-sm">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className=" w-full relative inline-block text-lg group"
                  >
                    <span className=" w-full relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-white transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                      <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-purpleBrand"></span>
                      <span className="absolute left-0 w-screen h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                      <span className="relative">Submit Score</span>
                    </span>
                    <span
                      className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                      data-rounded="rounded-lg"
                    ></span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-300">
                      {`Nice try, ${name}! Want to go again?`}
                    </p>
                  </div>
                  <button
                    onClick={handleUpdateName}
                    className="mb-4 text-xs text-green-300 underline cursor-pointer rounded"
                  >
                    {`Not ${name}? You can update the user`}
                  </button>
                </div>
                <button
                  onClick={() => navigate("/leaderboard")}
                  className=" w-full relative inline-block text-lg group mt-2"
                >
                  <span className=" w-full relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-white transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-purpleBrand"></span>
                    <span className="absolute left-0 w-screen h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                    <span className="relative flex justify-center items-center">
                      <Trophy size={18} className="text-yellow-300 mr-2" />
                      Leaderboard
                    </span>
                  </span>
                  <span
                    className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                    data-rounded="rounded-lg"
                  ></span>
                </button>
              </>
            )}
          </>
        )}

        <button
          onClick={onRestart}
          className=" w-full relative inline-block text-lg group mt-2"
        >
          <span className=" w-full relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-white transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
            <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-purpleBrand"></span>
            <span className="absolute left-0 w-screen h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
            <span className="relative flex justify-center items-center">
              <RefreshCw size={18} className="mr-2" />
              Play Again
            </span>
          </span>
          <span
            className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
            data-rounded="rounded-lg"
          ></span>
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
