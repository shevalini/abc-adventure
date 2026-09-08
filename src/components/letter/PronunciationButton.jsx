// src/components/letter/PronunciationButton.jsx
import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

export default function PronunciationButton({
  text,
  label,
  color = '#6366f1',
  bg = '#eef2ff',
  size = 'md',
  rate,
  isPhonic = false,
  isWord = false,
  className = '',
}) {
  const { speak, speakPhonic, speakWord, supported } = useSpeech();
  const [playing, setPlaying] = useState(false);

  if (!supported) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 bg-gray-100 text-sm"
        aria-label="Speech not supported in this browser"
      >
        <VolumeX className="w-4 h-4" />
        <span>Sound unavailable</span>
      </div>
    );
  }

  const handleSpeak = async () => {
    setPlaying(true);
    try {
      if (isPhonic) {
        await speakPhonic(text, { rate });
      } else if (isWord) {
        await speakWord(text, { rate });
      } else {
        await speak(text, { rate });
      }
    } finally {
      setPlaying(false);
    }
  };

  const sizeClasses =
    size === 'lg'
      ? 'px-6 py-3 text-lg gap-3'
      : size === 'sm'
      ? 'px-3 py-1.5 text-sm gap-1.5'
      : 'px-4 py-2 text-base gap-2';

  return (
    <button
      onClick={handleSpeak}
      className={`flex items-center ${sizeClasses} rounded-2xl font-semibold font-body
                  transition-all duration-150 active:scale-95 hover:brightness-95
                  focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    playing ? 'ring-4 ring-offset-1 animate-pulse' : ''
                  } ${className}`}
      style={{ background: bg, color, outlineColor: color }}
      aria-label={label || `Hear ${text}`}
    >
      <Volume2
        className={`${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} ${
          playing ? 'animate-bounce text-emerald-500' : ''
        }`}
        aria-hidden="true"
      />
      <span>{label || `🔊 Hear`}</span>
    </button>
  );
}

