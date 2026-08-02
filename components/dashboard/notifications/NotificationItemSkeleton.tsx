import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationItemSkeleton() {
  return (
    <Card className="rounded-2xl !border-none min-h-[147px] justify-center bg-white py-4 shadow-[0px_2px_5.3px_0px_#00000014]">
      <CardContent className="flex flex-col md:flex-row items-start !border-none justify-between gap-4 px-4">
        <div className="flex flex-col md:flex-row items-start justify-end gap-3 flex-1">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="w-full space-y-2 text-right">
            <Skeleton className="h-5 w-2/3 ml-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 ml-auto" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-14" />
        </div>
      </CardContent>
    </Card>
  );
}