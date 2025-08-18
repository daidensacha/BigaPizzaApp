import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '@/services/authService';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get('email') || '';
  const token = params.get('token') || '';

  const [pw, setPw] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pw) return toast.error('Enter a new password');
    try {
      setSaving(true);
      await resetPassword({ email, token, newPassword: pw });
      toast.success('Password reset. Please log in.');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('reset error', err);
      toast.error(err?.response?.data?.message || 'Reset failed');
    } finally {
      setSaving(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-semibold">Invalid reset link</h1>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          The link is missing required parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-2">Set a new password</h1>
      <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
        for <span className="font-mono">{email}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="New password"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-stone-700 dark:border-stone-600"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md disabled:opacity-60"
        >
          {saving ? 'Updating…' : 'Reset password'}
        </button>
        {/* inside ResetPassword.jsx, under the submit button */}
        <button
          type="button"
          className="w-full mt-2 border border-stone-300 dark:border-stone-600 py-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700"
          onClick={() => navigate('/?auth=login', { replace: true })}
        >
          Back to login
        </button>
      </form>
    </div>
  );
}
