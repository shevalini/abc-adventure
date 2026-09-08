// src/components/letter/PhonicsAudioPlayer.jsx
// Teacher-guided phonics and pronunciation audio player for children.
// Implements:
// 1. 🔊 Hear Sound: focuses ONLY on the slow, clear phonics sound (/b/)
// 2. 🔊 Hear Word: speaks the example word ("Ball")
// 3. 👩‍🏫 Listen & Repeat (Teacher Mode):
//    "B" → [pause] → clear /b/ sound → [pause to repeat] → "Ball"
// Highlights each step visually as it plays.
// Automatically cancels any ongoing speech on new clicks to prevent voice overlap.

import { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Pause, RotateCcw } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

export default function PhonicsAudioPlayer({ letter, showTeacherMode = true, layout = 'full' }) {
  const {
    speakPhonic,
    speakWord,
    playTeacherSequence,
    cancel,
    supported,
    isSpeaking,
    speedConfig,
  } = useSpeech();

  const [activeMode, setActiveMode] = useState(null); // 'sound' | 'word' | 'teacher' | null
  const [teacherStep, setTeacherStep] = useState(null); // 'letter' | 'phonic' | 'word' | null

  if (!supported) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-gray-400 bg-gray-100 text-sm">
        <VolumeX className="w-5 h-5" />
        <span>Sound unavailable in this browser</span>
      </div>
    );
  }

  // 1. Hear Sound Only (Slow, gentle phonics sound /b/)
  const handlePlaySound = async () => {
    cancel();
    setActiveMode('sound');
    setTeacherStep('phonic');
    try {
      await speakPhonic(letter.phonicSound);
    } finally {
      setActiveMode(null);
      setTeacherStep(null);
    }
  };

  // 2. Hear Word Only ("Ball")
  const handlePlayWord = async () => {
    cancel();
    setActiveMode('word');
    setTeacherStep('word');
    try {
      await speakWord(letter.word);
    } finally {
      setActiveMode(null);
      setTeacherStep(null);
    }
  };

  // 3. Teacher Guided Mode: "B" → sound → pause → "Ball"
  const handlePlayTeacher = async () => {
    if (activeMode === 'teacher') {
      cancel();
      setActiveMode(null);
      setTeacherStep(null);
      return;
    }

    cancel();
    setActiveMode('teacher');

    try {
      await playTeacherSequence({
        letterName: letter.uppercase,
        phonicSound: letter.phonicSound,
        word: letter.word,
        onStepChange: (step) => setTeacherStep(step),
        onComplete: () => {
          setActiveMode(null);
          setTeacherStep(null);
        },
      });
    } catch {
      setActiveMode(null);
      setTeacherStep(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Visual Teacher Sequence Display */}
      <div className="w-full bg-white rounded-2xl p-3 sm:p-4 border-2 border-indigo-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2.5">
          Phonics Sound & Word
        </p>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          {/* Step 1: Letter */}
          <div
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all duration-200 ${
              teacherStep === 'letter'
                ? 'bg-amber-50 border-amber-400 ring-4 ring-amber-200 scale-105 shadow-md'
                : 'bg-gray-50 border-gray-100'
            }`}
          >
            <span className="text-xs font-bold text-gray-400 uppercase">Letter</span>
            <span
              className="font-display text-2xl sm:text-3xl leading-tight mt-0.5"
              style={{ color: letter.color.text }}
            >
              {letter.uppercase} {letter.lowercase}
            </span>
            {teacherStep === 'letter' && (
              <span className="text-[11px] font-bold text-amber-600 animate-pulse mt-0.5">
                Saying letter...
              </span>
            )}
          </div>

          {/* Step 2: Phonics Sound */}
          <div
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all duration-200 ${
              teacherStep === 'phonic'
                ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200 scale-105 shadow-md'
                : 'bg-gray-50 border-gray-100'
            }`}
          >
            <span className="text-xs font-bold text-emerald-600 uppercase">Sound</span>
            <span className="font-display text-2xl sm:text-3xl text-emerald-600 leading-tight mt-0.5">
              {letter.phonicDisplay}
            </span>
            {teacherStep === 'phonic' && (
              <span className="text-[11px] font-bold text-emerald-600 animate-pulse mt-0.5">
                Listen & Repeat! 👂
              </span>
            )}
          </div>

          {/* Step 3: Example Word */}
          <div
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all duration-200 ${
              teacherStep === 'word'
                ? 'bg-indigo-50 border-indigo-400 ring-4 ring-indigo-200 scale-105 shadow-md'
                : 'bg-gray-50 border-gray-100'
            }`}
          >
            <span className="text-xs font-bold text-gray-400 uppercase">Word</span>
            <span className="font-display text-xl sm:text-2xl text-indigo-700 leading-tight mt-0.5 truncate max-w-full">
              {letter.word}
            </span>
            {teacherStep === 'word' && (
              <span className="text-[11px] font-bold text-indigo-600 animate-pulse mt-0.5">
                Word sound!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Buttons: Hear Sound & Hear Word */}
      <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center">
        {/* 🔊 Hear Sound: Focuses ONLY on the phonics sound */}
        <button
          onClick={handlePlaySound}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-display text-base sm:text-lg transition-all duration-150 active:scale-95 shadow-sm border-2 ${
            activeMode === 'sound'
              ? 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-200 shadow-md'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
          }`}
          aria-label={`Hear phonics sound ${letter.phonicDisplay} for letter ${letter.uppercase}`}
        >
          <Volume2
            className={`w-5 h-5 ${activeMode === 'sound' ? 'animate-bounce' : ''}`}
            aria-hidden="true"
          />
          <span>🔊 Hear Sound ({letter.phonicDisplay})</span>
        </button>

        {/* 🔊 Hear Word: Example Word only */}
        <button
          onClick={handlePlayWord}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-display text-base sm:text-lg transition-all duration-150 active:scale-95 shadow-sm border-2 ${
            activeMode === 'word'
              ? 'bg-indigo-600 border-indigo-700 text-white ring-4 ring-indigo-200 shadow-md'
              : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
          }`}
          aria-label={`Hear example word ${letter.word}`}
        >
          <Volume2
            className={`w-5 h-5 ${activeMode === 'word' ? 'animate-bounce' : ''}`}
            aria-hidden="true"
          />
          <span>🔊 Hear Word ("{letter.word}")</span>
        </button>
      </div>

      {/* 👩‍🏫 Teacher Guided: Listen & Repeat Sequence */}
      {showTeacherMode && (
        <button
          onClick={handlePlayTeacher}
          className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-display text-base sm:text-lg text-white transition-all duration-150 active:scale-95 shadow-md ${
            activeMode === 'teacher'
              ? 'bg-amber-500 hover:bg-amber-600 ring-4 ring-amber-200'
              : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-600 hover:brightness-105'
          }`}
          aria-label={
            activeMode === 'teacher'
              ? 'Pause teacher lesson'
              : `Start teacher lesson: ${letter.uppercase}, sound ${letter.phonicDisplay}, then ${letter.word}`
          }
        >
          {activeMode === 'teacher' ? (
            <>
              <Pause className="w-5 h-5" aria-hidden="true" />
              <span>Stop Teacher Lesson</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <span>👩‍🏫 Teacher Lesson: Listen & Repeat</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
