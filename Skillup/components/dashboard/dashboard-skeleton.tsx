import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Pulse */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-80 bg-primary/10" />
        <Skeleton className="h-4 w-48 bg-muted/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Card Pulse */}
        <Card className="lg:col-span-2 border-primary/10 bg-card/50 h-64 flex flex-col justify-center px-8 relative overflow-hidden">
           <Skeleton className="h-12 w-12 rounded-full bg-primary/20 absolute top-6 right-6" />
           <Skeleton className="h-6 w-48 bg-primary/10 mb-4" />
           <Skeleton className="h-10 w-24 bg-primary/20 mb-2" />
           <Skeleton className="h-4 w-64 bg-muted/20" />
        </Card>

        {/* Action Card Pulse */}
        <Card className="lg:col-span-1 border-primary/5 bg-primary/5 h-64 flex flex-col items-center justify-center p-6 text-center space-y-4">
           <Skeleton className="h-12 w-12 rounded-xl bg-primary/10" />
           <Skeleton className="h-5 w-32 bg-primary/10" />
           <Skeleton className="h-10 w-full bg-primary/20 rounded-xl" />
        </Card>
      </div>

      {/* 3-Column Stats Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 space-y-3">
             <Skeleton className="h-4 w-24 bg-muted/20" />
             <Skeleton className="h-8 w-16 bg-primary/10" />
             <Skeleton className="h-2 w-full bg-muted/10 rounded-full" />
          </Card>
        ))}
      </div>

      {/* Grid of smaller cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="h-48 border-border/50">
            <CardHeader><Skeleton className="h-5 w-32 bg-muted/20" /></CardHeader>
            <CardContent className="space-y-2">
               <Skeleton className="h-3 w-full bg-muted/10" />
               <Skeleton className="h-3 w-full bg-muted/10" />
               <Skeleton className="h-3 w-1/2 bg-muted/10" />
            </CardContent>
         </Card>
         <Card className="h-48 border-border/50">
            <CardHeader><Skeleton className="h-5 w-32 bg-muted/20" /></CardHeader>
            <CardContent className="space-y-2">
               <Skeleton className="h-3 w-full bg-muted/10" />
               <Skeleton className="h-3 w-full bg-muted/10" />
               <Skeleton className="h-3 w-1/2 bg-muted/10" />
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
