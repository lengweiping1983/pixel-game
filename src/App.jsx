import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Game from './views/Game';
import Result from './views/Result';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
