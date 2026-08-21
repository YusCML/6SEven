import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LockIcon, UserIcon } from '@/components/icons';
import useSession from '@/hooks/useSession';
import { errorMessage } from '@/lib/http';
import * as authApi from '@/services/auth.service';
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const justRegistered = router.query.registered === '1';
  const redirectError = typeof router.query.error === 'string' ? router.query.error : '';
  const visibleError = error || redirectError;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      applySession(await authApi.login({ username, password }));
      router.push('/dashboard');
    } catch (loginError) {
      setError(errorMessage(loginError, 'Login failed.'));
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
          Account created. Sign in with your new username and password to continue.
        </Alert>
      ) : null}

      <form onSubmit={handleLogin} className="space-y-5">
        <TextField
          required
          label="Username"
          type="text"
          name="username"
          autoComplete="username"
          placeholder="juandelacruz"
          icon={<UserIcon className="h-4 w-4" />}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <TextField
          required
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<LockIcon className="h-4 w-4" />}
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

        {visibleError ? <Alert tone="error">{visibleError}</Alert> : null}
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
            setNotice('');

            if (provider === 'Google') {
              window.location.href = '/api/auth/google/start';
              return;
            }

            setNotice(`${provider} sign-in isn't available yet. Please use your username and password.`);
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
