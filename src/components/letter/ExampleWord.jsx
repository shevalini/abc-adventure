// src/components/letter/ExampleWord.jsx
import PronunciationButton from './PronunciationButton';

export default function ExampleWord({ letter }) {
  return (
    <div
      className="rounded-3xl p-6 flex flex-col items-center gap-4 text-center"
      style={{ background: letter.color.bg }}
    >
      {/* Emoji illustration */}
      <div className="text-8xl animate-float select-none" aria-hidden="true">
        {letter.emoji}
      </div>

      {/* Word */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Example Word
        </p>
        <p
          className="font-display text-4xl"
          style={{ color: letter.color.text }}
        >
          {letter.word}
        </p>
      </div>

      {/* Sentence */}
      <p className="text-gray-600 text-lg leading-relaxed max-w-xs">
        {letter.sentence}
      </p>

      {/* Hear word button */}
      <PronunciationButton
        text={letter.word}
        label={`🔊 Hear "${letter.word}"`}
        color={letter.color.text}
        bg="white"
      />
    </div>
  );
}
