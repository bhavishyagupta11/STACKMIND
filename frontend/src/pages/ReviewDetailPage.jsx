import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getReviewById, deleteReview } from '../services/reviewService';
import ReviewOutput from '../components/ReviewOutput';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Clock, Code2, Mic, Trash2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReviewById(id);
        setReview(data.review);
      } catch {
        toast.error('Review not found');
        navigate('/history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      toast.success('Deleted');
      navigate('/history');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(review.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!review) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to="/history" className="btn-ghost p-2 mt-0.5">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-xl text-text-primary truncate">{review.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="badge bg-bg-elevated border border-border text-text-secondary font-mono">
              <Code2 size={11} /> {review.language}
            </span>
            {review.interviewMode && (
              <span className="badge bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
                <Mic size={10} /> Interview Mode
              </span>
            )}
            {review.isFallback && (
              <span className="badge bg-accent-amber/10 text-accent-amber border border-accent-amber/20">
                Fallback Analysis
              </span>
            )}
            <div className="flex items-center gap-1 text-text-muted text-xs font-mono">
              <Clock size={11} />
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="btn-ghost text-text-secondary hover:text-accent-red hover:bg-accent-red/10 p-2 flex-shrink-0"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Submitted code toggle */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-bg-overlay transition-colors"
        >
          <div className="flex items-center gap-2 text-text-secondary text-sm font-mono">
            <Code2 size={14} />
            Submitted Code ({review.code.split('\n').length} lines)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">{showCode ? 'Hide' : 'Show'}</span>
          </div>
        </button>

        {showCode && (
          <div className="border-t border-border">
            <div className="flex justify-end px-4 py-2 bg-bg-surface">
              <button onClick={handleCopyCode} className="btn-ghost text-xs gap-1.5 px-2 py-1">
                {copied ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy code'}
              </button>
            </div>
            <SyntaxHighlighter
              language={review.language}
              style={oneLight}
              showLineNumbers
              customStyle={{
                margin: 0,
                padding: '16px',
                background: '#fcfbf8',
                fontSize: '12px',
                lineHeight: '1.7',
                fontFamily: '"JetBrains Mono", monospace',
                maxHeight: '400px',
              }}
            >
              {review.code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {(review.focusAreas?.length > 0 || review.customInstructions || review.contextNotes) && (
        <div className="glass-card p-5 space-y-4">
          <div>
            <h2 className="font-display font-semibold text-text-primary">Review context</h2>
            <p className="text-text-secondary text-sm mt-1">Saved review preferences and context used for this run.</p>
          </div>

          {review.focusAreas?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.focusAreas.map((item) => (
                <span key={item} className="badge bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                  {item}
                </span>
              ))}
            </div>
          )}

          {review.customInstructions && (
            <div>
              <div className="text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Custom instructions</div>
              <p className="text-text-secondary text-sm whitespace-pre-wrap">{review.customInstructions}</p>
            </div>
          )}

          {review.contextNotes && (
            <div>
              <div className="text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Project context</div>
              <p className="text-text-secondary text-sm whitespace-pre-wrap">{review.contextNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* Review output */}
      <ReviewOutput review={review} />

      {/* Bottom navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Link to="/history" className="btn-secondary text-sm gap-2">
          <ArrowLeft size={15} /> Back to History
        </Link>
        <Link to="/review" className="btn-primary text-sm">
          New Review
        </Link>
      </div>
    </div>
  );
}
