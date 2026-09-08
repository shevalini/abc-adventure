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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-indigo-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Logo / Title */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 sm:gap-2 group shrink-0"
          aria-label="Go to home page"
        >
          <span className="text-2xl sm:text-3xl select-none">🔤</span>
          <span className="font-display text-lg sm:text-2xl text-indigo-600 group-hover:text-indigo-500 transition-colors">
            ABC Adventure
          </span>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Voice speed selector */}
          {supported && speedConfig && (
            <button
              onClick={handleToggleSpeed}
              title={`Voice speed: ${speedConfig.label || 'Slow'}. Tap to change.`}
              aria-label={`Voice speed: ${speedConfig.label || 'Slow'}. Tap to change.`}
              className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-sm min-h-[34px] sm:min-h-[36px]"
            >
              <span className="whitespace-nowrap">{speedConfig.shortLabel || '🐢 Slow'}</span>
            </button>
          )}

          {/* Stars badge */}
          <div
            className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold text-yellow-700 min-h-[34px] sm:min-h-[36px]"
            aria-label={`${totalStars} stars earned`}
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 shrink-0" />
            <span>{totalStars}</span>
          </div>

          {/* Home button (hide on home) */}
          {!isHome && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-indigo-400 min-h-[34px] sm:min-h-[36px]"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}


// Accessibility: Header keyboard focus rings configured.


// Navigation header: sticky top positioning with backdrop blur.

