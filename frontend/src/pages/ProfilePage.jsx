import React, { useEffect, useState } from 'react';
import { Save, Shield, User, Mail, Lock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateProfile as updateProfileRequest } from '../services/authService';
import { useAuth } from '../utils/AuthContext';

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    ...initialPasswordForm,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
    }));
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const wantsPasswordChange = Boolean(form.currentPassword || form.newPassword || form.confirmPassword);

    if (!trimmedName || !trimmedEmail) {
      toast.error('Name and email are required');
      return;
    }

    if (trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (wantsPasswordChange) {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        toast.error('Fill in all password fields to change your password');
        return;
      }

      if (form.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
    }

    setSaving(true);
    try {
      const data = await updateProfileRequest({
        name: trimmedName,
        email: trimmedEmail,
        currentPassword: wantsPasswordChange ? form.currentPassword : '',
        newPassword: wantsPasswordChange ? form.newPassword : '',
      });

      updateUser(data.user);
      setForm((prev) => ({
        ...prev,
        name: data.user.name,
        email: data.user.email,
        ...initialPasswordForm,
      }));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <section className="relative overflow-hidden glass-card p-6 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-purple/10 pointer-events-none" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-lg shadow-accent-cyan/10">
              <User size={24} className="text-bg-base" />
            </div>
            <div>
              <div className="badge bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 mb-3">
                <Sparkles size={12} />
                Account Center
              </div>
              <h1 className="font-display font-bold text-2xl text-text-primary">Edit profile</h1>
              <p className="text-text-secondary text-sm mt-1 max-w-xl">
                Keep your account details current. Changes save instantly and refresh across the app.
              </p>
            </div>
          </div>

          <div className="glass-card px-4 py-3 min-w-[220px]">
            <div className="text-text-muted text-xs font-mono uppercase tracking-[0.2em] mb-1">Signed in as</div>
            <div className="text-text-primary font-display font-semibold truncate">{user?.name}</div>
            <div className="text-text-secondary text-sm font-mono truncate">{user?.email}</div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
        <section className="section-card space-y-5">
          <div>
            <h2 className="font-display font-semibold text-text-primary">Public details</h2>
            <p className="text-text-secondary text-sm mt-1">These details appear anywhere your account is shown.</p>
          </div>

          <div>
            <label className="block text-text-secondary text-xs font-mono mb-2 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field pl-10"
                autoComplete="name"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-secondary text-xs font-mono mb-2 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field pl-10"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </section>

        <section className="section-card space-y-5">
          <div>
            <div className="flex items-center gap-2 text-text-primary">
              <Shield size={16} className="text-accent-purple" />
              <h2 className="font-display font-semibold">Security</h2>
            </div>
            <p className="text-text-secondary text-sm mt-1">Leave these blank if you do not want to change your password.</p>
          </div>

          <div>
            <label className="block text-text-secondary text-xs font-mono mb-2 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                className="input-field pl-10"
                autoComplete="current-password"
                placeholder="Required to change password"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-secondary text-xs font-mono mb-2 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="input-field pl-10"
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-secondary text-xs font-mono mb-2 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-field pl-10"
                autoComplete="new-password"
                placeholder="Repeat your new password"
              />
            </div>
          </div>
        </section>

        <div className="xl:col-span-2 flex justify-end">
          <button type="submit" className="btn-primary min-w-[180px] justify-center" disabled={saving}>
            {saving ? (
              <div className="w-4 h-4 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Save changes
                <Save size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
