import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function RoadmapSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <Skeleton className="h-10 w-64 bg-primary/10 mx-auto" />
      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
             <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Skeleton className="h-4 w-4 rounded-full bg-primary/20" />
             </div>
             <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-card/60 backdrop-blur-sm shadow-sm border-primary/5">
                <Skeleton className="h-5 w-40 bg-primary/10 mb-2" />
                <Skeleton className="h-3 w-full bg-muted/10 mb-1" />
                <Skeleton className="h-3 w-3/4 bg-muted/10" />
             </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Skeleton className="h-10 w-48 bg-primary/10" />
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-5 flex items-center gap-6 border-border/50 bg-card/40">
             <Skeleton className="h-12 w-12 rounded-xl bg-muted/10 shrink-0" />
             <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3 bg-muted/20" />
                <Skeleton className="h-3 w-1/4 bg-muted/10" />
             </div>
             <Skeleton className="h-8 w-24 rounded-lg bg-primary/5 shrink-0" />
          </Card>
        ))}
      </div>
    </div>
  )
}
