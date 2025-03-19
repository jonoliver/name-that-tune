import { useState, useEffect, useMemo } from 'react';
import './ScoreKeeper.css';
import './common.css';

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
      // Primary sort
      if (sortBy === 'name') {
        const nameComparison = a.name.localeCompare(b.name);
        // If names are the same, sort by score (descending) as secondary sort
        return nameComparison !== 0 ? nameComparison : b.score - a.score;
      } else {
        const scoreComparison = b.score - a.score;
        // If scores are the same, sort by name as secondary sort
        return scoreComparison !== 0
          ? scoreComparison
          : a.name.localeCompare(b.name);
      }
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

  const toggleSort = () => {
    setSortBy(sortBy === 'name' ? 'score' : 'name');
  };

  return (
    <div className="score-keeper component-card">
      <h2 className="component-title">Scores</h2>

      <form onSubmit={handleAddPlayer} className="add-player-form form-row">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="player-input"
        />
        <button type="submit">Add Player</button>
      </form>

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
                  Name
                </button>
                <button
                  className={`sort-button ${
                    sortBy === 'score' ? 'active' : ''
                  }`}
                  onClick={() => setSortBy('score')}
                >
                  Score
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
                        className="score-btn"
                      >
                        −
                      </button>
                      <button
                        onClick={() => handleScoreChange(player.id, 1)}
                        className="score-btn"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemovePlayer(player.id)}
                      aria-label={`Remove ${player.name}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="score-actions">
            <button onClick={resetScores} className="reset-btn">
              Reset Scores
            </button>
            <button onClick={resetAll} className="reset-btn danger">
              Remove All Players
            </button>
          </div>
        </>
      ) : (
        <p className="no-players">No players added yet.</p>
      )}
    </div>
  );
};

export default ScoreKeeper;
