export default function OutcomesLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-gradient-to-b from-emerald-50 to-white py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 w-80 bg-slate-200 rounded mx-auto" />
          <div className="h-5 w-96 bg-slate-200 rounded mx-auto" />
          <div className="h-12 w-full max-w-xl bg-slate-200 rounded-xl mx-auto" />
          <div className="flex gap-3 justify-center flex-wrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-slate-200 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-lg" />
              <div className="space-y-1 flex-1">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-3/4 bg-slate-100 rounded" />
            <div className="h-2 w-full bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
