export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-600 animate-pulse" />
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
