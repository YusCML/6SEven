import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      router.push('/home');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="text-center mb-8">
          <span className="text-3xl">🌐</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Log in to check your local transit routes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
            <input required type="email" placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Remember me
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 text-white font-medium py-3 rounded-lg shadow-sm transition mt-2">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}