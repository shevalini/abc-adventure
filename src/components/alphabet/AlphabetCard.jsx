// src/components/alphabet/AlphabetCard.jsx
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function AlphabetCard({ letter, letterProgress }) {
  const navigate = useNavigate();
  const { learned, traced, activity } = letterProgress;
  const stars = letterProgress.stars ?? 0;
  const completed = learned && traced && activity;

  return (
    <button
      className="letter-card bg-white rounded-2xl p-2.5 sm:p-4 flex flex-col items-center gap-1 sm:gap-1.5 shadow-sm
                 border-2 focus-visible:outline-2 focus-visible:outline-offset-2 relative overflow-hidden active:scale-95 transition-transform"
      style={{
        borderColor: completed ? letter.color.from : '#e2e8f0',
        background: completed
          ? `linear-gradient(145deg, ${letter.color.bg}, white)`
          : 'white',
        outlineColor: letter.color.from,
      }}
      onClick={() => navigate(`/letter/${letter.id}`)}
      aria-label={`Letter ${letter.uppercase} – ${letter.word}${completed ? ', completed' : ''}`}
    >
      {/* Completion badge */}
      {completed && (
        <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 animate-bounce-in" aria-hidden="true">
          <CheckCircle2
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: letter.color.from }}
            fill={letter.color.bg}
          />
        </span>
      )}

      {/* Letters */}
      <div className="flex items-baseline gap-1 sm:gap-2">
        <span
          className="font-display text-3xl sm:text-5xl leading-none"
          style={{ color: letter.color.text }}
          aria-hidden="true"
        >
          {letter.uppercase}
        </span>
        <span
          className="font-display text-xl sm:text-3xl leading-none opacity-60"
          style={{ color: letter.color.text }}
          aria-hidden="true"
        >
          {letter.lowercase}
        </span>
      </div>

      {/* Emoji */}
      <span className="text-xl sm:text-2xl select-none" aria-hidden="true">
        {letter.emoji}
      </span>

      {/* Word */}
      <span className="text-[10px] sm:text-xs font-semibold text-gray-500 tracking-wide uppercase truncate max-w-full">
        {letter.word}
      </span>

      {/* Stars row */}
      <div className="flex gap-0.5" aria-label={`${stars} of 3 stars`}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`text-xs sm:text-sm ${i < stars ? 'opacity-100' : 'opacity-20'}`}
            aria-hidden="true"
          >
            ⭐
          </span>
        ))}
      </div>
    </button>
  );
}

// Card elevation: subtle shadow with active tap scale feedback.

