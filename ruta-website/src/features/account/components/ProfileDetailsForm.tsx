import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import useSession from '@/hooks/useSession';
import { readJsonResponse } from '@/services/http/client';
import type { SessionPayload } from '@/types/session';

const labelClassName = 'block text-xs font-semibold text-slate-400 mb-1';
const inputClassName =
  'w-full border border-slate-200 bg-slate-50 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:text-slate-400';

/**
 * Profile details. Signed-in visitors edit and save their username and email;
 * guests see the same layout filled with their generated identity, read-only.
 */
export default function ProfileDetailsForm() {
  const { user, isAuthenticated, isLoading, displayName, applySession } = useSession();
  const [form, setForm] = useState({ username: '', email: '' });
  const [status, setStatus] = useState<{ kind: 'error' | 'success'; message: string } | null>(null);
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
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(form),
      });
      const data = await readJsonResponse<SessionPayload & { error?: string }>(response);

      if (!response.ok) throw new Error(data.error || 'Could not save your profile.');

      applySession(data);
      // Show the server's normalized values (trimmed username, lower-cased email).
      if (data.user) setForm({ username: data.user.username, email: data.user.email });
      setStatus({ kind: 'success', message: 'Profile saved.' });
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Could not save your profile.' });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            disabled
            label="Username"
            type="text"
            value={displayName}
            readOnly
            labelClassName={labelClassName}
            inputClassName={inputClassName}
          />
          <FormField
            disabled
            label="Email"
            type="email"
            value=""
            readOnly
            placeholder="Not set for guests"
            labelClassName={labelClassName}
            inputClassName={inputClassName}
          />
        </div>
        <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800">
          You&apos;re browsing as <strong>{displayName}</strong>. Your session keeps your place around the site —{' '}
          <Link href="/auth/register" className="font-semibold underline">
            create an account
          </Link>{' '}
          or{' '}
          <Link href="/auth/login" className="font-semibold underline">
            sign in
          </Link>{' '}
          to save your details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          required
          label="Username"
          type="text"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />
        <FormField
          required
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />
      </div>

      {status ? (
        <p
          className={
            status.kind === 'error'
              ? 'rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'
              : 'rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700'
          }
        >
          {status.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded shadow-sm transition"
        >
          {saving ? 'Saving…' : 'Save Profile'}
        </Button>
      </div>
    </form>
  );
}
