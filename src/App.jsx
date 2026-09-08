// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useProgress } from './hooks/useProgress';
import HomePage from './components/home/HomePage';
import AlphabetGrid from './components/alphabet/AlphabetGrid';
import LetterLearningPage from './components/letter/LetterLearningPage';
import ProgressPage from './components/progress/ProgressPage';

// Progress context passed as prop-drilling for simplicity (no Redux needed)
function App() {
  const progressApi = useProgress();

  return (
    <BrowserRouter>
      {/* Skip-to-content link for keyboard/screen reader users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Routes>
        <Route
          path="/"
          element={<HomePage progressApi={progressApi} />}
        />
        <Route
          path="/alphabet"
          element={<AlphabetGrid progressApi={progressApi} />}
        />
        <Route
          path="/letter/:id"
          element={<LetterLearningPage progressApi={progressApi} />}
        />
        <Route
          path="/progress"
          element={<ProgressPage progressApi={progressApi} />}
        />
        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
