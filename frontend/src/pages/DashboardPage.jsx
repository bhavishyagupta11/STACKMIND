import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { getHistory } from '../services/reviewService';
import { Code2, History, Zap, ArrowRight, Clock, BookOpen, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    cyan: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
    purple: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
    green: 'text-accent-green bg-accent-green/10 border-accent-green/20',
  };
  return (
    <div className="glass-card p-5">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div className="text-2xl font-display font-bold text-text-primary">{value}</div>
      <div className="text-text-secondary text-xs font-mono mt-1">{label}</div>
    </div>
  );
}

function RecentReviewCard({ review }) {
  const langColors = {
    javascript: 'text-accent-amber', python: 'text-accent-cyan', java: 'text-accent-red',
    cpp: 'text-accent-purple', typescript: 'text-accent-cyan', go: 'text-accent-green',
  };
  const color = langColors[review.language] || 'text-text-secondary';

  return (
    <Link to={`/history/${review._id}`} className="glass-card-hover p-4 flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center flex-shrink-0">
        <Code2 size={16} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-text-primary text-sm font-medium font-mono truncate">{review.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs font-mono ${color}`}>{review.language}</span>
          {review.interviewMode && (
            <span className="badge bg-accent-pink/10 text-accent-pink border border-accent-pink/20 text-xs">
              Interview
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-text-muted text-xs flex-shrink-0">
        <Clock size={11} />
        {new Date(review.createdAt).toLocaleDateString()}
      </div>
      <ArrowRight size={14} className="text-text-muted group-hover:text-accent-amber transition-colors" />
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [recent, setRecent] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getHistory(1, 5);
        setRecent(data.reviews);
        setTotal(data.total);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const interviewCount = recent.filter((r) => r.interviewMode).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Good day, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-text-secondary text-sm mt-1">Here's your code review overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={BookOpen} label="Total Reviews" value={total} color="cyan" />
        <StatCard icon={TrendingUp} label="This Session" value={recent.length} color="purple" />
        <StatCard icon={Zap} label="Interview Reviews" value={interviewCount} color="green" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/review" className="glass-card-hover p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#fff4df]
                            border border-[#f4d4a0] flex items-center justify-center transition-transform">
              <Code2 size={22} className="text-accent-amber" />
            </div>
            <div>
              <div className="font-display font-semibold text-text-primary">New Code Review</div>
              <div className="text-text-secondary text-xs mt-0.5">Paste or upload code for AI analysis</div>
            </div>
            <ArrowRight size={16} className="ml-auto text-text-muted group-hover:text-accent-amber transition-colors" />
          </div>
        </Link>

        <Link to="/history" className="glass-card-hover p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f3f2ff]
                            border border-[#d8d1ff] flex items-center justify-center transition-transform">
              <History size={22} className="text-accent-purple" />
            </div>
            <div>
              <div className="font-display font-semibold text-text-primary">Review History</div>
              <div className="text-text-secondary text-xs mt-0.5">Browse all {total} past reviews</div>
            </div>
            <ArrowRight size={16} className="ml-auto text-text-muted group-hover:text-accent-purple transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-text-primary">Recent Reviews</h2>
          {total > 5 && (
            <Link to="/history" className="text-accent-amber text-xs font-mono hover:underline">
              View all →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl shimmer" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Code2 size={36} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-display font-medium">No reviews yet</p>
            <p className="text-text-muted text-sm mt-1 mb-5">Submit your first code review to get started</p>
            <Link to="/review" className="btn-primary text-sm">
              Start reviewing <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((r) => <RecentReviewCard key={r._id} review={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
