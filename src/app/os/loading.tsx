export default function OSLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="border-b border-slate-200 -mt-2">
        <div className="flex gap-1 py-2.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-5 w-20 bg-slate-200 rounded" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-7 w-28 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="h-5 w-40 bg-slate-200 rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-lg" />
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
