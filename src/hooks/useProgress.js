// src/hooks/useProgress.js
// Custom hook for reading/writing/resetting learning progress in localStorage.
// Progress schema:
// {
//   letters: {
//     a: { learned: bool, traced: bool, activity: bool, stars: number },
//     ...
//   },
//   totalStars: number,
//   lastUpdated: ISO string,
// }

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'abc_adventure_progress';

const defaultLetterProgress = () => ({
  learned: false,
  traced: false,
  activity: false,
  stars: 0,
});

const defaultProgress = () => ({
  letters: {},
  totalStars: 0,
  lastUpdated: new Date().toISOString(),
});

function safeReadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaultProgress();
    if (!parsed.letters || typeof parsed.letters !== 'object') {
      return defaultProgress();
    }
    return parsed;
  } catch {
    return defaultProgress();
  }
}

function safeWriteProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage might be full or unavailable; silently fail
  }
}

function computeTotalStars(letters) {
  return Object.values(letters).reduce((sum, l) => sum + (l?.stars ?? 0), 0);
}

export function useProgress() {
  const [progress, setProgressState] = useState(() => safeReadProgress());

  const getLetterProgress = useCallback(
    (letterId) => {
      return progress.letters[letterId] ?? defaultLetterProgress();
    },
    [progress]
  );

  const markLearned = useCallback((letterId) => {
    setProgressState((prev) => {
      const existing = prev.letters[letterId] ?? defaultLetterProgress();
      if (existing.learned) return prev; // already done
      const updated = {
        ...prev,
        letters: {
          ...prev.letters,
          [letterId]: { ...existing, learned: true, stars: existing.stars + 1 },
        },
        lastUpdated: new Date().toISOString(),
      };
      updated.totalStars = computeTotalStars(updated.letters);
      safeWriteProgress(updated);
      return updated;
    });
  }, []);

  const markTraced = useCallback((letterId) => {
    setProgressState((prev) => {
      const existing = prev.letters[letterId] ?? defaultLetterProgress();
      if (existing.traced) return prev;
      const updated = {
        ...prev,
        letters: {
          ...prev.letters,
          [letterId]: { ...existing, traced: true, stars: existing.stars + 1 },
        },
        lastUpdated: new Date().toISOString(),
      };
      updated.totalStars = computeTotalStars(updated.letters);
      safeWriteProgress(updated);
      return updated;
    });
  }, []);

  const markActivity = useCallback((letterId) => {
    setProgressState((prev) => {
      const existing = prev.letters[letterId] ?? defaultLetterProgress();
      if (existing.activity) return prev;
      const updated = {
        ...prev,
        letters: {
          ...prev.letters,
          [letterId]: {
            ...existing,
            activity: true,
            stars: existing.stars + 1,
          },
        },
        lastUpdated: new Date().toISOString(),
      };
      updated.totalStars = computeTotalStars(updated.letters);
      safeWriteProgress(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    safeWriteProgress(fresh);
    setProgressState(fresh);
  }, []);

  // Derived stats
  const completedLetters = Object.values(progress.letters).filter(
    (l) => l?.learned && l?.traced && l?.activity
  ).length;

  const completedLetterIds = Object.entries(progress.letters)
    .filter(([, l]) => l?.learned && l?.traced && l?.activity)
    .map(([id]) => id);

  return {
    progress,
    getLetterProgress,
    markLearned,
    markTraced,
    markActivity,
    resetProgress,
    completedLetters,
    completedLetterIds,
    totalStars: progress.totalStars,
  };
}

// Progress API persistence: localStorage key 'abc_learning_progress'.


// Star rewards: max 78 stars across 26 letters.

