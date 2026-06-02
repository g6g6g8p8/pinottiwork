function Pulse({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-foreground/10 ${className ?? ''}`} />
  );
}

export function SkeletonCard({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`rounded-sf-xl overflow-hidden ${wide ? 'aspect-[5/2]' : 'aspect-[4/3]'}`}>
      <Pulse className="w-full h-full rounded-none" />
    </div>
  );
}

export function SkeletonHome() {
  return (
    <div className="flex flex-col gap-4 md:gap-5 p-5 md:p-8 lg:px-[2.625rem]">
      <SkeletonCard wide />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="lg:grid lg:grid-cols-[42%_58%] lg:min-h-screen">
      <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:items-center lg:p-[2.625rem]">
        <Pulse className="w-full aspect-[3/4] xl:aspect-[4/5] rounded-sf-xl" />
      </div>
      <div className="px-5 lg:px-[2.625rem] py-10 space-y-6">
        <Pulse className="h-3 w-24 rounded-full" />
        <Pulse className="h-8 w-3/4 rounded-md" />
        <Pulse className="h-4 w-full rounded-md" />
        <Pulse className="h-4 w-5/6 rounded-md" />
        <div className="flex gap-2 mt-4">
          <Pulse className="h-7 w-20 rounded-full" />
          <Pulse className="h-7 w-24 rounded-full" />
        </div>
        <div className="pt-6 space-y-3">
          <Pulse className="h-4 w-full rounded-md" />
          <Pulse className="h-4 w-full rounded-md" />
          <Pulse className="h-4 w-4/5 rounded-md" />
        </div>
        <Pulse className="w-full aspect-video rounded-sf-xl mt-4" />
      </div>
    </div>
  );
}
