import YouTubeAudioPlayer from './components/youtube-audio-player/youtube-audio-player.tsx';
import ScoreKeeper from './components/score-keeper/score-keeper.tsx';
import './app.css';

const MusicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="5.5" cy="17.5" r="2.5"></circle>
    <circle cx="17.5" cy="15.5" r="2.5"></circle>
    <path d="M8 17V5l12-2v12"></path>
  </svg>
);

const App = () => {
  return (
    <div className="app">
      <header>
        <div className="title-container">
          <MusicIcon />
          <h1>Name That YouTune</h1>
        </div>
        <p className="subtitle">
          Test your music knowledge with friends using music from YouTube!
        </p>
      </header>
      <main>
        <div className="container">
          <div className="app-content">
            <div className="player-column">
              <YouTubeAudioPlayer />
              <div className="instructions">
                <h2>How to play</h2>
                <ol>
                  <li>Add players to the Scores panel</li>
                  <li>Paste a YouTube URL above</li>
                  <li>Press play and test your friends' music knowledge</li>
                  <li>The first person to guess the song wins a point</li>
                  <li>Keep score using the Scores panel</li>
                </ol>
              </div>
            </div>
            <div className="score-column">
              <ScoreKeeper />
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>
          Report bugs or suggest features on{' '}
          <a href="https://github.com/jonoliver/name-that-youtune/issues">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
