import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { readJsonResponse } from '@/services/http/client';
import AuthPageLayout from './AuthPageLayout';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await readJsonResponse<{ error?: string; message?: string }>(response);

      if (!response.ok) throw new Error(data.error || 'Unable to send reset link.');

      setMessage(data.message || `Reset instructions were sent to ${email}.`);
      setSubmitted(true);
    } catch (resetError) {
      setMessage(resetError instanceof Error ? resetError.message : 'Unable to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout icon="🔑" title="Reset Password" description="We will email you steps to restore access." containerClassName="flex-1 w-full flex items-center justify-center bg-slate-50 px-4 py-12" headerClassName="text-center mb-6">
      {!submitted ? (
        <form onSubmit={handleReset} className="space-y-4">
          <FormField required label="Email Address" type="email" placeholder="name@domain.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 text-white font-medium py-3 rounded-lg shadow-sm transition">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      ) : (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm text-center">
          📬 {message || `Reset verification path dispatched to ${email} if an account matches.`}
        </div>
      )}
      {message && !submitted ? <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center text-sm text-blue-800">{message}</div> : null}
      <div className="text-center text-sm font-medium mt-6 pt-4 border-t border-slate-100">
        <Link href="/auth/login" className="text-blue-600 hover:underline">← Back to Log In</Link>
      </div>
    </AuthPageLayout>
  );
}
