import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import googleMark from '@/assets/brand/google.svg';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import useSession from '@/hooks/useSession';
import { errorMessage } from '@/lib/http';
import * as accountApi from '@/services/account.service';

export default function ConnectedAccounts() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, refresh } = useSession();
  const [status, setStatus] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);
  const [working, setWorking] = useState(false);

  const redirectError = typeof router.query.googleError === 'string' ? router.query.googleError : '';
  const justLinked = router.query.googleLinked === '1';

  const handleUnlink = async () => {
    setStatus(null);
    setWorking(true);

    try {
      const data = await accountApi.unlinkGoogle();
      await refresh();
      setStatus({ tone: 'success', message: data.message });
    } catch (error) {
      setStatus({ tone: 'error', message: errorMessage(error, 'Could not unlink your Google account.') });
    } finally {
      setWorking(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading your connected accounts…</p>;
  }

  if (!isAuthenticated) {
    return <Alert tone="info">Sign in to connect a Google account.</Alert>;
  }

  const linked = user?.googleLinked ?? false;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-slate-100 p-4">
        <div className="flex items-center gap-4">
          <Image src={googleMark} alt="" aria-hidden width={24} height={24} className="h-6 w-6" />

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">Google</h4>
              {linked ? <Badge tone="success">Connected</Badge> : <Badge tone="neutral">Not connected</Badge>}
            </div>
            <p className="text-xs font-medium text-slate-500">
              {linked
                ? (user?.email ?? 'Linked to your Google account')
                : 'Link Google so you can sign in with one tap.'}
            </p>
          </div>
        </div>

        {linked ? (
          <button
            type="button"
            onClick={handleUnlink}
            disabled={working}
            className="h-11 rounded-lg border border-slate-100 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {working ? 'Unlinking…' : 'Unlink'}
          </button>
        ) : (
          <a
            href="/api/auth/google/link"
            className="flex h-11 items-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Link Google
          </a>
        )}
      </div>

      {justLinked && !status ? <Alert tone="success">Google account linked.</Alert> : null}
      {redirectError && !status ? <Alert tone="error">{redirectError}</Alert> : null}
      {status ? <Alert tone={status.tone}>{status.message}</Alert> : null}
    </div>
  );
}
