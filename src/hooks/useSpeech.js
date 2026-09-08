import { useCallback, useRef, useState, useEffect } from 'react';

export const SPEED_LEVELS = {
  slow: { id: 'slow', label: '🐢 Slow & Clear', shortLabel: '🐢 Slow', rate: 0.65 },
  extraSlow: { id: 'extraSlow', label: '🦥 Extra Slow', shortLabel: '🦥 Super Slow', rate: 0.50 },
  normal: { id: 'normal', label: '🐇 Normal', shortLabel: '🐇 Normal', rate: 0.85 },
};

const SPEED_STORAGE_KEY = 'abc_adventure_speech_speed';
const SPEED_ORDER = ['slow', 'extraSlow', 'normal'];

export function useSpeech() {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;
  const utteranceRef = useRef(null);

  const [speed, setSpeedState] = useState(() => {
    try {
      return localStorage.getItem(SPEED_STORAGE_KEY) || 'slow';
    } catch {
      return 'slow';
    }
  });

  const setSpeed = useCallback((newSpeed) => {
    if (!SPEED_LEVELS[newSpeed]) return;
    setSpeedState(newSpeed);
    try {
      localStorage.setItem(SPEED_STORAGE_KEY, newSpeed);
      window.dispatchEvent(new Event('abc-speech-speed-changed'));
    } catch {
      // ignore storage errors
    }
  }, []);

  const cycleSpeed = useCallback(() => {
    const currentIndex = SPEED_ORDER.indexOf(speed);
    const nextIndex = (currentIndex + 1) % SPEED_ORDER.length;
    setSpeed(SPEED_ORDER[nextIndex]);
  }, [speed, setSpeed]);

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(SPEED_STORAGE_KEY);
        if (saved && saved !== speed && SPEED_LEVELS[saved]) {
          setSpeedState(saved);
        }
      } catch {}
    };
    window.addEventListener('abc-speech-speed-changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('abc-speech-speed-changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [speed]);

  const currentRate = SPEED_LEVELS[speed]?.rate ?? 0.65;

  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(
    (text, options = {}) => {
      if (!supported) return;

      // Cancel any currently playing speech
      window.speechSynthesis.cancel();
      setIsSpeaking(false);

      const rate = options.rate ?? currentRate;
      const pitch = options.pitch ?? 1.05;
      const lang = options.lang ?? 'en-US';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = lang;

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (options.onStart) options.onStart();
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        if (options.onEnd) options.onEnd();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (options.onError) options.onError();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported, currentRate]
  );

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [supported]);

  return {
    speak,
    cancel,
    supported,
    isSpeaking,
    speed,
    setSpeed,
    cycleSpeed,
    currentRate,
    speedConfig: SPEED_LEVELS[speed] || SPEED_LEVELS.slow,
  };
}


