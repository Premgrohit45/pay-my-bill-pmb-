import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const StatCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </CardContent>
  </Card>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-40" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex gap-4">
            {[...Array(5)].map((_, j) => (
              <Skeleton key={j} className="h-10 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const OwnerDashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    <div className="flex gap-3">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-40" />
    </div>
    <TableSkeleton rows={5} />
  </div>
);

export const RenterDashboardSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-6 w-40" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-6 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center p-5 rounded-2xl border border-border/20">
              <Skeleton className="h-3 w-20 mx-auto mb-2" />
              <Skeleton className="h-8 w-24 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    
    <TableSkeleton rows={3} />
  </div>
);
