import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Brain, Bug, Cpu, Rocket, Sparkles, AlertTriangle,
  Lightbulb, BarChart3, Mic, HelpCircle, Copy, Check,
  AlertCircle, ArrowLeft, ArrowRight
} from 'lucide-react';
import ComplexityVisualizer from './ComplexityVisualizer';

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

function SectionCard({ section, content, language, interviewMode }) {
  const colors = COLOR_MAP[section.color] || COLOR_MAP.cyan;

  // Skip interview sections when not in interview mode
  if (!section.alwaysShow && !interviewMode) return null;
  // Skip empty sections
  if (!content || content.trim() === '') return null;

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden animate-slide-up`}>
      <div className="flex items-center justify-between px-5 py-3.5 select-none border-b border-current/10">
        <div className="flex items-center gap-3">
          <span className="text-lg leading-none">{section.emoji}</span>
          <h3 className={`font-display font-semibold text-sm ${colors.text}`}>
            {section.label}
          </h3>
        </div>
        {section.isCode && <CopyButton text={content} />}
      </div>

      <div className="px-5 py-5">
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
    </div>
  );
}

function OverviewCard({ label, value, accent }) {
  const palette = {
    amber: 'border-accent-amber/20 bg-accent-amber/5 text-accent-amber',
    cyan: 'border-accent-cyan/20 bg-accent-cyan/5 text-accent-cyan',
    red: 'border-accent-red/20 bg-accent-red/5 text-accent-red',
    purple: 'border-accent-purple/20 bg-accent-purple/5 text-accent-purple',
  };

  return (
    <div className={`rounded-2xl border p-4 ${palette[accent] || palette.amber}`}>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] opacity-80">{label}</div>
      <div className="mt-2 text-sm leading-6 text-text-primary">{value}</div>
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
  const [activeSection, setActiveSection] = useState(firstOpenSection);

  useEffect(() => {
    setActiveSection(firstOpenSection);
  }, [firstOpenSection, review]);

  const activeIndex = visibleSections.findIndex((section) => section.key === activeSection);
  const currentSection = visibleSections[activeIndex] || null;
  const summaryText = response?.summary?.trim() || 'Review generated successfully.';
  const verdictText = response?.finalVerdict?.trim() || 'Final verdict not available.';
  const bugText = response?.bugsIssues?.trim() || 'No major bug notes were included in this review.';
  const trimmedBugPreview = bugText.split('\n')[0];
  const trimmedVerdictPreview = verdictText.split('\n')[0];

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

      {response?.complexity?.trim() && (
        <ComplexityVisualizer
          complexityText={response.complexity}
          optimizationText={response.optimizationSuggestions}
          code={review.code}
        />
      )}

      <div className="glass-card p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-text-muted">Guided Review</div>
            <h3 className="mt-2 font-display font-bold text-xl text-text-primary">One focused answer at a time</h3>
            <p className="mt-2 text-sm text-text-secondary max-w-2xl">
              Use the section chips below to move through the review without getting stuck in one huge wall of content.
            </p>
          </div>
          <div className="badge bg-bg-elevated border border-border text-text-secondary">
            {activeIndex + 1} of {visibleSections.length}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <OverviewCard label="TL;DR" value={summaryText.split('\n')[0]} accent="amber" />
          <OverviewCard label="Top Risk" value={trimmedBugPreview} accent="red" />
          <OverviewCard label="Verdict" value={trimmedVerdictPreview} accent="purple" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {visibleSections.map((section) => {
            const active = section.key === activeSection;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? 'border-[#f4d4a0] bg-[#fff4df] text-accent-amber'
                    : 'border-border bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                <span>{section.emoji}</span>
                <span className="font-display">{section.label}</span>
              </button>
            );
          })}
        </div>

        {currentSection && (
          <SectionCard
            section={currentSection}
            content={response[currentSection.key]}
            language={language}
            interviewMode={interviewMode}
          />
        )}

        {visibleSections.length > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveSection(visibleSections[Math.max(0, activeIndex - 1)].key)}
              disabled={activeIndex <= 0}
              className="btn-secondary text-sm gap-2 disabled:opacity-50"
            >
              <ArrowLeft size={15} />
              Previous
            </button>
            <button
              type="button"
              onClick={() => setActiveSection(visibleSections[Math.min(visibleSections.length - 1, activeIndex + 1)].key)}
              disabled={activeIndex === -1 || activeIndex >= visibleSections.length - 1}
              className="btn-primary text-sm gap-2"
            >
              Next
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
