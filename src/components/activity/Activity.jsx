// src/components/activity/Activity.jsx
// Mini quiz activity with 3 randomly-selected question types.

import { useState, useMemo } from 'react';
import { alphabetData } from '../../data/alphabetData';

// Returns 2 random other letters excluding the target
function getRandomOthers(targetId, count = 2) {
  const others = alphabetData.filter((l) => l.id !== targetId);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Shuffles an array
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestion(letter) {
  const types = ['identify_letter', 'word_starts_with', 'find_letter'];
  const type = types[Math.floor(Math.random() * types.length)];
  const others = getRandomOthers(letter.id);

  if (type === 'identify_letter') {
    const options = shuffle([
      { value: letter.uppercase, correct: true, label: letter.uppercase },
      ...others.map((o) => ({ value: o.uppercase, correct: false, label: o.uppercase })),
    ]);
    return {
      type,
      question: `Which one is the letter ${letter.uppercase}?`,
      options,
    };
  }

  if (type === 'word_starts_with') {
    const options = shuffle([
      { value: letter.word, correct: true, label: `${letter.emoji} ${letter.word}` },
      ...others.map((o) => ({ value: o.word, correct: false, label: `${o.emoji} ${o.word}` })),
    ]);
    return {
      type,
      question: `Which word starts with ${letter.uppercase}?`,
      options,
    };
  }

  // find_letter: show uppercase options
  const options = shuffle([
    { value: letter.lowercase, correct: true, label: letter.lowercase },
    ...others.map((o) => ({ value: o.lowercase, correct: false, label: o.lowercase })),
  ]);
  return {
    type,
    question: `Find the lowercase letter ${letter.uppercase.toLowerCase()}`,
    options,
  };
}

export default function Activity({ letter, onComplete }) {
  const question = useMemo(() => buildQuestion(letter), [letter]);
  const [selected, setSelected] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (opt) => {
    if (revealed) return;
    setSelected(opt.value);

    if (opt.correct) {
      setRevealed(true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        // Reveal answer after 2 wrong attempts
        setRevealed(true);
      }
    }
  };

  const correct = selected && question.options.find((o) => o.value === selected)?.correct;
  const isLarge = question.type === 'identify_letter' || question.type === 'find_letter';

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Question */}
      <div className="text-center animate-fade-in-up">
        <span className="text-4xl" aria-hidden="true">🎯</span>
        <h2 className="font-display text-2xl md:text-3xl text-indigo-700 mt-2">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-wrap justify-center gap-3 max-w-xs" role="group" aria-label="Answer choices">
        {question.options.map((opt) => {
          const isSelected = selected === opt.value;
          const showCorrect = revealed && opt.correct;
          const showWrong = revealed && isSelected && !opt.correct;

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              className={`
                rounded-2xl font-display transition-all duration-200 active:scale-95
                focus-visible:outline-2 focus-visible:outline-indigo-400 shadow-sm
                ${isLarge ? 'w-24 h-24 text-5xl' : 'px-6 py-4 text-2xl'}
                ${showCorrect
                  ? 'bg-green-100 border-4 border-green-400 text-green-700 scale-105'
                  : showWrong
                  ? 'bg-red-100 border-4 border-red-400 text-red-700'
                  : isSelected
                  ? 'bg-indigo-100 border-4 border-indigo-400 text-indigo-700'
                  : 'bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-800'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Option: ${opt.label}`}
            >
              {opt.label}
              {showCorrect && <span className="block text-lg mt-1" aria-hidden="true">✅</span>}
              {showWrong && <span className="block text-lg mt-1" aria-hidden="true">❌</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {revealed && (
        <div
          className="animate-bounce-in text-center rounded-2xl px-6 py-4 w-full max-w-xs"
          style={{
            background: correct ? '#f0fdf4' : '#fff7ed',
            border: `2px solid ${correct ? '#86efac' : '#fed7aa'}`,
          }}
          role="status"
          aria-live="polite"
        >
          {correct ? (
            <>
              <p className="font-display text-2xl text-green-600">🎉 Great job!</p>
              <p className="text-green-500 text-sm mt-1">You got it right!</p>
            </>
          ) : (
            <>
              <p className="font-display text-2xl text-orange-600">😊 Almost!</p>
              <p className="text-orange-500 text-sm mt-1">
                The answer was{' '}
                <strong>{question.options.find((o) => o.correct)?.label}</strong>
              </p>
            </>
          )}

          <button
            onClick={onComplete}
            className="mt-4 w-full py-3 rounded-2xl text-white font-display text-lg
                       bg-gradient-to-r from-indigo-500 to-purple-600
                       hover:from-indigo-600 hover:to-purple-700 transition-all active:scale-95
                       focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            {correct ? 'Collect Stars! ⭐' : 'Next →'}
          </button>
        </div>
      )}

      {/* Hint after 1 wrong */}
      {!revealed && attempts === 1 && (
        <p className="text-orange-500 text-sm animate-fade-in-up" role="alert">
          Almost! Try one more time 😊
        </p>
      )}
    </div>
  );
}

// Question builder: randomly selects identify, starts-with, or find-letter.

