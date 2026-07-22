import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { readJsonResponse } from '@/services/http/client';
import AuthPageLayout from './AuthPageLayout';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await readJsonResponse<{ error?: string }>(response);

      if (!response.ok) throw new Error(data.error || 'Login failed.');

      router.push('/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout icon="🌐" title="Welcome Back" description="Log in to check your local transit routes" containerClassName="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleLogin} className="space-y-4">
        <FormField required label="Email Address" type="email" placeholder="name@domain.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        <FormField required label="Password" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} />
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Remember me
          </label>
          <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
        </div>
        {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 text-white font-medium py-3 rounded-lg shadow-sm transition mt-2">
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-6">
        Don&apos;t have an account? <Link href="/auth/register" className="text-blue-600 font-medium hover:underline">Create one</Link>
      </p>
    </AuthPageLayout>
  );
}
