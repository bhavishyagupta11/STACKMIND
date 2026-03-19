import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Code2, Brain, History, ArrowRight, Check, Mic, Workflow, Sparkles } from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'Review Summaries', desc: 'Get a TL;DR, risk hotspots, and a walkthrough before diving into detailed findings.', color: 'cyan' },
  { icon: Workflow, title: 'Custom Review Rules', desc: 'Set focus areas, project context, and custom instructions so reviews match your team standards.', color: 'purple' },
  { icon: Sparkles, title: 'Persistent Preferences', desc: 'Save your review preferences and reuse them automatically on future submissions.', color: 'pink' },
  { icon: Code2, title: 'Editor + Upload Flow', desc: 'Paste code, upload files, and review them in a polished workspace with language-aware editing.', color: 'green' },
  { icon: Mic, title: 'Interview Deep Dives', desc: 'Turn on interview mode for explanation-heavy feedback and follow-up questions.', color: 'amber' },
  { icon: History, title: 'Traceable Review History', desc: 'Every review keeps its code, context, focus areas, and output so teams can revisit decisions later.', color: 'red' },
];

const COLOR = {
  cyan:   'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  purple: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
  pink:   'text-accent-pink bg-accent-pink/10 border-accent-pink/20',
  green:  'text-accent-green bg-accent-green/10 border-accent-green/20',
  amber:  'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
  red:    'text-accent-red bg-accent-red/10 border-accent-red/20',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base noise">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
            <Zap size={16} className="text-bg-base" />
          </div>
          <span className="font-display font-bold text-text-primary">CodeReview AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-accent-cyan text-xs font-mono">Inspired by modern AI review workflows</span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl text-text-primary leading-tight mb-6">
          Review like a teammate.<br />
          <span className="gradient-text">Ship with confidence.</span>
        </h1>

        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
          A warmer, faster AI code review workspace with customizable instructions,
          risk summaries, change walkthroughs, and saved review preferences.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="btn-primary text-base px-8 py-3 glow-cyan">
            Start reviewing free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3">
            Sign in to dashboard
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-14 text-text-muted text-xs font-mono">
          {['Custom Instructions', 'Saved Preferences', 'Risk Hotspots', 'Walkthroughs', 'Review History'].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <Check size={12} className="text-accent-green" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-2xl text-center text-text-primary mb-10">
          Everything you need for better code
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card-hover p-6">
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${COLOR[color]}`}>
                <Icon size={18} />
              </div>
              <h3 className="font-display font-semibold text-text-primary text-sm mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed font-body">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="glass-card p-10 glow-cyan">
          <h2 className="font-display font-bold text-3xl text-text-primary mb-4">Ready to review your code?</h2>
          <p className="text-text-secondary mb-8 font-body">Create a free account and get your first AI code review in under 30 seconds.</p>
          <Link to="/signup" className="btn-primary text-base px-10 py-3">
            Create free account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border text-center py-6">
        <p className="text-text-muted text-xs font-mono">
          Built with React + Vite + Tailwind + Node.js + MongoDB + Google Gemini
        </p>
      </footer>
    </div>
  );
}
