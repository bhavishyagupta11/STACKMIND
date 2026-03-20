import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { signupUser } from '../services/authService';
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const data = await signupUser(form);
      login(data.user, data.token);
      toast.success(`Account created! Welcome, ${data.user.name} 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-amber/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-amber to-[#ffbf66] flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_10px_24px_rgba(255,161,22,0.20)]">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">STACKMIND</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-text-primary">Create your account</h1>
          <p className="text-text-secondary text-sm mt-1.5">Start reviewing code with STACKMIND today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-text-secondary text-xs font-mono mb-2 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-field pl-10"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-text-secondary text-xs font-mono mb-2 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field pl-10"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-text-secondary text-xs font-mono mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-field pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 mt-2" disabled={loading}>
            {loading ? (
              <div className="w-4 h-4 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Create account <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-amber hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
