// src/components/tracing/TracingCanvas.jsx
// HTML5 Canvas for letter tracing practice.
// Renders a faint guide letter, lets the child draw over it,
// then scores coverage on "Done".

import { useRef, useEffect, useCallback, useState } from 'react';
import { Eraser, RotateCcw, CheckCircle } from 'lucide-react';

const GUIDE_ALPHA = 0.12;       // opacity of guide letter
const BRUSH_COLOR = '#4f46e5';  // indigo ink
const BRUSH_WIDTH = 10;
const GUIDE_FONT_SCALE = 0.75;  // fraction of canvas height

function drawGuide(ctx, letter, width, height) {
  ctx.save();
  const fontSize = Math.floor(height * GUIDE_FONT_SCALE);
  ctx.font = `900 ${fontSize}px 'Fredoka One', 'Arial Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(79, 70, 229, ${GUIDE_ALPHA})`;
  ctx.fillText(letter, width / 2, height / 2);
  ctx.restore();
}

function scoreCoverage(ctx, guideCtx, width, height) {
  // Sample every 4px for performance
  const step = 4;
  let guidePixels = 0;
  let coveredPixels = 0;

  const guideData = guideCtx.getImageData(0, 0, width, height).data;
  const drawData = ctx.getImageData(0, 0, width, height).data;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      // Guide pixel: has alpha (non-white)
      const guideA = guideData[idx + 3];
      if (guideA > 30) {
        guidePixels++;
        // Draw pixel: user drew here (alpha > 30)
        const drawA = drawData[idx + 3];
        if (drawA > 30) coveredPixels++;
      }
    }
  }

  if (guidePixels === 0) return 0;
  return coveredPixels / guidePixels;
}

export default function TracingCanvas({ letter, onDone, color }) {
  const canvasRef = useRef(null);
  const guideCanvasRef = useRef(null); // off-screen canvas for scoring
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [feedback, setFeedback] = useState(null); // null | 'excellent' | 'good' | 'try'
  const [hasDrawn, setHasDrawn] = useState(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Retina / HiDPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    drawGuide(ctx, letter, rect.width, rect.height);

    // Set up off-screen guide canvas for scoring
    const guide = guideCanvasRef.current;
    guide.width = rect.width * dpr;
    guide.height = rect.height * dpr;
    const gCtx = guide.getContext('2d');
    gCtx.scale(dpr, dpr);
    drawGuide(gCtx, letter, rect.width, rect.height);
    // Make guide pixels fully opaque for accurate sampling
    const imgData = gCtx.getImageData(0, 0, guide.width, guide.height);
    for (let i = 3; i < imgData.data.length; i += 4) {
      imgData.data[i] = imgData.data[i] > 10 ? 255 : 0;
    }
    gCtx.putImageData(imgData, 0, 0);
  }, [letter]);

  useEffect(() => {
    initCanvas();
    const canvas = canvasRef.current;
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    isDrawing.current = true;
    setHasDrawn(true);
    setFeedback(null);
    const canvas = canvasRef.current;
    lastPos.current = getPos(e, canvas);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);

    ctx.beginPath();
    ctx.strokeStyle = BRUSH_COLOR;
    ctx.lineWidth = BRUSH_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPos.current = pos;
  }, []);

  const endDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const handleClear = useCallback(() => {
    setFeedback(null);
    setHasDrawn(false);
    initCanvas();
  }, [initCanvas]);

  const handleDone = useCallback(() => {
    if (!hasDrawn) {
      setFeedback('try');
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const guide = guideCanvasRef.current;
    const gCtx = guide.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const coverage = scoreCoverage(
      ctx, gCtx,
      canvas.width, canvas.height
    );

    if (coverage >= 0.30) {
      setFeedback('excellent');
    } else if (coverage >= 0.12) {
      setFeedback('good');
    } else {
      setFeedback('try');
    }
  }, [hasDrawn]);

  const feedbackConfig = {
    excellent: { emoji: '⭐', msg: 'Excellent!', sub: 'You traced it perfectly!', done: true },
    good: { emoji: '🌟', msg: 'Good job!', sub: 'That looks great!', done: true },
    try: { emoji: '💪', msg: 'Try once more!', sub: 'Keep going, you can do it!', done: false },
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Instruction */}
      <p className="text-lg font-semibold text-gray-600 flex items-center gap-2">
        ✍️ Trace the letter{' '}
        <span className="font-display text-2xl" style={{ color }}>
          {letter}
        </span>
      </p>

      {/* Canvas */}
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-lg border-4 border-indigo-100 bg-white touch-none">
        <canvas
          ref={canvasRef}
          className="w-full touch-none select-none"
          style={{ aspectRatio: '1 / 1', cursor: 'crosshair', display: 'block', touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          aria-label={`Tracing canvas for letter ${letter}. Draw with your mouse or finger.`}
          role="img"
        />
        {/* Off-screen guide canvas (invisible) */}
        <canvas ref={guideCanvasRef} style={{ display: 'none' }} aria-hidden="true" />
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`animate-bounce-in rounded-2xl px-6 py-3 text-center font-semibold text-lg
            ${feedback === 'try'
              ? 'bg-orange-50 text-orange-600 border border-orange-200'
              : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          role="status"
          aria-live="polite"
        >
          <span className="text-3xl block">{feedbackConfig[feedback].emoji}</span>
          <span className="font-display text-xl">{feedbackConfig[feedback].msg}</span>
          <span className="block text-sm opacity-80">{feedbackConfig[feedback].sub}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200
                     text-gray-700 font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-gray-400"
        >
          <Eraser className="w-4 h-4" /> Clear
        </button>

        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-100 hover:bg-orange-200
                     text-orange-700 font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-400"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>

        {(!feedback || feedbackConfig[feedback]?.done) ? (
          <button
            onClick={feedbackConfig[feedback]?.done ? onDone : handleDone}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold
                       transition-all active:scale-95 focus-visible:outline-2 text-white"
            style={{
              background: feedbackConfig[feedback]?.done
                ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            }}
          >
            <CheckCircle className="w-4 h-4" />
            {feedbackConfig[feedback]?.done ? 'Continue ✨' : 'Done'}
          </button>
        ) : (
          <button
            onClick={handleDone}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700
                       text-white font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <CheckCircle className="w-4 h-4" /> Done
          </button>
        )}
      </div>
    </div>
  );
}

// Canvas touch coordinate handling: normalized for HiDPI/Retina screens.


// Tracing brush: round cap and round join for smoother strokes.


// Canvas aspect ratio: 1/1 square container with responsive touchAction.


// Tracing score threshold: coverage scoring evaluated upon Done.

