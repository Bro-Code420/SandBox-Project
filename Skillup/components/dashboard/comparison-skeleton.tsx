import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ComparisonSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl w-full animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 bg-primary/10" />
        <Skeleton className="h-4 w-48 bg-muted/20" />
      </div>

      {/* Hero Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart Placeholder (2/3 width) */}
        <div className="lg:col-span-2">
          <Card className="border-primary/5 bg-card/50 h-full min-h-[550px] flex flex-col justify-between overflow-hidden">
            <CardHeader className="items-center pb-2">
              <Skeleton className="h-6 w-40 bg-primary/10" />
              <Skeleton className="h-4 w-56 bg-muted/20 mt-2" />
            </CardHeader>
            <CardContent className="flex items-center justify-center py-10">
              {/* Circular pulse to mimic Radar */}
              <div className="relative w-80 h-80 rounded-full border-[20px] border-primary/5 animate-pulse flex items-center justify-center">
                 <div className="w-48 h-48 rounded-full border-[15px] border-primary/5" />
              </div>
            </CardContent>
            <div className="p-8 border-t border-primary/5 flex justify-center gap-10">
               <Skeleton className="h-12 w-32 rounded-full bg-primary/5" />
               <Skeleton className="h-12 w-32 rounded-full bg-muted/10" />
            </div>
          </Card>
        </div>

        {/* Stats Sidebar Placeholder (1/3 width) */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="h-40 border-success/10 bg-success/5 flex flex-col items-center justify-center">
            <Skeleton className="h-12 w-16 bg-success/10 mb-2" />
            <Skeleton className="h-3 w-24 bg-success/5" />
          </Card>
          <Card className="h-40 border-destructive/10 bg-destructive/5 flex flex-col items-center justify-center">
            <Skeleton className="h-12 w-16 bg-destructive/10 mb-2" />
            <Skeleton className="h-3 w-24 bg-destructive/5" />
          </Card>
          <Card className="h-40 border-primary/10 bg-primary/5 flex flex-col items-center justify-center">
            <Skeleton className="h-12 w-16 bg-primary/10 mb-2" />
            <Skeleton className="h-3 w-24 bg-primary/5" />
          </Card>
          <Card className="h-24 border-border/10 bg-muted/5">
            <CardContent className="p-4 flex flex-col gap-2">
               <Skeleton className="h-3 w-full bg-muted/20" />
               <Skeleton className="h-3 w-3/4 bg-muted/20" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Table Skeleton */}
      <Card className="border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50">
           <Skeleton className="h-6 w-32 bg-muted/20" />
        </div>
        <div className="p-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex border-b border-border/50 p-4 gap-4 items-center">
               <Skeleton className="h-4 flex-1 bg-muted/10" />
               <Skeleton className="h-8 w-8 rounded-full bg-muted/10" />
               <Skeleton className="h-8 w-8 rounded-full bg-muted/10" />
               <Skeleton className="h-6 w-16 rounded bg-muted/10" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
