export default function BusinessLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      {/* Store Nav Skeleton */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4 animate-pulse">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="h-4 w-48 rounded bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-100" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-3 w-28 rounded bg-slate-100" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-32 rounded-xl bg-slate-200" />
            <div className="h-9 w-24 rounded-xl bg-slate-200" />
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>

      {/* Page Content Skeleton */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4 animate-pulse">
        <div className="h-6 w-56 rounded bg-slate-200" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-24 rounded-xl bg-slate-100" />
          <div className="h-24 rounded-xl bg-slate-100" />
          <div className="h-24 rounded-xl bg-slate-100" />
        </div>
        <div className="h-48 w-full rounded-xl bg-slate-100" />
      </div>
    </div>
  )
}
