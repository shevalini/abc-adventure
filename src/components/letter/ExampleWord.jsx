// src/components/letter/ExampleWord.jsx
import PhonicsAudioPlayer from './PhonicsAudioPlayer';
import PronunciationButton from './PronunciationButton';

export default function ExampleWord({ letter }) {
  return (
    <div
      className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center gap-4 text-center"
      style={{ background: letter.color.bg }}
    >
      {/* Emoji illustration */}
      <div className="text-7xl sm:text-8xl animate-float select-none" aria-hidden="true">
        {letter.emoji}
      </div>

      {/* Word and phonic label */}
      <div>
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-1">
          Example Word
        </p>
        <p
          className="font-display text-4xl sm:text-5xl"
          style={{ color: letter.color.text }}
        >
          {letter.word}
        </p>
      </div>

      {/* Sentence */}
      <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm">
        {letter.sentence}
      </p>

      {/* Educational Phonics & Audio System */}
      <div className="w-full max-w-md">
        <PhonicsAudioPlayer letter={letter} showTeacherMode={true} />
      </div>

      {/* Hear full sentence slowly */}
      <div className="pt-2 border-t border-gray-200/60 w-full max-w-md flex justify-center">
        <PronunciationButton
          text={letter.sentence}
          label="📖 Read Story Sentence"
          color="#4b5563"
          bg="white"
          size="sm"
        />
      </div>
    </div>
  );
}
