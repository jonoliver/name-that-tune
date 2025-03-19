import { useState, useEffect, useMemo } from 'react';
import './score-keeper.css';

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6L5 6 21 6"></path>
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
  </svg>
);

const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"></path>
    <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"></path>
  </svg>
);

const RemoveAllIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 5h10"></path>
    <path d="M11 9h7"></path>
    <path d="M11 13h4"></path>
    <path d="M3 17l3 3 3-3"></path>
    <path d="M6 18V4"></path>
  </svg>
);

const UserPlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

interface Player {
  id: string;
  name: string;
  score: number;
}

type SortBy = 'name' | 'score';

const ScoreKeeper = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');

  useEffect(() => {
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (sortBy === 'name') {
        const nameComparison = a.name.localeCompare(b.name);
        return nameComparison !== 0 ? nameComparison : b.score - a.score;
      }
      const scoreComparison = b.score - a.score;
      return scoreComparison !== 0
        ? scoreComparison
        : a.name.localeCompare(b.name);
    });
  }, [players, sortBy]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      score: 0,
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const handleScoreChange = (id: string, amount: number) => {
    setPlayers(
      players.map((player) =>
        player.id === id
          ? { ...player, score: Math.max(0, player.score + amount) }
          : player
      )
    );
  };

  const resetScores = () => {
    if (window.confirm('Are you sure you want to reset all scores?')) {
      setPlayers(players.map((player) => ({ ...player, score: 0 })));
    }
  };

  const resetAll = () => {
    if (window.confirm('Are you sure you want to remove all players?')) {
      setPlayers([]);
    }
  };

  return (
    <div className="score-keeper component-card">
      <h2 className="component-title">Scores</h2>

      {players.length > 0 ? (
        <>
          <div className="players-list">
            <div className="players-header">
              <div className="sort-controls">
                <span className="sort-label">Sort by:</span>
                <button
                  className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
                  onClick={() => setSortBy('name')}
                >
                  <SortIcon /> Name
                </button>
                <button
                  className={`sort-button ${
                    sortBy === 'score' ? 'active' : ''
                  }`}
                  onClick={() => setSortBy('score')}
                >
                  <SortIcon /> Score
                </button>
              </div>
              <span className="player-count">
                {players.length} {players.length === 1 ? 'player' : 'players'}
              </span>
            </div>
            {sortedPlayers.map((player) => (
              <div key={player.id} className="player-card control-panel">
                <div className="player-row">
                  <div className="score-display">
                    <span className="score">{player.score}</span>
                  </div>

                  <div className="player-name-section">
                    <span className="player-name">{player.name}</span>
                  </div>

                  <div className="controls-section">
                    <div className="score-buttons">
                      <button
                        onClick={() => handleScoreChange(player.id, -1)}
                        disabled={player.score <= 0}
                        className="score-btn minus-btn"
                        aria-label="Decrease score"
                      >
                        <MinusIcon />
                      </button>
                      <button
                        onClick={() => handleScoreChange(player.id, 1)}
                        className="score-btn plus-btn"
                        aria-label="Increase score"
                      >
                        <PlusIcon />
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemovePlayer(player.id)}
                      aria-label={`Remove ${player.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="score-actions">
            <button onClick={resetScores} className="reset-btn">
              <RefreshIcon /> Reset Scores
            </button>
            <button onClick={resetAll} className="reset-btn danger">
              <RemoveAllIcon /> Remove All
            </button>
          </div>
        </>
      ) : (
        <p className="no-players">No players added yet.</p>
      )}
      <form onSubmit={handleAddPlayer} className="add-player-form form-row">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="player-input"
        />
        <button type="submit" className="add-player-btn">
          <UserPlusIcon />
          Add
        </button>
      </form>
    </div>
  );
};

export default ScoreKeeper;
