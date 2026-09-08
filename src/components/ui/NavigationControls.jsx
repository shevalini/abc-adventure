// src/components/ui/NavigationControls.jsx
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

export default function NavigationControls({ prevLetter, nextLetter }) {
  const navigate = useNavigate();

  return (
    <nav
      className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100"
      aria-label="Letter navigation"
    >
      {/* Prev */}
      {prevLetter ? (
        <button
          onClick={() => navigate(`/letter/${prevLetter.id}`)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200
                     text-gray-700 font-semibold transition-all active:scale-95
                     focus-visible:outline-2 focus-visible:outline-gray-400"
          aria-label={`Previous letter: ${prevLetter.uppercase}`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">{prevLetter.uppercase}</span>
          <span className="sm:hidden">Prev</span>
        </button>
      ) : (
        <div aria-hidden="true" />
      )}

      {/* Home */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100
                   text-indigo-600 font-semibold transition-all active:scale-95
                   focus-visible:outline-2 focus-visible:outline-indigo-400"
        aria-label="Go to home page"
      >
        <Home className="w-5 h-5" />
        <span className="hidden sm:inline">Home</span>
      </button>

      {/* Next */}
      {nextLetter ? (
        <button
          onClick={() => navigate(`/letter/${nextLetter.id}`)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700
                     text-white font-semibold transition-all active:scale-95
                     focus-visible:outline-2 focus-visible:outline-indigo-400"
          aria-label={`Next letter: ${nextLetter.uppercase}`}
        >
          <span className="hidden sm:inline">{nextLetter.uppercase}</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={() => navigate('/progress')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500
                     text-white font-semibold transition-all active:scale-95
                     focus-visible:outline-2 focus-visible:outline-yellow-400"
          aria-label="View your progress – you completed all letters!"
        >
          🏆 Progress
        </button>
      )}
    </nav>
  );
}

// Navigation: Prev, Home, and Next actions.

