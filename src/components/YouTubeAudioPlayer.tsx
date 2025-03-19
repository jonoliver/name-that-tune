import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import './YouTubeAudioPlayer.css';
import './common.css';

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const VolumeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

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
  const seekBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePlaybackProgress = () => {
      if (isPlaying && !seeking && playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const progress = duration > 0 ? currentTime / duration : 0;
        setPlayed(progress);
      }
    };

    const interval = setInterval(updatePlaybackProgress, 250); // More frequent updates for smoother progress

    return () => clearInterval(interval);
  }, [isPlaying, seeking, duration]);

  useEffect(() => {
    if (seekBarRef.current) {
      // Ensure the width is at least 0.5% for visibility at low values
      const progressWidth = `${Math.max(played * 100, 0.5)}%`;
      seekBarRef.current.style.width = progressWidth;
    }
  }, [played]);

  useEffect(() => {
    if (volumeBarRef.current) {
      // Ensure the width is at least 0.5% for visibility at low values
      const volumeWidth = `${Math.max(volume * 100, 0.5)}%`;
      volumeBarRef.current.style.width = volumeWidth;
    }
  }, [volume]);

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
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // Update the volume indicator immediately for a more responsive feel
    if (volumeBarRef.current) {
      const volumeWidth = `${Math.max(newVolume * 100, 0.5)}%`;
      volumeBarRef.current.style.width = volumeWidth;
    }
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
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    // Update the progress indicator immediately for a more responsive feel
    if (seekBarRef.current) {
      const progressWidth = `${Math.max(newPlayed * 100, 0.5)}%`;
      seekBarRef.current.style.width = progressWidth;
    }
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
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <div className="seek-container">
                <div className="time-display">{formatTime(currentTime)}</div>
                <div className="slider-container">
                  <div className="progress-bar">
                    <div className="progress-fill" ref={seekBarRef}></div>
                  </div>
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
                </div>
                <div className="time-display">{formatTime(duration)}</div>
              </div>

              <div className="volume-control">
                <VolumeIcon />
                <div className="slider-container">
                  <div className="progress-bar volume-progress-bar">
                    <div className="progress-fill" ref={volumeBarRef}></div>
                  </div>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeAudioPlayer;
