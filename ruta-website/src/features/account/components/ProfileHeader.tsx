export default function ProfileHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-8">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-white/20 backdrop-blur border-2 border-white/40 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">🧑‍✈️</div>
        <div><h1 className="text-2xl font-bold">Juan Dela Cruz</h1><p className="text-blue-100 text-sm">Verified Commuter since 2024</p><span className="inline-block bg-white/20 text-xs px-2 py-0.5 rounded-full mt-1.5 font-medium">⭐ Route Contributor</span></div>
      </div>
      <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10 w-full md:w-auto"><span className="text-xs text-blue-200 block uppercase font-semibold">Reliability Score</span><span className="text-3xl font-extrabold tracking-tight">98.4%</span></div>
    </div>
  );
}
