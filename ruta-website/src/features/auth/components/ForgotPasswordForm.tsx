import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { SearchIcon } from '@/components/icons';
import Alert from '@/components/ui/Alert';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextField from '@/components/ui/TextField';
import { readJsonResponse } from '@/services/http/client';
import AuthCard from './AuthCard';
import AuthStatusStrip from './AuthStatusStrip';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
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
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email }),
      });
      const data = await readJsonResponse<{ error?: string; message?: string }>(response);

      if (!response.ok) throw new Error(data.error || 'Unable to send reset link.');

      setMessage(data.message || `Reset instructions were sent to ${email}.`);
      setSubmitted(true);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Unable to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      description="We will email you the steps to restore access."
      footer={<AuthStatusStrip status="System Status: Online" />}
    >
      {submitted ? (
        <Alert tone="success">{message}</Alert>
      ) : (
        <form onSubmit={handleReset} className="space-y-5">
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
