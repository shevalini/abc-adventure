// src/components/ui/CompletionModal.jsx
// Shown when a child earns all 3 stars for a letter.

import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function CompletionModal({ letter, onClose, nextLetter }) {
  const navigate = useNavigate();

  const handleNext = () => {
    onClose();
    if (nextLetter) {
      navigate(`/letter/${nextLetter.id}`);
    } else {
      // Finished the whole alphabet!
      navigate('/progress');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-bounce-in relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus-visible:outline-2 focus-visible:outline-gray-400"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration emoji */}
        <div className="text-7xl mb-3 animate-float" aria-hidden="true">🎉</div>

        <h2 id="completion-title" className="font-display text-3xl text-indigo-600 mb-1">
          Letter Complete!
        </h2>
        <p className="text-gray-500 mb-4">You learned:</p>

        {/* Letter display */}
        <div
          className="inline-flex items-baseline gap-3 rounded-2xl px-8 py-4 mb-4"
          style={{ background: letter.color.bg }}
        >
          <span className="font-display text-6xl" style={{ color: letter.color.text }}>
            {letter.uppercase}
          </span>
          <span className="font-display text-4xl opacity-60" style={{ color: letter.color.text }}>
            {letter.lowercase}
          </span>
          <span className="text-4xl" aria-hidden="true">{letter.emoji}</span>
        </div>

        {/* Stars */}
        <p className="text-gray-500 mb-2">You earned:</p>
        <div className="flex justify-center gap-1 mb-6">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="text-4xl animate-star-pop"
              style={{ animationDelay: `${i * 200}ms` }}
              aria-hidden="true"
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-2xl text-white font-display text-xl
                       bg-gradient-to-r from-indigo-500 to-purple-600
                       hover:from-indigo-600 hover:to-purple-700
                       transition-all active:scale-95 shadow-md
                       focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            {nextLetter ? `Next: ${nextLetter.uppercase} – ${nextLetter.word} →` : '🏆 See My Progress!'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-2xl text-indigo-500 bg-indigo-50 hover:bg-indigo-100
                       font-semibold transition-all focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            Stay here
          </button>
        </div>
      </div>
    </div>
  );
}
