

export const Skeleton = ({ className }) => (
  <div className={`bg-white/5 animate-pulse rounded-xl ${className}`} />
);

export const DashboardSkeleton = () => (
  <div className="space-y-12">
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-80" />
      </div>
      <Skeleton className="h-10 w-32" />
    </header>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card-premium p-8 space-y-6">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid sm:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card-premium p-10 space-y-6">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-8">
        <Skeleton className="h-10 w-40" />
        <div className="glass-card-premium h-[500px] p-6 space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
               <Skeleton className="w-10 h-10 rounded-lg" />
               <div className="flex-1 space-y-2">
                 <Skeleton className="h-5 w-full" />
                 <Skeleton className="h-3 w-20" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
