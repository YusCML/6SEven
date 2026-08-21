import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Alert from '@/components/ui/Alert';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextField from '@/components/ui/TextField';
import useSession from '@/hooks/useSession';
import { errorMessage } from '@/lib/http';
import * as accountApi from '@/services/account.service';

export default function ProfileDetailsForm({ onSaved }: { onSaved?: () => void } = {}) {
  const { user, isAuthenticated, isLoading, displayName, applySession } = useSession();
  const [form, setForm] = useState({ nickname: '', username: '' });
  const [status, setStatus] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [seededFor, setSeededFor] = useState<string | null>(null);

  const currentUserId = user?.id ?? null;

  if (seededFor !== currentUserId) {
    setSeededFor(currentUserId);
    setForm({ nickname: user?.nickname ?? '', username: user?.username ?? '' });
    setStatus(null);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setSaving(true);

    try {
      const data = await accountApi.updateProfile(form);

      applySession(data);
      if (data.user) {
        setForm({
          nickname: data.user.nickname ?? '',
          username: data.user.username,
        });
      }
      setStatus({ tone: 'success', message: 'Profile saved.' });
      onSaved?.();
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
        <div className="grid grid-cols-1 gap-4">
          <TextField disabled readOnly label="Username" type="text" value={displayName} />
          <TextField disabled readOnly label="Nickname" type="text" value="" placeholder="Not set for guests" />
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
      <div className="grid grid-cols-1 gap-4">
        <TextField
          required
          label="Nickname"
          type="text"
          autoComplete="nickname"
          placeholder="Shown around the site"
          value={form.nickname}
          onChange={(event) => setForm({ ...form, nickname: event.target.value })}
        />
        <TextField
          required
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="No spaces"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
        />
      </div>

      {status ? <Alert tone={status.tone}>{status.message}</Alert> : null}

      <div className="flex justify-end">
        <div className="w-full">
          <PrimaryButton type="submit" loading={saving} loadingLabel="Saving…">
            Save Profile
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
