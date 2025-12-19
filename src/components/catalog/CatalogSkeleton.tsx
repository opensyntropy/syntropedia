/**
 * Skeleton loader component for the catalog page
 * Displays placeholder content while data is loading
 */

export function CatalogSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      {/* Left Column - Filter Sidebar Skeleton */}
      <div className="space-y-6">
        {/* Search skeleton */}
        <div className="h-10 bg-gray-200 rounded animate-pulse" />

        {/* Filter sections skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Right Column - Species Table Skeleton */}
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="h-8 w-64 bg-gray-300 rounded animate-pulse mb-4" />

        {/* Table rows skeleton */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}

        {/* Pagination skeleton */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
