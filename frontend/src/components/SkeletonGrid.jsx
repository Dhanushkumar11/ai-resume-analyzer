export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="panel p-4">
          <div className="flex items-start gap-3">
            <div className="skeleton h-11 w-11 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="skeleton h-4 w-4/5" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="skeleton h-10" />
            <div className="skeleton h-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
