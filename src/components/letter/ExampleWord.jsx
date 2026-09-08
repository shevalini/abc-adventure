// src/components/letter/ExampleWord.jsx
import PronunciationButton from './PronunciationButton';

export default function ExampleWord({ letter }) {
  return (
    <div
      className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 text-center"
      style={{ background: letter.color.bg }}
    >
      {/* Emoji illustration */}
      <div className="text-7xl sm:text-8xl animate-float select-none" aria-hidden="true">
        {letter.emoji}
      </div>

      {/* Word */}
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Example Word
        </p>
        <p
          className="font-display text-3xl sm:text-4xl"
          style={{ color: letter.color.text }}
        >
          {letter.word}
        </p>
      </div>

      {/* Sentence */}
      <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xs">
        {letter.sentence}
      </p>

      {/* Hear buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto justify-center mt-1">
        <PronunciationButton
          text={letter.word}
          label={`🔊 Hear "${letter.word}"`}
          color={letter.color.text}
          bg="white"
        />
        <PronunciationButton
          text={letter.sentence}
          label="📖 Hear Sentence"
          color="#4b5563"
          bg="white"
        />
      </div>
    </div>
  );
}
