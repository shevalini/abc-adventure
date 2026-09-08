// src/components/home/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import { BookOpen, PenLine, BarChart3, Star } from 'lucide-react';
import Header from '../layout/Header';
import { alphabetData } from '../../data/alphabetData';

export default function HomePage({ progressApi }) {
  const navigate = useNavigate();
  const { totalStars, completedLetters } = progressApi;

  const pct = Math.round((completedLetters / 26) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header totalStars={totalStars} />

      <main id="main-content" className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          {/* Big animated emoji */}
          <div className="text-6xl sm:text-8xl mb-3 sm:mb-4 animate-float select-none" aria-hidden="true">
            🌟
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-shimmer mb-2 sm:mb-3 leading-tight">
            ABC Adventure
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-indigo-500 font-semibold mb-2 font-body">
            Learn • Listen • Trace • Play
          </p>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-md mx-auto">
            Discover all 26 letters of the English alphabet through fun, interactive lessons!
          </p>
        </section>

        {/* ── Progress summary (if started) ────────────────────── */}
        {completedLetters > 0 && (
          <section
            className="bg-white rounded-3xl p-5 shadow-md mb-10 animate-bounce-in flex flex-col sm:flex-row items-center gap-4"
            aria-label="Your learning progress"
          >
            <div className="text-5xl select-none" aria-hidden="true">🏆</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-lg text-gray-800">
                You've completed <span className="text-indigo-600">{completedLetters}</span> of 26 letters!
              </p>
              <div className="w-full bg-gray-100 rounded-full h-3 mt-2 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${pct}% complete`}
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-2xl text-yellow-500">{totalStars}</span>
            </div>
          </section>
        )}

        {/* ── CTA Buttons ──────────────────────────────────────── */}
        <section className="grid sm:grid-cols-3 gap-4 mb-12" aria-label="Main navigation options">
          <CTAButton
            icon="📚"
            label="Start Learning"
            subtitle="Learn all 26 letters"
            gradient="from-indigo-500 to-purple-600"
            onClick={() => navigate('/alphabet')}
            id="btn-start-learning"
          />
          <CTAButton
            icon="✍️"
            label="Practice Writing"
            subtitle="Trace & draw letters"
            gradient="from-pink-500 to-rose-500"
            onClick={() => navigate('/alphabet')}
            id="btn-practice-writing"
          />
          <CTAButton
            icon="⭐"
            label="My Progress"
            subtitle={`${totalStars} stars earned`}
            gradient="from-amber-400 to-orange-500"
            onClick={() => navigate('/progress')}
            id="btn-my-progress"
          />
        </section>

        {/* ── Alphabet Preview ─────────────────────────────────── */}
        <section aria-label="Alphabet preview" className="mb-8">
          <h2 className="font-display text-3xl text-center text-gray-700 mb-6">
            All 26 Letters Await! 🎉
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {alphabetData.map((letter, i) => {
              const lp = progressApi.getLetterProgress(letter.id);
              const done = lp.learned && lp.traced && lp.activity;
              return (
                <button
                  key={letter.id}
                  onClick={() => navigate(`/letter/${letter.id}`)}
                  className="w-11 h-11 rounded-xl font-display text-xl flex items-center justify-center
                             transition-all duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-indigo-400"
                  style={{
                    background: done
                      ? `linear-gradient(135deg, ${letter.color.from}, ${letter.color.to})`
                      : 'white',
                    color: done ? 'white' : letter.color.text,
                    border: `2px solid ${done ? 'transparent' : letter.color.from}`,
                    animationDelay: `${i * 30}ms`,
                  }}
                  aria-label={`Letter ${letter.uppercase}${done ? ' – completed' : ''}`}
                >
                  {letter.uppercase}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Footer tagline ───────────────────────────────────── */}
        <footer className="text-center text-gray-400 text-sm mt-8">
          <p>🎓 Designed for young learners • Built with ❤️</p>
        </footer>
      </main>
    </div>
  );
}

function CTAButton({ icon, label, subtitle, gradient, onClick, id }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} text-white rounded-3xl p-6 flex flex-col items-center gap-2
                  shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200
                  focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2`}
    >
      <span className="text-5xl" aria-hidden="true">{icon}</span>
      <span className="font-display text-2xl">{label}</span>
      <span className="text-sm opacity-90 font-body">{subtitle}</span>
    </button>
  );
}

// Semantic layout: hero, progress overview, and CTA sections separated.


// Responsive typography: clamp-based hero title.

