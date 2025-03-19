import YouTubeAudioPlayer from './components/YouTubeAudioPlayer';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Name That Tune</h1>
      </header>
      <main className="container">
        <YouTubeAudioPlayer />
      </main>
      <footer>
        <p>Play audio from YouTube videos</p>
      </footer>
    </div>
  );
};

export default App;
