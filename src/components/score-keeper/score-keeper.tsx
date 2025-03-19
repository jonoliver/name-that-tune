import { useState, useEffect, useMemo } from 'react';
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  RefreshIcon,
  RemoveAllIcon,
  SortIcon,
  UserPlusIcon,
} from '../icons/icons';
import './score-keeper.css';

interface Player {
  id: string;
  name: string;
  score: number;
}

enum SortBy {
  Name = 'name',
  Score = 'score',
}

const ScoreKeeper = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Name);

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
      if (sortBy === SortBy.Name) {
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
                  className={`sort-button ${
                    sortBy === SortBy.Name ? 'active' : ''
                  }`}
                  onClick={() => setSortBy(SortBy.Name)}
                >
                  <SortIcon /> Name
                </button>
                <button
                  className={`sort-button ${
                    sortBy === SortBy.Score ? 'active' : ''
                  }`}
                  onClick={() => setSortBy(SortBy.Score)}
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
