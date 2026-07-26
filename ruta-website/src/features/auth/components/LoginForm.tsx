import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapPinIcon, SearchIcon } from '@/components/icons';
import useSession from '@/hooks/useSession';
import { readJsonResponse } from '@/services/http/client';
import type { SessionPayload } from '@/types/session';
import Alert from '@/components/ui/Alert';
import Checkbox from '@/components/ui/Checkbox';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextField from '@/components/ui/TextField';
import AuthCard from './AuthCard';
import AuthStatusStrip from './AuthStatusStrip';
import SocialAuthButtons from './SocialAuthButtons';

export default function LoginForm() {
  const router = useRouter();
  const { applySession } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Sessions already last 30 days, so this reflects real behaviour.
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  // Set by the register form after a successful sign-up.
  const justRegistered = router.query.registered === '1';

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });
      const data = await readJsonResponse<SessionPayload & { error?: string }>(response);

      if (!response.ok) throw new Error(data.error || 'Login failed.');

      // Adopt the session from the response — no extra round trip on redirect.
      applySession(data);
      router.push('/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back!"
      description="Sign in to manage your routes and commute alerts."
      footer={<AuthStatusStrip status="System Status: Online" />}
    >
      {justRegistered ? (
        <Alert tone="success" className="mb-5">
          Account created. Sign in with your new email and password to continue.
        </Alert>
      ) : null}

      <form onSubmit={handleLogin} className="space-y-5">
        <TextField
          required
          label="Email Address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="name@example.com"
          icon={<SearchIcon className="h-4 w-4" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <TextField
          required
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<MapPinIcon className="h-3 w-4" />}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          labelAction={
            <Link href="/auth/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
              Forgot password?
            </Link>
          }
        />

        <Checkbox checked={rememberMe} onChange={setRememberMe} name="rememberMe">
          Remember me for 30 days
        </Checkbox>

        {error ? <Alert tone="error">{error}</Alert> : null}
        {notice ? <Alert tone="info">{notice}</Alert> : null}

        <PrimaryButton withChevron type="submit" loading={loading} loadingLabel="Signing In…">
          Sign In
        </PrimaryButton>
      </form>

      <div className="mt-8">
        <SocialAuthButtons
          label="Or continue with"
          onSelect={(provider) => {
            setError('');
            setNotice(`${provider} sign-in isn't available yet. Please use your email and password.`);
          }}
        />
      </div>

      <p className="mt-8 text-center text-sm font-medium text-slate-500">
        New to RUTA?{' '}
        <Link href="/auth/register" className="font-bold text-blue-600 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
