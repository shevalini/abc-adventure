# ABC Adventure 🌟

> **Learn • Listen • Trace • Play**

A complete, polished, kid-friendly interactive English alphabet learning website for young children.

![ABC Adventure](https://img.shields.io/badge/ABC-Adventure-6366f1?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss)

---

## ✨ Features


- **A–Z Alphabet Learning** — All 26 letters with example words, sentences, and emoji illustrations
- **Uppercase & Lowercase** — Both forms displayed prominently at all times
- **Pronunciation** — Web Speech Synthesis API reads letter sounds and example words aloud
- **Interactive Handwriting Tracing** — HTML5 Canvas with mouse, touch, and stylus support
- **Pixel-Coverage Scoring** — Forgiving, child-friendly scoring based on guide coverage
- **Mini Activities** — Three quiz types: identify the letter, find the word, spot the lowercase
- **Progress Tracking** — LocalStorage persistence survives browser refresh
- **Star Rewards** — Up to 3 stars per letter (Learn ⭐ + Trace ⭐ + Activity ⭐)
- **Completion Modal** — Animated celebration when all stars are earned for a letter
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Accessibility** — ARIA labels, keyboard navigation, visible focus states, reduced-motion support

---

## 🖥️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component framework |
| **Vite 5** | Fast build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router v6** | Client-side routing |
| **Lucide React** | Icon library |
| **HTML5 Canvas** | Handwriting tracing surface |
| **Web Speech API** | Letter & word pronunciation |
| **localStorage** | Persistent progress storage |

---

## 🚀 Getting Started

### Prerequisites

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/abc-adventure.git
cd abc-adventure

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── data/
│   └── alphabetData.js         # Centralized A–Z letter data
├── hooks/
│   ├── useProgress.js          # LocalStorage progress management
│   └── useSpeech.js            # Web Speech API wrapper
├── components/
│   ├── layout/
│   │   └── Header.jsx          # Sticky header with star count
│   ├── home/
│   │   └── HomePage.jsx        # Landing page with hero & CTA
│   ├── alphabet/
│   │   ├── AlphabetGrid.jsx    # A–Z selection grid
│   │   └── AlphabetCard.jsx    # Individual letter card
│   ├── letter/
│   │   ├── LetterLearningPage.jsx  # Main tabbed learning page
│   │   ├── PronunciationButton.jsx # Speech synthesis button
│   │   └── ExampleWord.jsx         # Emoji + word + sentence display
│   ├── tracing/
│   │   ├── TracingCanvas.jsx   # HTML5 Canvas tracing with scoring
│   │   └── WritingPractice.jsx # Uppercase + lowercase practice flow
│   ├── activity/
│   │   └── Activity.jsx        # Mini quiz with 3 question types
│   ├── progress/
│   │   ├── ProgressPage.jsx    # Full progress dashboard
│   │   └── ProgressBar.jsx     # Reusable progress bar
│   └── ui/
│       ├── CompletionModal.jsx # Letter completion celebration
│       └── NavigationControls.jsx # Prev/Home/Next navigation
├── App.jsx                     # Route configuration
├── main.jsx                    # App entry point
└── index.css                   # Global styles + animations
```

---

## 🎮 User Flow

```
Home Page
    ↓
Alphabet Grid (A–Z)
    ↓
Select a Letter
    ↓
Letter Learning Page
    ├── 📖 Learn     → Read the letter, word, sentence
    ├── 🔊 Listen    → Hear pronunciation via Speech API
    ├── ✍️  Trace     → Trace uppercase then lowercase on canvas
    └── 🎮 Play      → Complete a mini quiz activity
    ↓
⭐⭐⭐ Stars Earned
    ↓
Completion Modal → Next Letter
```

---

## 🌟 Gamification

Each letter offers up to **3 stars**:

| Action | Stars |
|---|---|
| Complete the Learn tab | ⭐ |
| Complete Tracing practice | ⭐ |
| Complete the Activity quiz | ⭐ |

Total possible: **78 stars** across all 26 letters.

Progress persists in `localStorage` so children can return anytime.

---

## ♿ Accessibility

- Semantic HTML5 elements throughout
- ARIA labels on all interactive elements
- Keyboard-navigable tabs and buttons
- Visible focus rings (WCAG 2.1 compliant)
- `prefers-reduced-motion` support — all animations disabled when requested
- Canvas has descriptive `aria-label` for screen readers
- Color is never the only indicator of completion status

---

## 🔮 Future Improvements

- **User Accounts** — Save progress to the cloud with authentication
- **Parent Dashboard** — View child's progress and time spent learning
- **Teacher Dashboard** — Classroom management and multi-student tracking
- **AI Handwriting Feedback** — Computer vision to analyze tracing accuracy
- **Audio Recording** — Children record themselves saying the letter/word
- **More Languages** — Spanish, French, Arabic alphabet support
- **Advanced Mini-Games** — Word spelling, matching games, memory cards
- **Offline PWA** — Service worker for full offline support
- **Printable Worksheets** — Generate PDF tracing sheets from the app
- **Achievement Badges** — Special rewards for completing all letters

---

## 📄 License

MIT — free to use, modify, and distribute.

---

Made with ❤️ for young learners everywhere 🌍

<!-- Commit 49: Troubleshooting guide -->

