import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Code2, Brain, Shield, History, ArrowRight, Check, Mic } from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Google Gemini reviews your code like a senior engineer — bugs, complexity, optimizations and more.', color: 'cyan' },
  { icon: Code2, title: 'Monaco Code Editor', desc: 'Full-featured editor with syntax highlighting for 15+ languages, or simply upload your file.', color: 'purple' },
  { icon: Mic, title: 'Interview Mode', desc: 'Activates in-depth explanations and follow-up questions to help you ace your next technical interview.', color: 'pink' },
  { icon: History, title: 'Review History', desc: 'Every review is saved. Browse, revisit, and compare your past code submissions anytime.', color: 'green' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication keeps your code and reviews safe. Your data belongs to you.', color: 'amber' },
  { icon: Zap, title: 'Instant Fallback', desc: 'If AI is unavailable, our rule-based analyzer still catches nested loops, missing checks, and more.', color: 'red' },
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
          <span className="text-accent-cyan text-xs font-mono">Powered by Google Gemini 1.5 Flash</span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl text-text-primary leading-tight mb-6">
          Code smarter.<br />
          <span className="gradient-text">Ship faster.</span>
        </h1>

        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
          An AI-powered code review assistant that catches bugs, evaluates complexity,
          suggests optimizations, and preps you for technical interviews — instantly.
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
          {['JWT Auth', 'MongoDB Storage', 'Fallback Analyzer', 'Interview Mode', '15+ Languages'].map((badge) => (
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
