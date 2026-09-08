// src/hooks/useSpeech.js
// Kid-friendly speech engine wrapping Web Speech Synthesis API.
// Features:
// - Cancel-before-speak guard: never overlaps multiple audio voices
// - Teacher sequence mode: Letter → pause → Phonics Sound → pause → Word
// - Dedicated speakPhonic with slow, clear, gentle enunciation
// - Pause before and after sounds for comfortable listening and repetition
// - Multi-speed preference persistence (Slow / Extra Slow / Normal)

import { useCallback, useRef, useState, useEffect } from 'react';

export const SPEED_LEVELS = {
  slow: { id: 'slow', label: '🐢 Slow & Clear', shortLabel: '🐢 Slow', rate: 0.62, phonicRate: 0.56 },
  extraSlow: { id: 'extraSlow', label: '🦥 Extra Slow', shortLabel: '🦥 Super Slow', rate: 0.50, phonicRate: 0.48 },
  normal: { id: 'normal', label: '🐇 Normal', shortLabel: '🐇 Normal', rate: 0.82, phonicRate: 0.72 },
};

const SPEED_STORAGE_KEY = 'abc_adventure_speech_speed';
const SPEED_ORDER = ['slow', 'extraSlow', 'normal'];

export function useSpeech() {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);
  const isCancelledRef = useRef(false);

  const [speed, setSpeedState] = useState(() => {
    try {
      return localStorage.getItem(SPEED_STORAGE_KEY) || 'slow';
    } catch {
      return 'slow';
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTeacherStep, setActiveTeacherStep] = useState(null); // null | 'letter' | 'phonic' | 'word'

  const setSpeed = useCallback((newSpeed) => {
    if (!SPEED_LEVELS[newSpeed]) return;
    setSpeedState(newSpeed);
    try {
      localStorage.setItem(SPEED_STORAGE_KEY, newSpeed);
      window.dispatchEvent(new Event('abc-speech-speed-changed'));
    } catch {
      // ignore
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

  const speedConfig = SPEED_LEVELS[speed] || SPEED_LEVELS.slow;
  const currentRate = speedConfig.rate;
  const currentPhonicRate = speedConfig.phonicRate;

  // Fully cancel ongoing speech and any pending sequence timer
  const cancel = useCallback(() => {
    isCancelledRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (supported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveTeacherStep(null);
  }, [supported]);

  // Internal utter function returning a Promise that resolves when speech ends
  const utter = useCallback(
    (text, { rate, pitch = 1.02, volume = 1.0, lang = 'en-US', pauseBefore = 120, pauseAfter = 200 } = {}) => {
      return new Promise((resolve) => {
        if (!supported || !text) {
          resolve();
          return;
        }

        // Cancel previous speech completely
        cancel();
        isCancelledRef.current = false;
        setIsSpeaking(true);

        timeoutRef.current = setTimeout(() => {
          if (isCancelledRef.current) {
            resolve();
            return;
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = rate ?? currentRate;
          utterance.pitch = pitch;
          utterance.volume = volume;
          utterance.lang = lang;

          utterance.onend = () => {
            timeoutRef.current = setTimeout(() => {
              setIsSpeaking(false);
              resolve();
            }, pauseAfter);
          };

          utterance.onerror = () => {
            setIsSpeaking(false);
            resolve();
          };

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }, pauseBefore);
      });
    },
    [supported, cancel, currentRate]
  );

  // Standard speak with options
  const speak = useCallback(
    (text, options = {}) => {
      return utter(text, {
        rate: options.rate ?? currentRate,
        pitch: options.pitch ?? 1.02,
        pauseBefore: options.pauseBefore ?? 100,
        pauseAfter: options.pauseAfter ?? 200,
        ...options,
      });
    },
    [utter, currentRate]
  );

  // 🔊 Dedicated Phonics Sound speaker (slower, ultra-clear phoneme pronunciation)
  const speakPhonic = useCallback(
    (phonicSound, options = {}) => {
      return utter(phonicSound, {
        rate: options.rate ?? currentPhonicRate,
        pitch: 1.0,
        volume: 1.0,
        pauseBefore: 150,
        pauseAfter: 350,
        ...options,
      });
    },
    [utter, currentPhonicRate]
  );

  // 🔊 Dedicated Word speaker
  const speakWord = useCallback(
    (word, options = {}) => {
      return utter(word, {
        rate: options.rate ?? currentRate,
        pitch: 1.04,
        volume: 1.0,
        pauseBefore: 120,
        pauseAfter: 250,
        ...options,
      });
    },
    [utter, currentRate]
  );

  // 👩‍🏫 Teacher Guided Learning Sequence:
  // Step 1: Letter name "B" → pause (650ms)
  // Step 2: Clear Phonics sound "/b/" ("buh") → pause (800ms to repeat!)
  // Step 3: Example word "Ball"
  const playTeacherSequence = useCallback(
    async ({ letterName, phonicSound, word, onStepChange, onComplete }) => {
      cancel();
      isCancelledRef.current = false;
      setIsSpeaking(true);

      const notifyStep = (step) => {
        setActiveTeacherStep(step);
        if (onStepChange) onStepChange(step);
      };

      try {
        // Step 1: Letter Name
        notifyStep('letter');
        await utter(letterName, {
          rate: currentRate,
          pitch: 1.05,
          pauseBefore: 100,
          pauseAfter: 600,
        });
        if (isCancelledRef.current) return;

        // Step 2: Phonics Sound (slow, clear /b/ sound)
        notifyStep('phonic');
        await utter(phonicSound, {
          rate: currentPhonicRate,
          pitch: 1.0,
          pauseBefore: 150,
          pauseAfter: 800, // Generous pause giving the child time to listen and repeat!
        });
        if (isCancelledRef.current) return;

        // Step 3: Example Word
        notifyStep('word');
        await utter(word, {
          rate: currentRate,
          pitch: 1.04,
          pauseBefore: 120,
          pauseAfter: 400,
        });
      } finally {
        if (!isCancelledRef.current) {
          notifyStep(null);
          setIsSpeaking(false);
          if (onComplete) onComplete();
        }
      }
    },
    [cancel, utter, currentRate, currentPhonicRate]
  );

  return {
    speak,
    speakPhonic,
    speakWord,
    playTeacherSequence,
    cancel,
    supported,
    isSpeaking,
    activeTeacherStep,
    speed,
    setSpeed,
    cycleSpeed,
    currentRate,
    currentPhonicRate,
    speedConfig,
  };
}

// Speech synthesis fallback: handled gracefully in all modern browsers.

