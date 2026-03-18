import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Brain, Bug, Cpu, Rocket, Sparkles, AlertTriangle,
  Lightbulb, BarChart3, Mic, HelpCircle, Copy, Check,
  AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

const SECTIONS = [
  { key: 'codeUnderstanding',     emoji: '🧠', label: 'Code Understanding',       icon: Brain,         color: 'cyan',   alwaysShow: true },
  { key: 'bugsIssues',            emoji: '❌', label: 'Bugs / Issues',             icon: Bug,           color: 'red',    alwaysShow: true },
  { key: 'complexity',            emoji: '⚙️', label: 'Time & Space Complexity',   icon: Cpu,           color: 'amber',  alwaysShow: true },
  { key: 'optimizationSuggestions',emoji: '🚀',label: 'Optimization Suggestions', icon: Rocket,        color: 'purple', alwaysShow: true },
  { key: 'codeQuality',           emoji: '🧹', label: 'Code Quality Review',       icon: Sparkles,      color: 'green',  alwaysShow: true },
  { key: 'edgeCases',             emoji: '⚠️', label: 'Edge Cases',                icon: AlertTriangle, color: 'amber',  alwaysShow: true },
  { key: 'improvedCode',          emoji: '💡', label: 'Improved Code',             icon: Lightbulb,     color: 'cyan',   alwaysShow: true, isCode: true },
  { key: 'finalVerdict',          emoji: '📊', label: 'Final Verdict',             icon: BarChart3,     color: 'purple', alwaysShow: true },
  { key: 'interviewExplanation',  emoji: '🎤', label: 'Interview Explanation',     icon: Mic,           color: 'pink',   alwaysShow: false },
  { key: 'followUpQuestions',     emoji: '❓', label: 'Follow-up Questions',       icon: HelpCircle,    color: 'green',  alwaysShow: false },
];

const COLOR_MAP = {
  cyan:   { border: 'border-accent-cyan/30',   bg: 'bg-accent-cyan/5',   text: 'text-accent-cyan',   icon: 'text-accent-cyan' },
  red:    { border: 'border-accent-red/30',    bg: 'bg-accent-red/5',    text: 'text-accent-red',    icon: 'text-accent-red' },
  amber:  { border: 'border-accent-amber/30',  bg: 'bg-accent-amber/5',  text: 'text-accent-amber',  icon: 'text-accent-amber' },
  purple: { border: 'border-accent-purple/30', bg: 'bg-accent-purple/5', text: 'text-accent-purple', icon: 'text-accent-purple' },
  green:  { border: 'border-accent-green/30',  bg: 'bg-accent-green/5',  text: 'text-accent-green',  icon: 'text-accent-green' },
  pink:   { border: 'border-accent-pink/30',   bg: 'bg-accent-pink/5',   text: 'text-accent-pink',   icon: 'text-accent-pink' },
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="btn-ghost text-xs px-2 py-1 gap-1.5">
      {copied ? <Check size={13} className="text-accent-green" /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function SectionCard({ section, content, language, interviewMode }) {
  const [collapsed, setCollapsed] = useState(false);
  const colors = COLOR_MAP[section.color] || COLOR_MAP.cyan;
  const Icon = section.icon;

  // Skip interview sections when not in interview mode
  if (!section.alwaysShow && !interviewMode) return null;
  // Skip empty sections
  if (!content || content.trim() === '') return null;

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden animate-slide-up`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg leading-none">{section.emoji}</span>
          <h3 className={`font-display font-semibold text-sm ${colors.text}`}>
            {section.label}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {section.isCode && !collapsed && <CopyButton text={content} />}
          {collapsed ? <ChevronDown size={15} className="text-text-muted" /> : <ChevronUp size={15} className="text-text-muted" />}
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="px-5 pb-5">
          {section.isCode ? (
            <div className="rounded-lg overflow-hidden border border-border">
              <SyntaxHighlighter
                language={language || 'javascript'}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  background: '#090c10',
                  fontSize: '12.5px',
                  lineHeight: '1.7',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
                showLineNumbers
              >
                {content}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div className="text-text-secondary text-sm leading-relaxed font-body whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewOutput({ review }) {
  if (!review) return null;

  const { response, language, interviewMode, isFallback } = review;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Fallback warning banner */}
      {isFallback && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-accent-amber/30 bg-accent-amber/5">
          <AlertCircle size={18} className="text-accent-amber flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-accent-amber text-sm font-semibold font-display">Fallback Analysis Mode</p>
            <p className="text-text-secondary text-xs mt-0.5">
              Gemini API was unreachable. This is a static rule-based analysis.
              Ensure your <code className="font-mono text-accent-cyan">GEMINI_API_KEY</code> is configured correctly.
            </p>
          </div>
        </div>
      )}

      {/* Section cards */}
      {SECTIONS.map((section) => (
        <SectionCard
          key={section.key}
          section={section}
          content={response[section.key]}
          language={language}
          interviewMode={interviewMode}
        />
      ))}
    </div>
  );
}
