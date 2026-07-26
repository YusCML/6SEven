import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Alert from '@/components/ui/Alert';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextField from '@/components/ui/TextField';
import useSession from '@/hooks/useSession';
import { errorMessage } from '@/lib/http';
import * as accountApi from '../api';

/**
 * Profile details. Signed-in visitors edit and save their username and email;
 * guests see the same layout filled with their generated identity, read-only.
 */
export default function ProfileDetailsForm() {
  const { user, isAuthenticated, isLoading, displayName, applySession } = useSession();
  const [form, setForm] = useState({ username: '', email: '' });
  const [status, setStatus] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [seededFor, setSeededFor] = useState<string | null>(null);

  // Seed the fields once the session resolves, and again if the account changes.
  // Adjusting state during render (rather than in an effect) avoids the extra
  // pass that would briefly paint empty inputs.
  const currentUserId = user?.id ?? null;

  if (seededFor !== currentUserId) {
    setSeededFor(currentUserId);
    setForm({ username: user?.username ?? '', email: user?.email ?? '' });
    setStatus(null);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setSaving(true);

    try {
      const data = await accountApi.updateProfile(form);

      applySession(data);
      // Show the server's normalized values (trimmed username, lower-cased email).
      if (data.user) setForm({ username: data.user.username, email: data.user.email });
      setStatus({ tone: 'success', message: 'Profile saved.' });
    } catch (error) {
      setStatus({ tone: 'error', message: errorMessage(error, 'Could not save your profile.') });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading your profile…</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField disabled readOnly label="Username" type="text" value={displayName} />
          <TextField disabled readOnly label="Email" type="email" value="" placeholder="Not set for guests" />
        </div>
        <Alert tone="info">
          You&apos;re browsing as <strong>{displayName}</strong>. Your session keeps your place around the site —{' '}
          <Link href="/auth/register" className="font-bold underline">
            create an account
          </Link>{' '}
          or{' '}
          <Link href="/auth/login" className="font-bold underline">
            sign in
          </Link>{' '}
          to save your details.
        </Alert>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          required
          label="Username"
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
        />
        <TextField
          required
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
      </div>

      {status ? <Alert tone={status.tone}>{status.message}</Alert> : null}

      <div className="flex justify-end">
        <div className="w-full sm:w-48">
          <PrimaryButton type="submit" loading={saving} loadingLabel="Saving…">
            Save Profile
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
