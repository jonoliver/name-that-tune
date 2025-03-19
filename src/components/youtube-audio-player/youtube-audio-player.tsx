import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import { PlayIcon, PauseIcon, VolumeIcon } from '../icons/icons';
import './youtube-audio-player.css';

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
  const [videoTitle, setVideoTitle] = useState('');
  const [showTitle, setShowTitle] = useState(false);

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

    // Reset title states
    setVideoTitle('');
    setShowTitle(false);

    // If the URL is the same as the current one, we need to reset the player
    if (url === inputUrl) {
      // Reset state values
      setLoaded(false);
      setPlayed(0);
      setDuration(0);
      // Set URL to empty string temporarily to force ReactPlayer to reload
      setUrl('');
      // Use setTimeout to set the URL back after a brief delay
      setTimeout(() => setUrl(inputUrl), 50);
    } else {
      // Different URL, set it directly
      setUrl(inputUrl);
      setLoaded(false);
      setPlayed(0);
    }
    setError('');
  };

  const handleReady = () => {
    setLoaded(true);

    try {
      // Access the YouTube player instance and get video data
      const player = playerRef.current?.getInternalPlayer();
      if (player && player.getVideoData) {
        const title = player.getVideoData().title;
        setVideoTitle(title || 'Unknown Title');
      } else {
        setVideoTitle('Title Unavailable');
      }
    } catch (e) {
      setVideoTitle('Title Unavailable');
    }
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

  const toggleShowTitle = () => {
    setShowTitle(!showTitle);
  };

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

              <div className="title-container">
                <button onClick={toggleShowTitle} className="show-title-btn">
                  {showTitle ? 'Hide Title' : 'Show Title'}
                </button>
                {showTitle && videoTitle && (
                  <div className="video-title">{videoTitle}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeAudioPlayer;
