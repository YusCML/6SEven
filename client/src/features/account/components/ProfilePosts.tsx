import Link from 'next/link';
import Alert from '@/components/ui/Alert';
import { PlusIcon } from '@/components/icons';
import HotspotCard from '@/features/hotspot/components/HotspotCard';
import { hotspotsBy } from '@/features/hotspot/data';
import useSession from '@/hooks/useSession';

export default function ProfilePosts() {
  const { displayName, isAuthenticated, isLoading } = useSession();
  const posts = isAuthenticated ? hotspotsBy(displayName) : [];

  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading your posts…</p>;
  }

  if (!isAuthenticated) {
    return <Alert tone="info">Sign in to share places with other commuters.</Alert>;
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-100 bg-white px-6 py-10 text-center">
        <p className="text-sm font-bold text-slate-700">No posts yet</p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Pin a place you know well and it will show up here.
        </p>

        <Link
          href="/hotspot"
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Add a place
        </Link>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2">
      {posts.map((hotspot) => (
        <HotspotCard key={hotspot.id} hotspot={hotspot} />
      ))}
    </div>
  );
}
