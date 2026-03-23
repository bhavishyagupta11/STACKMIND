import React from 'react';
import { Activity, Database, GitBranch, Layers3, Orbit, Sigma } from 'lucide-react';
import { COMPLEXITY_PRESETS, parseComplexityInsights } from '../utils/complexity';

const HUE_STYLES = {
  emerald: {
    ring: 'border-emerald-300/70',
    soft: 'bg-emerald-50',
    text: 'text-emerald-700',
    bar: 'from-emerald-400 to-emerald-600',
  },
  cyan: {
    ring: 'border-cyan-300/70',
    soft: 'bg-cyan-50',
    text: 'text-cyan-700',
    bar: 'from-cyan-400 to-cyan-600',
  },
  amber: {
    ring: 'border-amber-300/70',
    soft: 'bg-amber-50',
    text: 'text-amber-700',
    bar: 'from-amber-400 to-amber-600',
  },
  orange: {
    ring: 'border-orange-300/70',
    soft: 'bg-orange-50',
    text: 'text-orange-700',
    bar: 'from-orange-400 to-orange-600',
  },
  rose: {
    ring: 'border-rose-300/70',
    soft: 'bg-rose-50',
    text: 'text-rose-700',
    bar: 'from-rose-400 to-rose-600',
  },
  red: {
    ring: 'border-red-300/70',
    soft: 'bg-red-50',
    text: 'text-red-700',
    bar: 'from-red-400 to-red-600',
  },
  fuchsia: {
    ring: 'border-fuchsia-300/70',
    soft: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
    bar: 'from-fuchsia-400 to-fuchsia-600',
  },
  violet: {
    ring: 'border-violet-300/70',
    soft: 'bg-violet-50',
    text: 'text-violet-700',
    bar: 'from-violet-400 to-violet-600',
  },
};

