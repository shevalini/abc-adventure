// src/hooks/useSpeech.js
// Custom hook wrapping the Web Speech Synthesis API.
// Prevents overlapping speech by cancelling any in-progress utterance before starting a new one.
// Gracefully degrades when speech synthesis is unavailable.

import { useCallback, useRef } from 'react';

export function useSpeech() {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;
  const utteranceRef = useRef(null);

  const speak = useCallback(
    (text, { rate = 0.85, pitch = 1.1, lang = 'en-US' } = {}) => {
      if (!supported) return;

      // Cancel any currently playing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = lang;

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported]
  );

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  return { speak, cancel, supported };
}
