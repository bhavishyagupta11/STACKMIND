import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

const MESSAGES = [
  'Reading your code...',
  'Analyzing logic flow...',
  'Detecting bugs & issues...',
  'Evaluating complexity...',
  'Generating optimizations...',
  'Preparing code quality report...',
  'Finalizing your review...',
];

export default function AnalyzingLoader() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Animated ring */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-accent-cyan/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-cyan animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-purple animate-spin"
             style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap size={22} className="text-accent-cyan animate-pulse" />
        </div>
      </div>

      {/* Rotating messages */}
      <div className="text-center space-y-1.5">
        <p className="text-text-primary font-display font-semibold text-lg">Analyzing your code</p>
        <p
          key={msgIdx}
          className="text-accent-cyan text-sm font-mono animate-fade-in"
        >
          {MESSAGES[msgIdx]}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent-cyan/40 animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}
