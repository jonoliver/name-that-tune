import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import './YouTubeAudioPlayer.css';
import './common.css';

const YouTubeAudioPlayer = () => {
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && !seeking && playerRef.current) {
        setPlayed(playerRef.current.getCurrentTime() / duration);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, seeking, duration]);

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
    setPlayed(0);
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

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(played);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';

    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');

    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const currentTime = duration * played;

  return (
    <div className="youtube-audio-player component-card">
      <h2 className="component-title">Audio Player</h2>

      <form onSubmit={handleSubmit} className="url-form form-row">
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
              onDuration={handleDuration}
            />
          </div>

          {loaded && (
            <div className="controls control-panel">
              <button onClick={handlePlayPause} className="play-pause-btn">
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <div className="seek-container">
                <div className="time-display">{formatTime(currentTime)}</div>
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step="any"
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                  onTouchEnd={handleSeekMouseUp}
                  className="seek-slider"
                />
                <div className="time-display">{formatTime(duration)}</div>
              </div>

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
