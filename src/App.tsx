import YouTubeAudioPlayer from './components/YouTubeAudioPlayer';
import ScoreKeeper from './components/ScoreKeeper';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Name That Tune</h1>
      </header>
      <main>
        <div className="container">
          <div className="app-content">
            <div className="player-column">
              <YouTubeAudioPlayer />
            </div>
            <div className="score-column">
              <ScoreKeeper />
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>Play audio from YouTube videos</p>
      </footer>
    </div>
  );
};

export default App;
