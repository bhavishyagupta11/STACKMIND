import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Brain, Bug, Cpu, Rocket, Sparkles, AlertTriangle,
  Lightbulb, BarChart3, Mic, HelpCircle, Copy, Check,
  AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

const SECTIONS = [
  { key: 'summary',               emoji: '🧭', label: 'TL;DR Summary',             icon: Brain,         color: 'amber',  alwaysShow: true },
  { key: 'codeUnderstanding',     emoji: '🧠', label: 'Code Understanding',       icon: Brain,         color: 'cyan',   alwaysShow: true },
  { key: 'riskHotspots',          emoji: '🔥', label: 'Risk Hotspots',            icon: AlertTriangle, color: 'red',    alwaysShow: true },
  { key: 'bugsIssues',            emoji: '❌', label: 'Bugs / Issues',             icon: Bug,           color: 'red',    alwaysShow: true },
  { key: 'complexity',            emoji: '⚙️', label: 'Time & Space Complexity',   icon: Cpu,           color: 'amber',  alwaysShow: true },
  { key: 'optimizationSuggestions',emoji: '🚀',label: 'Optimization Suggestions', icon: Rocket,        color: 'purple', alwaysShow: true },
  { key: 'codeQuality',           emoji: '🧹', label: 'Code Quality Review',       icon: Sparkles,      color: 'green',  alwaysShow: true },
  { key: 'testRecommendations',   emoji: '🧪', label: 'Testing Recommendations',  icon: HelpCircle,    color: 'green',  alwaysShow: true },
  { key: 'conventionsAlignment',  emoji: '📐', label: 'Conventions Alignment',    icon: BarChart3,     color: 'amber',  alwaysShow: true },
  { key: 'walkthrough',           emoji: '🪜', label: 'Change Walkthrough',       icon: Lightbulb,     color: 'purple', alwaysShow: true },
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

const normalizeDisplayText = (text = '') =>
  text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\\"/g, '"')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/^\s*[*-]\s+/gm, '')
    .replace(/^\s*[:;,.]+\s*$/gm, '')
    .replace(/^\s*[:;]\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const isSubheading = (line = '') =>
  /^(implementation\s+\d+|first implementation|second implementation|third implementation|time complexity|space complexity|issue|fix|recommendation|test case|edge case|why|impact|summary|hotspot)\s*:$/i.test(line.trim());

function FormattedText({ content }) {
  const text = normalizeDisplayText(content);
  const blocks = text.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);

        if (lines.length === 0) return null;

        return (
          <div key={`${block.slice(0, 24)}-${index}`} className="rounded-lg bg-bg-overlay/45 border border-border/60 p-3.5 space-y-2">
            {lines.map((line, lineIndex) => (
              isSubheading(line) ? (
                <div key={`${line}-${lineIndex}`} className="text-text-primary font-display font-semibold text-sm">
                  {line}
                </div>
              ) : (
                <p key={`${line}-${lineIndex}`} className="text-text-secondary text-sm leading-7 font-body">
                  {line}
                </p>
              )
            ))}
          </div>
        );
      })}
    </div>
  );
}

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

function SectionCard({ section, content, language, interviewMode, isOpen, onToggle }) {
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
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg leading-none">{section.emoji}</span>
          <h3 className={`font-display font-semibold text-sm ${colors.text}`}>
            {section.label}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {section.isCode && isOpen && <CopyButton text={content} />}
          {isOpen ? <ChevronUp size={15} className="text-text-muted" /> : <ChevronDown size={15} className="text-text-muted" />}
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="px-5 pb-5">
          {section.isCode ? (
            <div className="rounded-lg overflow-hidden border border-border bg-[#fcfbf8]">
              <SyntaxHighlighter
                language={language || 'javascript'}
                style={oneLight}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  background: '#fcfbf8',
                  fontSize: '12.5px',
                  lineHeight: '1.7',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
                showLineNumbers
              >
                {normalizeDisplayText(content)}
              </SyntaxHighlighter>
            </div>
          ) : (
            <FormattedText content={content} />
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewOutput({ review }) {
  if (!review) return null;

  const { response, language, interviewMode, isFallback, focusAreas = [], customInstructions, contextNotes } = review;
  const visibleSections = SECTIONS.filter((section) => {
    if (!section.alwaysShow && !interviewMode) return false;
    return Boolean(response?.[section.key]?.trim());
  });
  const firstOpenSection = visibleSections[0]?.key || null;
  const [openSection, setOpenSection] = useState(firstOpenSection);

  useEffect(() => {
    setOpenSection(firstOpenSection);
  }, [firstOpenSection, review]);

  return (
    <div className="space-y-4 animate-fade-in">
      {(focusAreas.length > 0 || customInstructions || contextNotes) && (
        <div className="glass-card p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {focusAreas.map((item) => (
              <span key={item} className="badge bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                {item}
              </span>
            ))}
          </div>
          {customInstructions && (
            <p className="text-text-secondary text-sm leading-relaxed">
              <span className="text-text-primary font-display font-medium">Custom instructions:</span> {customInstructions}
            </p>
          )}
          {contextNotes && (
            <p className="text-text-secondary text-sm leading-relaxed mt-2">
              <span className="text-text-primary font-display font-medium">Context:</span> {contextNotes}
            </p>
          )}
        </div>
      )}

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
      {visibleSections.map((section) => (
        <SectionCard
          key={section.key}
          section={section}
          content={response[section.key]}
          language={language}
          interviewMode={interviewMode}
          isOpen={openSection === section.key}
          onToggle={() => setOpenSection((current) => current === section.key ? null : section.key)}
        />
      ))}
    </div>
  );
}
