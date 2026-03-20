import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Code2, Brain, History, ArrowRight, Check, Mic, Workflow, Sparkles,
  ShieldCheck, Database, Server, Layers3, RefreshCcw, Cpu, FileCode2
} from 'lucide-react';

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

const STACK_ITEMS = [
  { icon: Layers3, title: 'Frontend', desc: 'React, Vite, Tailwind CSS, Monaco Editor, React Router' },
  { icon: Server, title: 'Backend', desc: 'Node.js, Express, JWT auth, rate limiting, REST APIs' },
  { icon: Database, title: 'Database', desc: 'MongoDB with review history, preferences, and saved code context' },
  { icon: Cpu, title: 'AI Providers', desc: 'Gemini primary, OpenRouter backup, static heuristic fallback' },
];

const FLOW_STEPS = [
  {
    title: 'Primary AI review',
    desc: 'Requests go to Gemini first for full structured analysis with summaries, issues, complexity, and improved code.',
    tone: 'amber',
  },
  {
    title: 'Backup provider handoff',
    desc: 'If Gemini is unavailable, the backend automatically retries through OpenRouter using the configured backup model.',
    tone: 'cyan',
  },
  {
    title: 'Safe fallback mode',
    desc: 'If both providers fail, STACKMIND still returns a rule-based review so the platform remains usable.',
    tone: 'green',
  },
];

