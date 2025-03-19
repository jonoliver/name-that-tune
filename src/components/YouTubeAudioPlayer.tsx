import { useState, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import './YouTubeAudioPlayer.css';

const YouTubeAudioPlayer = () => {
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [loaded, setLoaded] = useState(false);

  const playerRef = useRef<ReactPlayer | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!ReactPlayer.canPlay(inputUrl)) {
      setError('Invalid YouTube URL');
      return;
    }

    setUrl(inputUrl);
    setError('');
    setLoaded(false);
  };

  const handleReady = () => {
    setLoaded(true);
    setIsPlaying(true);
  };

  const handleError = () => {
    setError('Error loading video. Please check the URL and try again.');
    setLoaded(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="youtube-audio-player">
      <h1>YouTube Audio Player</h1>

      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="url-input"
        />
        <button type="submit">Load Audio</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {url && (
        <div className="player-container">
          <div className="player-wrapper">
            <ReactPlayer
              ref={playerRef}
              url={url}
              playing={isPlaying}
              controls={false}
              volume={volume}
              width="0"
              height="0"
              onReady={handleReady}
              onError={handleError}
            />
          </div>

          {loaded && (
            <div className="controls">
              <button onClick={handlePlayPause} className="play-pause-btn">
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <div className="volume-control">
                <span>Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeAudioPlayer;
