import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, deleteReview } from '../services/reviewService';
import { Code2, Clock, Trash2, ArrowRight, Search, Mic, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LANG_COLORS = {
  javascript: 'text-accent-amber border-accent-amber/30 bg-accent-amber/10',
  typescript: 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10',
  python:     'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10',
  java:       'text-accent-red border-accent-red/30 bg-accent-red/10',
  cpp:        'text-accent-purple border-accent-purple/30 bg-accent-purple/10',
  c:          'text-accent-purple border-accent-purple/30 bg-accent-purple/10',
  go:         'text-accent-green border-accent-green/30 bg-accent-green/10',
  rust:       'text-accent-amber border-accent-amber/30 bg-accent-amber/10',
  default:    'text-text-secondary border-border bg-bg-elevated',
};

function ReviewCard({ review, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const langClass = LANG_COLORS[review.language] || LANG_COLORS.default;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteReview(review._id);
      onDelete(review._id);
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete');
      setDeleting(false);
    }
  };

  return (
    <Link
      to={`/history/${review._id}`}
      className="glass-card-hover p-5 flex items-start gap-4 group animate-slide-up"
    >
      <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
        <Code2 size={17} className="text-text-secondary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-text-primary font-mono text-sm font-medium truncate">{review.title}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className={`badge border text-xs font-mono ${langClass}`}>{review.language}</span>
          {review.interviewMode && (
            <span className="badge bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
              <Mic size={10} /> Interview
            </span>
          )}
          {review.isFallback && (
            <span className="badge bg-accent-amber/10 text-accent-amber border border-accent-amber/20">
              Fallback
            </span>
          )}
          <div className="flex items-center gap-1 text-text-muted text-xs font-mono ml-auto">
            <Clock size={11} />
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>
        </div>

        {/* Preview first line of verdict */}
        {review.response?.finalVerdict && (
          <p className="text-text-muted text-xs mt-2 line-clamp-1 font-body">
            {review.response.finalVerdict.slice(0, 120)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-accent-red/10 hover:text-accent-red text-text-muted transition-all"
        >
          {deleting ? <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" /> : <Trash2 size={14} />}
        </button>
        <ArrowRight size={14} className="text-text-muted group-hover:text-accent-amber transition-colors" />
      </div>
    </Link>
  );
}

export default function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchHistory = async (p = 1) => {
    setLoading(true);
    try {
      const data = await getHistory(p, 10);
      setReviews(data.reviews);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(page); }, [page]);

  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((r) => r._id !== id));
    setTotal((t) => t - 1);
  };

  const filtered = reviews.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.language?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Review History</h1>
          <p className="text-text-secondary text-sm mt-1">{total} total review{total !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/review" className="btn-primary text-sm">
          + New Review
        </Link>
      </div>

      {/* Search */}
      <div className="glass-card p-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or language..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-xl shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <AlertCircle size={36} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-display font-medium">
            {search ? 'No reviews match your search' : 'No reviews yet'}
          </p>
          {!search && (
            <Link to="/review" className="btn-primary text-sm mt-4 inline-flex">
              Start your first review
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ReviewCard key={r._id} review={r} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary px-3 py-2"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-text-secondary text-sm font-mono">
            {page} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="btn-secondary px-3 py-2"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
