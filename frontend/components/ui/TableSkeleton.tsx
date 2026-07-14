export default function TableSkeleton({ columnCount = 6 }: { columnCount?: number }) {
  return (
    <div className="p-6">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-16 bg-gray-200 rounded animate-shimmer" />
        <div className="h-4 w-2 bg-gray-200 rounded animate-shimmer" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-shimmer" />
        <div className="h-4 w-2 bg-gray-200 rounded animate-shimmer" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-shimmer" />
      </div>

      {/* Title skeleton */}
      <div className="h-7 w-48 bg-gray-200 rounded mb-6 animate-shimmer" />

      {/* Table skeleton */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#e6ebf5] flex">
          {Array.from({ length: columnCount }, (_, i) => (
            <div key={i} className="flex-1 px-4 py-3">
              <div className="h-4 w-16 bg-gray-300/50 rounded animate-shimmer" />
            </div>
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 8 }, (_, rowIdx) => (
          <div
            key={rowIdx}
            className={`flex ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
          >
            {Array.from({ length: columnCount }, (_, colIdx) => (
              <div key={colIdx} className="flex-1 px-4 py-3">
                <div
                  className="h-4 bg-gray-200 rounded animate-shimmer"
                  style={{ width: `${50 + Math.random() * 30}%` }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
