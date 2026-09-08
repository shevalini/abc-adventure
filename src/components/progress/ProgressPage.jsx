// src/components/progress/ProgressPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Trash2, AlertTriangle } from 'lucide-react';
import Header from '../layout/Header';
import ProgressBar from './ProgressBar';
import { alphabetData } from '../../data/alphabetData';

export default function ProgressPage({ progressApi }) {
  const navigate = useNavigate();
  const { totalStars, completedLetters, getLetterProgress, resetProgress } = progressApi;
  const [showConfirm, setShowConfirm] = useState(false);

  const learnedCount = alphabetData.filter((l) => getLetterProgress(l.id).learned).length;
  const tracedCount  = alphabetData.filter((l) => getLetterProgress(l.id).traced).length;
  const activityCount = alphabetData.filter((l) => getLetterProgress(l.id).activity).length;

  const handleReset = () => {
    resetProgress();
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header totalStars={totalStars} />

      <main id="main-content" className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 font-semibold mb-4 sm:mb-6 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-400 rounded"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </button>

        <h1 className="font-display text-3xl sm:text-5xl text-indigo-600 mb-1 sm:mb-2 text-center">My Progress</h1>
        <p className="text-center text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Keep it up, superstar! 🌟</p>

        {/* Stars summary */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md mb-6 text-center animate-fade-in-up">
          <div className="flex justify-center gap-1 mb-3 flex-wrap">
            {Array.from({ length: Math.min(totalStars, 30) }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400 animate-star-pop"
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
            {totalStars > 30 && (
              <span className="text-yellow-500 font-bold text-sm sm:text-base">+{totalStars - 30} more!</span>
            )}
          </div>
          <p className="font-display text-3xl sm:text-4xl text-yellow-500">{totalStars} Stars Earned!</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Max possible: {26 * 3} stars</p>
        </div>

        {/* Progress bars */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md mb-6 flex flex-col gap-4 animate-fade-in-up">
          <h2 className="font-display text-xl sm:text-2xl text-gray-700">Learning Overview</h2>
          <ProgressBar value={completedLetters} max={26} label="Letters Completed" color="#6366f1" />
          <ProgressBar value={learnedCount}   max={26} label="Letters Learned"   color="#8b5cf6" />
          <ProgressBar value={tracedCount}    max={26} label="Letters Traced"    color="#ec4899" />
          <ProgressBar value={activityCount}  max={26} label="Activities Done"   color="#f59e0b" />
        </div>

        {/* Per-letter grid */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md mb-6 animate-fade-in-up">
          <h2 className="font-display text-xl sm:text-2xl text-gray-700 mb-4">Letter-by-Letter</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {alphabetData.map((letter) => {
              const lp = getLetterProgress(letter.id);
              const stars = lp.stars ?? 0;
              const done = lp.learned && lp.traced && lp.activity;
              return (
                <button
                  key={letter.id}
                  onClick={() => navigate(`/letter/${letter.id}`)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:scale-105 focus-visible:outline-2"
                  style={{
                    background: done ? `linear-gradient(135deg, ${letter.color.from}22, ${letter.color.to}22)` : '#f8fafc',
                    outlineColor: letter.color.from,
                  }}
                  aria-label={`Letter ${letter.uppercase}: ${stars} stars`}
                >
                  <span className="font-display text-2xl" style={{ color: letter.color.text }}>
                    {letter.uppercase}
                  </span>
                  <span className="text-xs">
                    {stars === 0 ? '○○○' : stars === 1 ? '⭐○○' : stars === 2 ? '⭐⭐○' : '⭐⭐⭐'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div className="text-center">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-2xl
                         text-red-500 border border-red-200 hover:bg-red-50 font-semibold transition-all
                         focus-visible:outline-2 focus-visible:outline-red-400"
            >
              <Trash2 className="w-4 h-4" /> Reset All Progress
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-sm mx-auto animate-bounce-in">
              <div className="flex items-center gap-2 text-red-600 font-semibold mb-3">
                <AlertTriangle className="w-5 h-5" />
                Are you sure? This will erase all stars and progress!
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all focus-visible:outline-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-red-400"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
