export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm animate-pulse">
        <div className="space-y-2">
          <div className="h-6 w-44 rounded-full bg-slate-200" />
          <div className="h-8 w-64 rounded-xl bg-slate-200" />
          <div className="h-4 w-48 rounded-lg bg-slate-100" />
        </div>
        <div className="flex gap-2.5">
          <div className="h-10 w-28 rounded-xl bg-slate-200" />
          <div className="h-10 w-32 rounded-xl bg-slate-200" />
        </div>
      </div>

      {/* Metrics Ribbon Skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-9 w-9 rounded-xl bg-slate-200" />
            </div>
            <div className="h-8 w-16 rounded-xl bg-slate-200" />
            <div className="h-3 w-28 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4 animate-pulse">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="h-32 w-full rounded-xl bg-slate-100" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid gap-5 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-5 w-36 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-6 w-28 rounded-full bg-slate-100" />
            </div>
            <div className="h-14 w-full rounded-xl bg-slate-100" />
            <div className="h-10 w-full rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
