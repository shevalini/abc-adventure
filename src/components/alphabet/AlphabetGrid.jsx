// src/components/alphabet/AlphabetGrid.jsx
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '../layout/Header';
import AlphabetCard from './AlphabetCard';
import { alphabetData } from '../../data/alphabetData';

export default function AlphabetGrid({ progressApi }) {
  const navigate = useNavigate();
  const { totalStars, completedLetters, getLetterProgress } = progressApi;

  const pct = Math.round((completedLetters / 26) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header totalStars={totalStars} />

      <main id="main-content" className="max-w-5xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 font-semibold mb-6 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-400 rounded"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </button>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="font-display text-5xl text-indigo-600 mb-2">Choose a Letter!</h1>
          <p className="text-gray-500 text-lg">
            {completedLetters === 0
              ? 'Start with letter A!'
              : `You've completed ${completedLetters}/26 letters 🎉`}
          </p>

          {/* Progress bar */}
          <div className="max-w-md mx-auto mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-700"
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pct}% of alphabet completed`}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{pct}% complete</p>
          </div>
        </div>

        {/* Grid */}
        <section
          aria-label="Alphabet selection grid"
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
        >
          {alphabetData.map((letter) => (
            <AlphabetCard
              key={letter.id}
              letter={letter}
              letterProgress={getLetterProgress(letter.id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

// AlphabetGrid: renders full A-Z letter cards.

