import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { UserIcon } from '@/components/icons';
import Alert from '@/components/ui/Alert';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextField from '@/components/ui/TextField';
import { errorMessage } from '@/lib/http';
import * as authApi from '@/services/auth.service';
import AuthCard from './AuthCard';
import AuthStatusStrip from './AuthStatusStrip';

export default function ForgotPasswordForm() {
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const data = await authApi.requestPasswordReset(username);

      setMessage(data.message || `Reset instructions were prepared for ${username}.`);
      setSubmitted(true);
    } catch (resetError) {
      setError(errorMessage(resetError, 'Unable to send reset link.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      description="Enter your username and we will start the reset."
      footer={<AuthStatusStrip status="System Status: Online" />}
    >
      {submitted ? (
        <Alert tone="success">{message}</Alert>
      ) : (
        <form onSubmit={handleReset} className="space-y-5">
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

          {error ? <Alert tone="error">{error}</Alert> : null}

          <PrimaryButton withChevron type="submit" loading={loading} loadingLabel="Sending…">
            Send Reset Link
          </PrimaryButton>
        </form>
      )}

      <p className="mt-8 text-center text-sm font-medium text-slate-500">
        <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
          ← Back to Log In
        </Link>
      </p>
    </AuthCard>
  );
}
