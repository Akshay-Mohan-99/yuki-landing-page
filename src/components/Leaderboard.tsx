import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Player, Scores } from '../types';
import { getLeaderboardData } from '../utils/gameUtils';
import { Link } from 'react-router-dom';

interface LeaderboardProps {
  currentScore: number;
  playerEmail: string | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore, playerEmail }) => {
  const [leaderboard, setLeaderboard] = useState<Scores[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email: string, id: string } | null>(null);
  const [playerRank, setPlayerRank] = useState<number | null>(null);

  useEffect(() => {
    // Simulate loading leaderboard data
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboardData();
        setLeaderboard(data);

        const currentLocalUser = JSON.parse(localStorage.getItem(`user-${playerEmail}`) || '');
        
        // Find player's rank if they have submitted an email
        if (currentLocalUser?.email) {
          setCurrentUser(currentLocalUser);
          const playerIndex = data.findIndex(player => player.user_id === currentLocalUser.id);
          if (playerIndex !== -1) {
            setPlayerRank(playerIndex + 1);
          }
        }
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [playerEmail]);

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <button 
              className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-center">Leaderboard</h1>
          
          <div className="w-10"></div> {/* Empty div for flex spacing */}
        </div>
        
        {playerEmail && currentScore > 0 && (
          <div className="mb-8 text-black bg-white rounded-xl p-4 border border-2 border-gray-900 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Your Score</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-75">Email: {playerEmail}</p>
                <p className="text-2xl font-bold text-yellow-300">{currentScore} points</p>
              </div>
              {playerRank && (
                <div className="bg-purpleBrand rounded-full px-4 py-2 flex items-center">
                  <Trophy size={18} className="text-yellow-300 mr-2" />
                  <span className="font-bold text-white">Rank #{playerRank}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="bg-white text-black border-2 border-gray-900 rounded-xl overflow-x-auto shadow-xl">
            <table className="w-full">
              <thead>
                <tr className="bg-transparent">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Player</th>
                  <th className="px-4 py-3 text-right">Score</th>
                  <th className="px-4 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => (
                  <tr 
                    key={index} 
                    className={`${
                      player.user_id === currentUser?.id ? 'bg-purpleBrand' : index % 2 === 0 ? 'bg-black/40' : 'bg-black/50'
                    }  transition-colors text-white hover:bg-black`}
                  >
                    <td className="px-4 py-3">
                      {index < 3 ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-300' :
                          'bg-amber-700'
                        } text-black font-bold`}>
                          {index + 1}
                        </span>
                      ) : (
                        index + 1
                      )}
                    </td>
                    <td className="px-4 py-3">{player.name}</td>
                    <td className="px-4 py-3 text-right font-bold">{player.score}</td>
                    <td className="px-4 py-3 text-right text-sm opacity-75">{player.date}</td>
                  </tr>
                ))}
                
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No scores yet. Be the first to join the leaderboard!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;