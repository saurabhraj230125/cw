export default function DashboardLoading() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-48 animate-pulse rounded-md bg-slate-200" />
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-300" />
        </div>
      </div>

      {/* 2. Top KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-100" />
            </div>
            <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-slate-200 mb-2" />
            <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>

      {/* 3. Split Grid Skeleton (8/12 and 4/12) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid (Quick Actions area) */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200 mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            {Array.from({ length: 15 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-3 w-16 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Profile Card Skeleton */}
        <div className="xl:col-span-4 rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {/* Header */}
          <div className="h-14 animate-pulse bg-slate-100 border-b border-slate-200" />
          
          {/* Avatar Area */}
          <div className="flex justify-center py-8 border-b border-slate-100">
            <div className="w-28 h-28 animate-pulse rounded-3xl bg-slate-100 border-2 border-slate-50" />
          </div>
          
          {/* Data Rows (Striped) */}
          <div className="flex flex-col">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={`flex items-center px-6 py-4 border-b border-slate-50 ${index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                <div className="w-2/5">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="w-3/5">
                  <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
            
            {/* Button Area */}
            <div className="px-6 py-6">
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}