import type React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    router.push('/home');
  };

  return (
    /* Dynamic layout without hard-coded heights */
    <div className="flex-1 w-full flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="text-center mb-8">
          <span className="text-3xl">🌐</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Log in to check your local transit routes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
            <input
              id="email"
              required
              type="email"
              placeholder="name@domain.com"
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <input
              id="password"
              required
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label htmlFor="remember" className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input id="remember" type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm transition mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
