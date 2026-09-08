// src/components/layout/Header.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Star } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

export default function Header({ totalStars = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { speedConfig, cycleSpeed, speak, supported } = useSpeech();

  const handleToggleSpeed = () => {
    cycleSpeed();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Title */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group"
          aria-label="Go to home page"
        >
          <span className="text-3xl select-none">🔤</span>
          <span className="font-display text-2xl text-indigo-600 group-hover:text-indigo-500 transition-colors">
            ABC Adventure
          </span>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          {/* Voice speed selector */}
          {supported && (
            <button
              onClick={handleToggleSpeed}
              title={`Voice speed: ${speedConfig.label}. Click to change.`}
              aria-label={`Voice speed: ${speedConfig.label}. Click to change.`}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm"
            >
              <span>{speedConfig.shortLabel}</span>
            </button>
          )}

          {/* Stars badge */}
          <div
            className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1"
            aria-label={`${totalStars} stars earned`}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-yellow-600 text-sm">{totalStars}</span>
          </div>

          {/* Home button (hide on home) */}
          {!isHome && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-indigo-400"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

