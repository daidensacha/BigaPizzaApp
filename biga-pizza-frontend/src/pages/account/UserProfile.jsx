// src/pages/account/UserProfile.jsx
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Dice6, RotateCcw, CheckCircle } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/config';
import AvatarGenerator from '@/components/profile/AvatarGenerator';

export default function UserProfile() {
  const { user, token, logout, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Avatar state (only style + seed; we can regenerate image from those)
  const [style, setStyle] = useState(user?.avatarStyle || 'kaleido');
  const [seed, setSeed] = useState(user?.avatarSeed || 'BigaPizza');
  const [preview, setPreview] = useState(null); // data URL from the generator

  // Password change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const avatarChanged =
    style !== (user?.avatarStyle || 'kaleido') ||
    seed !== (user?.avatarSeed || 'BigaPizza');

  useEffect(() => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setStyle(user?.avatarStyle || 'kaleido');
    setSeed(user?.avatarSeed || 'BigaPizza');
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const payload = {
        name,
        bio,
        avatarStyle: style,
        avatarSeed: seed,
      };

      const { data } = await axios.patch(
        `${API_BASE}/api/user/profile`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Prefer server-returned user if provided
      updateUser(data?.user || payload);
      toast.success('Profile updated');
    } catch (err) {
      console.error('Save profile error', err);
      toast.error('Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) {
      toast.error('Please fill in both fields');
      return;
    }
    try {
      setPwSaving(true);
      await axios.post(
        `${API_BASE}/api/auth/change-password`, // <-- FIXED
        { currentPassword: currentPw, newPassword: newPw },
        { headers: { Authorization: `Bearer ${token}` } } // <-- using token from context (good)
      );

      toast.success('Password changed. Please log in again.');
      setCurrentPw('');
      setNewPw('');

      // Optional but recommended: force re-login since tokenVersion bumped
      await logout?.();
    } catch (err) {
      console.error('Change password error', err);
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="max-w-6xl mx-auto mb-6 px-2 sm:px-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Update your personal info, avatar, and password.
        </p>
      </div>

      {/* Content grid */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* MAIN COLUMN (Avatar + Profile form) */}
          <section className="lg:col-span-2 space-y-6">
            {/* Avatar block */}
            <div className="rounded-xl border border-stone-200/70 dark:border-stone-700 bg-white/80 dark:bg-stone-900 p-4">
              <div className="flex items-center gap-6 flex-wrap">
                <AvatarGenerator
                  type={style}
                  seed={seed}
                  size={64}
                  onChange={({ type, seed }) => {
                    setStyle(type);
                    setSeed(seed);
                  }}
                />
                <div className="flex gap-2">
                  {/* <button
                    onClick={() => setSeed(Date.now().toString())} // Roll again
                    title="Roll Again"
                    className="p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <Dice6 className="w-5 h-5" />
                  </button> */}
                  <button
                    onClick={() => {
                      setStyle('kaleido');
                      setSeed('BigaPizza');
                    }}
                    title="Reset Avatar"
                    className="p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    title="Save Avatar"
                    disabled={!avatarChanged}
                    className={`p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 ${
                      avatarChanged ? 'text-green-600' : 'text-stone-400'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            {/* Profile form card */}
            <div className="rounded-xl border border-stone-200/70 dark:border-stone-700 bg-white/80 dark:bg-stone-900 p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Account Info</h2>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className={`px-3 py-1 rounded ${
                    saving
                      ? 'bg-emerald-400'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
              <div className="grid gap-4">
                <label className="grid gap-1">
                  <span className="text-sm font-medium">Name</span>
                  <input
                    className="h-9 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-medium">Email</span>
                  <input
                    className="h-9 rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 px-3 text-sm"
                    value={email}
                    disabled
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-medium">Bio</span>
                  <textarea
                    rows={4}
                    className="rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell people about your pizza vibe…"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* SIDE COLUMN (Password + future cards) */}
          <aside className="space-y-6 lg:sticky lg:top-16 self-start">
            {/* Change Password */}
            <div className="rounded-xl border border-stone-200/70 dark:border-stone-700 bg-white/80 dark:bg-stone-900 p-4">
              <h2 className="text-lg font-semibold mb-3">Change Password</h2>
              <div className="grid gap-4">
                <div>
                  <label className="text-xs font-semibold text-yellow-700 dark:text-stone-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-yellow-700 dark:text-stone-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleChangePassword}
                  disabled={pwSaving}
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 w-full"
                >
                  {pwSaving ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
