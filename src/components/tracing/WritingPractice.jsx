// src/components/tracing/WritingPractice.jsx
// Wraps two TracingCanvas sessions: uppercase then lowercase.
// Calls onComplete() when both are done.

import { useState } from 'react';
import TracingCanvas from './TracingCanvas';

export default function WritingPractice({ letter, onComplete }) {
  // phase: 'upper' | 'lower' | 'done'
  const [phase, setPhase] = useState('upper');

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center gap-6 py-8 animate-bounce-in">
        <div className="text-7xl animate-float" aria-hidden="true">🎉</div>
        <h2 className="font-display text-4xl text-indigo-600">Amazing Writing!</h2>
        <p className="text-gray-500 text-lg text-center max-w-xs">
          You traced both{' '}
          <strong style={{ color: letter.color.text }}>{letter.uppercase}</strong>{' '}
          and{' '}
          <strong style={{ color: letter.color.text }}>{letter.lowercase}</strong>!
        </p>
        <div className="flex gap-2 text-3xl" aria-hidden="true">⭐⭐⭐</div>
        <button
          onClick={onComplete}
          className="px-8 py-3 rounded-2xl text-white font-display text-xl
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     hover:from-indigo-600 hover:to-purple-700
                     transition-all active:scale-95 shadow-lg
                     focus-visible:outline-2 focus-visible:outline-indigo-400"
        >
          Next Activity! 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Phase indicator */}
      <div className="flex justify-center gap-3">
        <PhaseDot active={phase === 'upper'} done={phase === 'lower' || phase === 'done'} label="Uppercase" />
        <PhaseDot active={phase === 'lower'} done={phase === 'done'} label="Lowercase" />
      </div>

      {phase === 'upper' && (
        <TracingCanvas
          key="upper"
          letter={letter.uppercase}
          color={letter.color.text}
          onDone={() => setPhase('lower')}
        />
      )}

      {phase === 'lower' && (
        <div>
          <p className="text-center text-indigo-400 font-semibold mb-4 animate-fade-in-up">
            Great! Now try the lowercase letter.
          </p>
          <TracingCanvas
            key="lower"
            letter={letter.lowercase}
            color={letter.color.text}
            onDone={() => setPhase('done')}
          />
        </div>
      )}
    </div>
  );
}

function PhaseDot({ active, done, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-4 h-4 rounded-full transition-all ${
          done
            ? 'bg-green-400'
            : active
            ? 'bg-indigo-500 ring-2 ring-indigo-300'
            : 'bg-gray-200'
        }`}
        aria-hidden="true"
      />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}
