import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import { PencilIcon, XIcon } from '@/components/icons';
import useSession from '@/hooks/useSession';
import ProfileDetailsForm from './ProfileDetailsForm';
import ProfilePhotoPicker from './ProfilePhotoPicker';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-bold text-slate-900">{value}</dd>
    </div>
  );
}

function monthAndYear(iso?: string) {
  if (!iso) return '—';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
}

export default function InformationCard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, displayName, signOut } = useSession();
  const [editing, setEditing] = useState(false);
  const [photoStatus, setPhotoStatus] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push('/home');
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex justify-center">
        {isAuthenticated ? (
          <ProfilePhotoPicker onStatus={setPhotoStatus}>
            <span className="inline-flex rounded-full ring-2 ring-amber-400 ring-offset-4 ring-offset-white">
              <Avatar name={displayName} src={user?.avatarUrl} size="lg" />
            </span>
          </ProfilePhotoPicker>
        ) : (
          <span className="inline-flex rounded-full ring-2 ring-slate-200 ring-offset-4 ring-offset-white">
            <Avatar name={displayName} size="lg" />
          </span>
        )}
      </div>

      {photoStatus ? (
        <div className="mt-6">
          <Alert tone={photoStatus.tone}>{photoStatus.message}</Alert>
        </div>
      ) : null}

      {isLoading ? (
        <p className="mt-8 text-sm text-slate-400">Loading your profile…</p>
      ) : editing ? (
        <div className="mt-8">
          <ProfileDetailsForm onSaved={() => setEditing(false)} />
        </div>
      ) : (
        <dl className="mt-8 space-y-4">
          <Field label="Username" value={user?.username ?? displayName} />
          <Field label="Nickname" value={user?.nickname ?? '—'} />
          <Field label="Member Since" value={isAuthenticated ? monthAndYear(user?.createdAt) : '—'} />

          <div>
            <dt className="text-xs font-semibold text-slate-400">Account Status</dt>
            <dd className="mt-1.5">
              {isAuthenticated ? (
                <Badge tone="success">Verified Commuter</Badge>
              ) : (
                <Badge tone="neutral">Guest Session</Badge>
              )}
            </dd>
          </div>
        </dl>
      )}

      <div className="mt-8 space-y-1">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              onClick={() => setEditing(!editing)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-100 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            >
              {editing ? <XIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
              {editing ? 'Cancel' : 'Edit'}
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex h-11 w-full items-center justify-center rounded-lg text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              Sign Out
            </button>
          </>
        ) : isLoading ? null : (
          <Link
            href="/auth/login"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
