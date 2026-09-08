// src/components/letter/LetterLearningPage.jsx
// Main learning page for a single letter.
// Tabs: Learn → Listen → Trace → Play
// Awards stars and shows CompletionModal when all 3 are earned.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Volume2, PenLine, Gamepad2 } from 'lucide-react';
import Header from '../layout/Header';
import ExampleWord from './ExampleWord';
import PhonicsAudioPlayer from './PhonicsAudioPlayer';
import PronunciationButton from './PronunciationButton';
import WritingPractice from '../tracing/WritingPractice';
import Activity from '../activity/Activity';
import NavigationControls from '../ui/NavigationControls';
import CompletionModal from '../ui/CompletionModal';
import { getLetterById, getAdjacentLetters } from '../../data/alphabetData';

const TABS = [
  { id: 'learn',  label: 'Learn',  icon: BookOpen,  emoji: '📖' },
  { id: 'listen', label: 'Listen', icon: Volume2,   emoji: '🔊' },
  { id: 'trace',  label: 'Trace',  icon: PenLine,   emoji: '✍️' },
  { id: 'play',   label: 'Play',   icon: Gamepad2,  emoji: '🎮' },
];

export default function LetterLearningPage({ progressApi }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const letter = getLetterById(id);
  const { prev, next } = getAdjacentLetters(id);

  const { getLetterProgress, markLearned, markTraced, markActivity, totalStars } = progressApi;
  const lp = getLetterProgress(id);

  const [activeTab, setActiveTab] = useState('learn');
  const [showModal, setShowModal] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Reset tab when letter changes
  useEffect(() => {
    setActiveTab('learn');
    setShowModal(false);
    setJustCompleted(false);
  }, [id]);

  // Watch for completion
  useEffect(() => {
    const lp2 = progressApi.getLetterProgress(id);
    if (lp2.learned && lp2.traced && lp2.activity && !justCompleted) {
      setJustCompleted(true);
      setTimeout(() => setShowModal(true), 400);
    }
  }, [progressApi.progress, id, justCompleted]); // eslint-disable-line

  // 404 guard
  if (!letter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">😕</p>
        <h1 className="font-display text-3xl text-gray-600">Letter not found!</h1>
        <button
          onClick={() => navigate('/alphabet')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold"
        >
          Back to Alphabet
        </button>
      </div>
    );
  }

  const handleLearnDone = () => {
    markLearned(id);
    setActiveTab('listen');
  };

  const handleListenDone = () => {
    setActiveTab('trace');
  };

  const handleTraceDone = () => {
    markTraced(id);
    setActiveTab('play');
  };

  const handleActivityDone = () => {
    markActivity(id);
  };

  const tabDoneMap = {
    learn:  lp.learned,
    listen: lp.learned, // unlocked after learn
    trace:  lp.traced,
    play:   lp.activity,
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${letter.color.bg} 0%, #f8fafc 60%)`,
      }}
    >
      <Header totalStars={totalStars} />

      <main id="main-content" className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Letter hero */}
        <section className="text-center mb-4 sm:mb-6 animate-fade-in-up">
          <div className="inline-flex items-baseline gap-2 sm:gap-3">
            <span
              className="font-display leading-none select-none"
              style={{ fontSize: 'clamp(4.5rem, 16vw, 8rem)', color: letter.color.text }}
              aria-label={`Uppercase ${letter.uppercase}`}
            >
              {letter.uppercase}
            </span>
            <span
              className="font-display leading-none select-none opacity-60"
              style={{ fontSize: 'clamp(2.75rem, 10vw, 5.5rem)', color: letter.color.text }}
              aria-label={`Lowercase ${letter.lowercase}`}
            >
              {letter.lowercase}
            </span>
          </div>
          <p className="text-gray-500 font-semibold text-base sm:text-lg mt-1">
            {letter.uppercase} is for{' '}
            <span style={{ color: letter.color.text }}>{letter.word}</span>{' '}
            {letter.emoji}
          </p>
        </section>

        {/* Tabs */}
        <nav className="flex rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm mb-4 sm:mb-6" aria-label="Learning sections">
          {TABS.map((tab) => {
            const done = tabDoneMap[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn flex-1 py-2 sm:py-3 flex flex-col items-center gap-0.5 text-xs sm:text-sm font-semibold transition-all relative
                  ${isActive
                    ? 'active text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                style={isActive ? { background: `linear-gradient(135deg, ${letter.color.from}, ${letter.color.to})` } : {}}
                aria-selected={isActive}
                aria-label={`${tab.label} section${done ? ' – completed' : ''}`}
                role="tab"
              >
                <span className="text-base sm:text-lg" aria-hidden="true">{tab.emoji}</span>
                <span>{tab.label}</span>
                {done && (
                  <span
                    className="absolute top-1 right-1 text-xs"
                    aria-hidden="true"
                  >
                    ✅
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab panels */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 min-h-[360px]">

          {/* LEARN tab */}
          {activeTab === 'learn' && (
            <section aria-label="Learn tab" className="animate-fade-in-up flex flex-col gap-5 sm:gap-6">
              <ExampleWord letter={letter} />
              {!lp.learned && (
                <button
                  onClick={handleLearnDone}
                  className="w-full py-3 rounded-2xl text-white font-display text-xl
                             transition-all active:scale-95 shadow-md hover:brightness-110
                             focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: `linear-gradient(135deg, ${letter.color.from}, ${letter.color.to})` }}
                  aria-label="Mark this letter as learned and continue to Listen"
                >
                  I learned it! ⭐
                </button>
              )}
              {lp.learned && (
                <div className="text-center text-green-500 font-semibold animate-fade-in-up">
                  ✅ Learned! Move to the next tab.
                </div>
              )}
            </section>
          )}

          {/* LISTEN tab */}
          {activeTab === 'listen' && (
            <section aria-label="Listen tab" className="animate-fade-in-up flex flex-col items-center gap-6">
              <div className="text-center">
                <span className="text-4xl" aria-hidden="true">👂</span>
                <h2 className="font-display text-2xl sm:text-3xl text-gray-800 mt-1">
                  Listen & Repeat the Sound!
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-sm">
                  Listen to the gentle sound for <strong style={{ color: letter.color.text }}>{letter.uppercase}</strong>, then practice saying it!
                </p>
              </div>

              {/* Dedicated Phonics Audio Engine */}
              <div className="w-full max-w-md">
                <PhonicsAudioPlayer letter={letter} showTeacherMode={true} />
              </div>

              <button
                onClick={handleListenDone}
                className="w-full max-w-md py-3 rounded-2xl text-white font-display text-lg sm:text-xl
                           transition-all active:scale-95 shadow-md hover:brightness-110
                           focus-visible:outline-2 focus-visible:outline-offset-2 mt-2"
                style={{ background: `linear-gradient(135deg, ${letter.color.from}, ${letter.color.to})` }}
              >
                Ready to write! ✍️
              </button>
            </section>
          )}

          {/* TRACE tab */}
          {activeTab === 'trace' && (
            <section aria-label="Trace tab" className="animate-fade-in-up">
              {!lp.traced ? (
                <WritingPractice letter={letter} onComplete={handleTraceDone} />
              ) : (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="text-6xl animate-float" aria-hidden="true">✍️</div>
                  <p className="font-display text-2xl text-green-600">Writing Practice Done!</p>
                  <p className="text-gray-500">You already practiced writing {letter.uppercase} and {letter.lowercase}.</p>
                  <WritingPractice letter={letter} onComplete={handleTraceDone} />
                </div>
              )}
            </section>
          )}

          {/* PLAY tab */}
          {activeTab === 'play' && (
            <section aria-label="Play tab" className="animate-fade-in-up">
              {!lp.activity ? (
                <Activity letter={letter} onComplete={handleActivityDone} />
              ) : (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="text-7xl animate-float" aria-hidden="true">🏆</div>
                  <p className="font-display text-3xl text-indigo-600">Activity Complete!</p>
                  <p className="text-gray-500">You completed all activities for {letter.word}!</p>
                  <div className="flex gap-1 text-3xl" aria-label="3 stars earned">⭐⭐⭐</div>
                  {next && (
                    <button
                      onClick={() => navigate(`/letter/${next.id}`)}
                      className="mt-2 px-8 py-3 rounded-2xl text-white font-display text-xl
                                 bg-gradient-to-r from-indigo-500 to-purple-600
                                 hover:brightness-110 transition-all active:scale-95 shadow-md
                                 focus-visible:outline-2 focus-visible:outline-indigo-400"
                    >
                      Next Letter: {next.uppercase} {next.emoji} →
                    </button>
                  )}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Navigation */}
        <NavigationControls prevLetter={prev} nextLetter={next} />
      </main>

      {/* Completion Modal */}
      {showModal && (
        <CompletionModal
          letter={letter}
          nextLetter={next}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// Learning sections: Learn, Listen, Trace, and Play.

