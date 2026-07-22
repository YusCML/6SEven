import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Unable to send reset link.');
      }

      setMessage(data.message || `Reset instructions were sent to ${email}.`);
      setSubmitted(true);
    } catch (resetError) {
      setMessage(resetError instanceof Error ? resetError.message : 'Unable to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="text-center mb-6">
          <span className="text-3xl">🔑</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Reset Password</h2>
          <p className="text-sm text-slate-500 mt-1">We will email you steps to restore access.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
              <input 
                required 
                type="email" 
                placeholder="name@domain.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 text-white font-medium py-3 rounded-lg shadow-sm transition">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm text-center">
            📬 {message || `Reset verification path dispatched to ${email} if an account matches.`}
          </div>
        )}

        {message && !submitted ? (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center text-sm text-blue-800">{message}</div>
        ) : null}

        <div className="text-center text-sm font-medium mt-6 pt-4 border-t border-slate-100">
          <Link href="/login" className="text-blue-600 hover:underline">← Back to Log In</Link>
        </div>
      </div>
    </div>
  );
}