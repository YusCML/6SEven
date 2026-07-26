type ProfileHeaderProps = {
  displayName: string;
  isGuest: boolean;
  /** Account creation date for signed-in users. Undefined for guests. */
  memberSince?: string;
};

/** First letters of the name — falls back to the leading character for guest names. */
function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function ProfileHeader({ displayName, isGuest, memberSince }: ProfileHeaderProps) {
  const joinedYear = memberSince ? new Date(memberSince).getFullYear() : null;

  return (
    <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-8">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-white/20 backdrop-blur border-2 border-white/40 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner">
          {isGuest ? '🧭' : initialsOf(displayName)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-blue-100 text-sm">
            {isGuest ? 'Browsing as a guest' : `Verified Commuter since ${joinedYear ?? '—'}`}
          </p>
          <span className="inline-block bg-white/20 text-xs px-2 py-0.5 rounded-full mt-1.5 font-medium">
            {isGuest ? '👋 Guest Session' : '⭐ Route Contributor'}
          </span>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10 w-full md:w-auto">
        <span className="text-xs text-blue-200 block uppercase font-semibold">Reliability Score</span>
        <span className="text-3xl font-extrabold tracking-tight">{isGuest ? '—' : '98.4%'}</span>
      </div>
    </div>
  );
}