function ComplexityDial({ title, dimension, icon: Icon }) {
  const styles = HUE_STYLES[dimension.hue] || HUE_STYLES.cyan;
  const fill = Math.min(100, Math.round((dimension.score / 8) * 100));

  return (
    <div className={`rounded-[24px] border ${styles.ring} ${styles.soft} p-5`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-text-secondary text-[11px] font-mono uppercase tracking-[0.24em]">{title}</div>
          <div className="mt-2 text-2xl font-display font-bold text-text-primary">{dimension.expression}</div>
          <div className={`mt-1 text-sm font-medium ${styles.text}`}>{dimension.label}</div>
        </div>
        <div className={`w-12 h-12 rounded-2xl border ${styles.ring} bg-white/80 flex items-center justify-center`}>
          <Icon size={20} className={styles.text} />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
          <span>Pressure</span>
          <span>{fill}%</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-white/80 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${styles.bar} transition-all duration-500`}
            style={{ width: `${fill}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-text-secondary">{dimension.description}</p>
    </div>
  );
}

function ProjectionLane({ title, rows, hue }) {
  const styles = HUE_STYLES[hue] || HUE_STYLES.cyan;

  return (
    <div className="rounded-[24px] border border-border bg-[#fffdfa] p-5">
      <div className="flex items-center gap-2">
        <Sigma size={15} className={styles.text} />
        <h3 className="font-display font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={`${title}-${row.size}`}>
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-text-muted">
              <span>n = {row.size.toLocaleString()}</span>
              <span>{row.width}% load</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-bg-elevated overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${styles.bar}`}
                style={{ width: `${row.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalCard({ label, value, detail, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-border bg-[#fffdfa] p-4">
      <div className="flex items-center gap-2 text-text-muted">
        <Icon size={14} />
        <span className="text-[11px] font-mono uppercase tracking-[0.18em]">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-display font-bold text-text-primary">{value}</div>
      <div className="mt-1 text-sm text-text-secondary">{detail}</div>
    </div>
  );
}

const GRAPH_WIDTH = 760;
const GRAPH_HEIGHT = 340;
const PADDING = { top: 20, right: 18, bottom: 42, left: 54 };

const projectCurveValue = (preset, ratio) => {
  const x = 1 + ratio * 9;

  switch (preset.key) {
    case 'O(1)':
      return 1;
    case 'O(log n)':
      return Math.log2(x + 1);
    case 'O(n)':
      return x;
    case 'O(n log n)':
      return x * Math.log2(x + 1);
    case 'O(n^2)':
      return Math.pow(x, 2);
    case 'O(n^3)':
      return Math.pow(x, 3);
    case 'O(2^n)':
      return Math.pow(2, x / 2);
    case 'O(n!)': {
      let factorial = 1;
      const bounded = Math.max(1, Math.round(x / 1.5));
      for (let i = 2; i <= Math.min(bounded, 7); i += 1) factorial *= i;
      return factorial;
    }
    default:
      return x;
  }
};

const buildCurvePath = (preset, maxValue) => {
  const points = Array.from({ length: 40 }, (_, index) => {
    const ratio = index / 39;
    const rawY = projectCurveValue(preset, ratio);
    const x = PADDING.left + ratio * (GRAPH_WIDTH - PADDING.left - PADDING.right);
    const y =
      GRAPH_HEIGHT -
      PADDING.bottom -
      (rawY / maxValue) * (GRAPH_HEIGHT - PADDING.top - PADDING.bottom);

    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return points.join(' ');
};

function ComplexityGraph({ currentPreset, targetPreset }) {
  const graphPresets = targetPreset && targetPreset.key !== currentPreset.key
    ? [targetPreset, currentPreset]
    : [currentPreset];
  const maxValue = Math.max(...graphPresets.map((preset) => projectCurveValue(preset, 1)), 1);
  const currentPath = buildCurvePath(currentPreset, maxValue);
  const targetPath = targetPreset && targetPreset.key !== currentPreset.key
    ? buildCurvePath(targetPreset, maxValue)
    : null;
  const currentEndY =
    GRAPH_HEIGHT -
    PADDING.bottom -
    (projectCurveValue(currentPreset, 1) / maxValue) * (GRAPH_HEIGHT - PADDING.top - PADDING.bottom);
  const targetEndY = targetPreset && targetPreset.key !== currentPreset.key
    ? GRAPH_HEIGHT -
      PADDING.bottom -
      (projectCurveValue(targetPreset, 1) / maxValue) * (GRAPH_HEIGHT - PADDING.top - PADDING.bottom)
    : null;

  return (
    <div className="rounded-[24px] border border-border bg-[#fffdfa] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">Growth Graph</div>
          <h3 className="mt-1 font-display font-semibold text-text-primary">LeetCode-style time complexity map</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="badge bg-rose-50 text-rose-700 border border-rose-200">Current: {currentPreset.key}</span>
          {targetPreset && (
            <span className="badge bg-cyan-50 text-cyan-700 border border-cyan-200">Target: {targetPreset.key}</span>
          )}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} className="min-w-[680px] w-full h-auto">
          <defs>
            <linearGradient id="currentCurve" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#ff7a59" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="targetCurve" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <marker id="arrowCurrent" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#dc2626" />
            </marker>
            <marker id="arrowTarget" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#0891b2" />
            </marker>
          </defs>

          <line x1={PADDING.left} y1={GRAPH_HEIGHT - PADDING.bottom} x2={GRAPH_WIDTH - PADDING.right} y2={GRAPH_HEIGHT - PADDING.bottom} stroke="#1f2937" strokeWidth="2" />
          <line x1={PADDING.left} y1={GRAPH_HEIGHT - PADDING.bottom} x2={PADDING.left} y2={PADDING.top} stroke="#1f2937" strokeWidth="2" />

          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={`grid-${ratio}`}
              x1={PADDING.left}
              y1={GRAPH_HEIGHT - PADDING.bottom - ratio * (GRAPH_HEIGHT - PADDING.top - PADDING.bottom)}
              x2={GRAPH_WIDTH - PADDING.right}
              y2={GRAPH_HEIGHT - PADDING.bottom - ratio * (GRAPH_HEIGHT - PADDING.top - PADDING.bottom)}
              stroke="#e7e0d5"
              strokeDasharray="4 6"
            />
          ))}

          {targetPath && (
            <path
              d={targetPath}
              fill="none"
              stroke="url(#targetCurve)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="10 8"
              markerEnd="url(#arrowTarget)"
              opacity="0.95"
            />
          )}

          <path
            d={currentPath}
            fill="none"
            stroke="url(#currentCurve)"
            strokeWidth="4.5"
            strokeLinecap="round"
            markerEnd="url(#arrowCurrent)"
          />

          <text
            x={GRAPH_WIDTH - 130}
            y={Math.max(currentEndY - 10, PADDING.top + 16)}
            fill="#b91c1c"
            fontSize="16"
            fontWeight="700"
          >
            {currentPreset.key}
          </text>

          {targetPath && targetEndY !== null && (
            <text
              x={GRAPH_WIDTH - 150}
              y={Math.max(targetEndY - 18, PADDING.top + 34)}
              fill="#0f766e"
              fontSize="15"
              fontWeight="700"
            >
              Better target: {targetPreset.key}
            </text>
          )}

          <text x={GRAPH_WIDTH / 2} y={GRAPH_HEIGHT - 8} textAnchor="middle" fill="#4b5563" fontSize="14" fontWeight="600">
            Input Size
          </text>
          <text
            x="16"
            y={GRAPH_HEIGHT / 2}
            textAnchor="middle"
            fill="#4b5563"
            fontSize="14"
            fontWeight="600"
            transform={`rotate(-90 16 ${GRAPH_HEIGHT / 2})`}
          >
            CPU Operations
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function ComplexityVisualizer({ complexityText, optimizationText, code }) {
  const insights = parseComplexityInsights({ complexityText, optimizationText, code });
  const currentPreset = COMPLEXITY_PRESETS.find((item) => item.key === insights.time.key) || COMPLEXITY_PRESETS[2];
  const targetPreset =
    insights.optimizationTarget &&
    COMPLEXITY_PRESETS.find((item) => item.key === insights.optimizationTarget.key);

  return (
    <section className="glass-card p-5 md:p-6 overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(26,140,255,0.08),transparent_38%),radial-gradient(circle_at_top_right,rgba(255,161,22,0.14),transparent_32%)] pointer-events-none" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-cyan-700 text-[11px] font-mono uppercase tracking-[0.22em]">
              <Activity size={13} />
              Complexity Visualizer
            </div>
            <h2 className="mt-3 font-display font-bold text-2xl gradient-text">Scaling Snapshot</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">{insights.headline}</p>
          </div>
        </div>

        <div className="mt-6">
          <ComplexityDial title="Time Complexity" dimension={insights.time} icon={Orbit} />
        </div>

        <div className="mt-4">
          <ComplexityGraph currentPreset={currentPreset} targetPreset={targetPreset} />
        </div>

        <div className="mt-4">
          <ProjectionLane title="Time Growth Curve" rows={insights.timeProjection} hue={insights.time.hue} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SignalCard
            label="Code Lines"
            value={insights.signals.lineCount}
            detail="Non-empty lines inspected in the submitted snippet."
            icon={Layers3}
          />
          <SignalCard
            label="Loop Count"
            value={insights.signals.loopCount}
            detail={insights.signals.nestedLoop ? 'Nested iteration detected in the code path.' : 'No nested iteration was detected.'}
            icon={GitBranch}
          />
          <SignalCard
            label="Recursion"
            value={insights.signals.recursion ? 'Yes' : 'No'}
            detail={insights.signals.recursion ? 'A function appears to call itself.' : 'No recursive call pattern detected.'}
            icon={Orbit}
          />
          <SignalCard
            label="Aux Space"
            value={insights.signals.auxStructures}
            detail="Approximate number of extra structure signals such as arrays, maps, or sets."
            icon={Database}
          />
        </div>

        <div className="mt-4 rounded-[24px] border border-border bg-[#fffdfa] p-5">
          <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-text-muted">Why this rating</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {insights.signals.insights.map((item) => (
              <span key={item} className="badge bg-bg-elevated border border-border text-text-secondary">
                {item}
              </span>
            ))}
          </div>
          {complexityText?.trim() && (
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              <span className="font-display font-medium text-text-primary">Reviewer note:</span> {complexityText}
            </p>
          )}
          {targetPreset && targetPreset.key !== currentPreset.key && (
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              <span className="font-display font-medium text-text-primary">Optimization target:</span> Based on the review hints, a realistic next step is aiming for {targetPreset.key} time complexity.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
