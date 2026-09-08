// src/components/progress/ProgressBar.jsx
export default function ProgressBar({ value, max, color = '#6366f1', label }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div>
      {label && (
        <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
          <span>{label}</span>
          <span>{value} / {max}</span>
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ? `${label}: ${pct}%` : `${pct}%`}
        />
      </div>
    </div>
  );
}

// ProgressBar: animated progress fill bar.

