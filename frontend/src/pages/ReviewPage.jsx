import React, { useState, useRef } from 'react';
import { submitReview } from '../services/reviewService';
import CodeEditor from '../components/CodeEditor';
import ReviewOutput from '../components/ReviewOutput';
import AnalyzingLoader from '../components/AnalyzingLoader';
import { LANGUAGES, ACCEPTED_EXTENSIONS, detectLanguageFromFilename } from '../utils/languages';
import {
  Code2, Upload, Zap, RotateCcw, Mic, MicOff,
  ChevronDown, FileCode, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_CODE = `// Paste your code here or upload a file
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`;

export default function ReviewPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState('javascript');
  const [interviewMode, setInterviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'upload'
  const [fileName, setFileName] = useState(null);
  const fileRef = useRef();
  const resultRef = useRef();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 500 KB limit
    if (file.size > 500 * 1024) {
      return toast.error('File too large. Max size is 500 KB.');
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCode(ev.target.result);
      setFileName(file.name);
      // Auto-detect language from extension
      const detected = detectLanguageFromFilename(file.name);
      setLanguage(detected);
      setActiveTab('editor');
      toast.success(`Loaded: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!code.trim()) return toast.error('Please enter some code to review');
    if (code.trim().length < 10) return toast.error('Code is too short to analyze');

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await submitReview({ code, language, interviewMode });
      setResult(data.review);
      // Scroll to results
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      if (data.isFallback) {
        toast('Review completed in fallback mode', { icon: '⚠️' });
      } else {
        toast.success('Code review complete!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Review failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setLanguage('javascript');
    setInterviewMode(false);
    setResult(null);
    setError(null);
    setFileName(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">New Code Review</h1>
          <p className="text-text-secondary text-sm mt-1">Paste your code or upload a file for AI-powered analysis</p>
        </div>
        {result && (
          <button onClick={handleReset} className="btn-ghost gap-2 text-text-secondary">
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      {/* Controls row */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field pr-9 appearance-none cursor-pointer min-w-[140px]"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-mono transition-colors
                ${activeTab === 'editor' ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'}`}
            >
              <Code2 size={13} /> Editor
            </button>
            <button
              onClick={() => { setActiveTab('upload'); fileRef.current?.click(); }}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-mono transition-colors border-l border-border
                ${activeTab === 'upload' ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'}`}
            >
              <Upload size={13} /> Upload
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Filename badge */}
          {fileName && (
            <div className="flex items-center gap-1.5 badge bg-bg-overlay border border-border text-text-secondary">
              <FileCode size={11} /> {fileName}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Interview mode toggle */}
          <button
            onClick={() => setInterviewMode(!interviewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium border transition-all duration-200
              ${interviewMode
                ? 'bg-accent-pink/10 text-accent-pink border-accent-pink/30'
                : 'bg-bg-overlay text-text-secondary border-border hover:border-border-bright'
              }`}
          >
            {interviewMode ? <Mic size={13} /> : <MicOff size={13} />}
            Interview Mode
            <span className={`w-6 h-3.5 rounded-full relative flex-shrink-0 transition-colors ${interviewMode ? 'bg-accent-pink' : 'bg-bg-overlay border border-border-bright'}`}>
              <span className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all duration-200 ${interviewMode ? 'left-3' : 'left-0.5'}`} />
            </span>
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary glow-cyan"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap size={15} />
            )}
            {loading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>

        {/* Interview mode info */}
        {interviewMode && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-accent-pink/5 border border-accent-pink/20">
            <Mic size={13} className="text-accent-pink flex-shrink-0" />
            <p className="text-accent-pink text-xs font-mono">
              Interview Mode ON — review will include interview explanation and follow-up questions
            </p>
          </div>
        )}
      </div>

      {/* Monaco Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-xs font-mono uppercase tracking-wider">Code Editor</span>
          <span className="text-text-muted text-xs font-mono">{code.split('\n').length} lines</span>
        </div>
        <CodeEditor code={code} onChange={setCode} language={language} />
      </div>

      {/* Results area */}
      <div ref={resultRef}>
        {loading && (
          <div className="glass-card">
            <AnalyzingLoader />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-start gap-3 p-5 rounded-xl border border-accent-red/30 bg-accent-red/5">
            <AlertCircle size={18} className="text-accent-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-accent-red font-semibold text-sm font-display">Review Failed</p>
              <p className="text-text-secondary text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-accent-cyan" />
              <h2 className="font-display font-bold text-lg text-text-primary">Review Results</h2>
              <span className="badge bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 ml-auto">
                {result.language}
              </span>
              {result.interviewMode && (
                <span className="badge bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
                  Interview Mode
                </span>
              )}
            </div>
            <ReviewOutput review={result} />
          </div>
        )}
      </div>
    </div>
  );
}