const SPECS = [
  'Authentication with JWT-based protected routes',
  'Upload or paste code with language detection',
  'Custom instructions, context notes, and focus areas',
  'Interview mode with explanation-heavy review output',
  'Stored review history with detailed result pages',
  'Rate-limited API surface and provider fallback logic',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base noise">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-[320px] bg-gradient-to-b from-[#fff4df] to-transparent" />
        <div className="absolute top-8 left-[12%] w-[340px] h-[340px] bg-accent-amber/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-[8%] w-[280px] h-[280px] bg-accent-cyan/8 rounded-full blur-3xl" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/70 bg-bg-surface/80 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-amber to-[#ffbf66] flex items-center justify-center shadow-[0_10px_24px_rgba(255,161,22,0.20)]">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-text-primary">STACKMIND</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-18">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-amber/25 bg-[#fff8ec] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" />
          <span className="text-accent-amber text-xs font-mono">Cleaner contrast. Better focus. Better reviews.</span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-6xl text-text-primary leading-tight mb-6">
          Code reviews that feel
          <br />
          <span className="gradient-text">sharp, calm, and readable.</span>
        </h1>

        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
          STACKMIND gives your review flow a more grounded workspace with better contrast,
          softer surfaces, and clearer feedback so reading code never feels tiring.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <Link to="/signup" className="btn-primary text-base px-8 py-3 glow-cyan">
            Start reviewing free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3">
            Sign in to dashboard
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-14 text-text-muted text-xs font-mono">
          {['Custom Instructions', 'Saved Preferences', 'Risk Hotspots', 'Walkthroughs', 'Review History'].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <Check size={12} className="text-accent-green" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
          </div>

          <div className="glass-card p-4 md:p-5">
            <div className="flex items-center gap-2 text-text-secondary text-xs font-mono mb-4">
              <div className="w-2 h-2 rounded-full bg-accent-green" />
              Live platform overview
            </div>
            <div className="rounded-[22px] border border-border bg-[#fcfaf6] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-surface">
                <div>
                  <div className="text-text-primary font-display font-semibold text-sm">STACKMIND Review Workspace</div>
                  <div className="text-text-muted text-xs">Readable surfaces, saved reviews, structured analysis</div>
                </div>
                <div className="badge bg-[#fff4df] text-accent-amber border border-[#f4d4a0]">v1 Platform</div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-border bg-white p-3">
                    <div className="text-2xl font-display font-bold text-text-primary">3</div>
                    <div className="text-xs text-text-secondary">review modes</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-white p-3">
                    <div className="text-2xl font-display font-bold text-text-primary">2</div>
                    <div className="text-xs text-text-secondary">AI providers</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-white p-3">
                    <div className="text-2xl font-display font-bold text-text-primary">1</div>
                    <div className="text-xs text-text-secondary">fallback path</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-display font-semibold text-text-primary">Inference routing</div>
                    <RefreshCcw size={15} className="text-accent-cyan" />
                  </div>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between rounded-xl bg-bg-elevated px-3 py-2">
                      <span className="text-text-primary">Gemini</span>
                      <span className="text-accent-amber text-xs font-mono">Primary</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-bg-elevated px-3 py-2">
                      <span className="text-text-primary">OpenRouter</span>
                      <span className="text-accent-cyan text-xs font-mono">Backup</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-bg-elevated px-3 py-2">
                      <span className="text-text-primary">Static heuristics</span>
                      <span className="text-accent-green text-xs font-mono">Final safety net</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center gap-2 mb-3 text-text-primary text-sm font-display font-semibold">
                    <FileCode2 size={16} className="text-accent-amber" />
                    Review output
                  </div>
                  <div className="space-y-2 text-xs text-text-secondary">
                    <div className="rounded-xl bg-bg-elevated px-3 py-2">TL;DR summary, code understanding, and risk hotspots</div>
                    <div className="rounded-xl bg-bg-elevated px-3 py-2">Complexity review, quality notes, and test recommendations</div>
                    <div className="rounded-xl bg-bg-elevated px-3 py-2">Improved code, final verdict, and optional interview follow-ups</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        <h2 className="font-display font-bold text-2xl text-center text-text-primary mb-3">
          Everything you need for better code
        </h2>
        <p className="text-center text-text-secondary text-sm max-w-2xl mx-auto mb-10">
          The product is built around real review workflows, not just prompt boxes. You can add context, preserve preferences, and revisit every result later.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card-hover p-6">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${COLOR[color]}`}>
                <Icon size={18} />
              </div>
              <h3 className="font-display font-semibold text-text-primary text-base mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed font-body">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-card p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-1 text-xs font-mono text-accent-cyan mb-4">
              <ShieldCheck size={13} />
              Platform spec
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
              What the platform actually includes
            </h2>
            <p className="text-text-secondary text-sm leading-7 mb-5">
              STACKMIND is a full-stack review product with authentication, persistent history, provider failover, and structured output storage. The landing page now reflects the real feature set rather than generic AI app copy.
            </p>
            <div className="space-y-2.5">
              {SPECS.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-[#fcfaf6] px-4 py-3">
                  <Check size={15} className="text-accent-green mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-amber/20 bg-accent-amber/5 px-3 py-1 text-xs font-mono text-accent-amber mb-4">
              <Database size={13} />
              Architecture
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
              Tech stack and backup flow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {STACK_ITEMS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-border bg-[#fcfaf6] p-4">
                  <div className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center mb-3">
                    <Icon size={17} className="text-accent-amber" />
                  </div>
                  <div className="font-display font-semibold text-text-primary text-sm mb-1">{title}</div>
                  <p className="text-text-secondary text-sm leading-6">{desc}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {FLOW_STEPS.map(({ title, desc, tone }, index) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-border bg-[#fcfaf6] px-4 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border ${
                    tone === 'amber'
                      ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/20'
                      : tone === 'cyan'
                        ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20'
                        : 'bg-accent-green/10 text-accent-green border-accent-green/20'
                  }`}>
                    0{index + 1}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-text-primary text-sm mb-1">{title}</div>
                    <p className="text-text-secondary text-sm leading-6">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="glass-card p-10 glow-cyan bg-[linear-gradient(180deg,#fffdf9_0%,#fff8ee_100%)]">
          <h2 className="font-display font-bold text-3xl text-text-primary mb-4">Ready to review your code?</h2>
          <p className="text-text-secondary mb-8 font-body">Create a free account and get your first STACKMIND review in under 30 seconds.</p>
          <Link to="/signup" className="btn-primary text-base px-10 py-3">
            Create free account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border text-center py-6">
        <p className="text-text-muted text-xs font-mono">
          Built with React + Vite + Tailwind + Node.js + Express + MongoDB + Gemini + OpenRouter backup
        </p>
      </footer>
    </div>
  );
}
