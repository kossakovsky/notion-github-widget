export default function ContributionSkeleton() {
  // Generate skeleton structure: 53 weeks × 7 days
  const weeks = Array.from({ length: 53 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-5xl">
        {/* Title skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-6 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Contribution graph skeleton */}
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1">
            {weeks.map((week) => (
              <div key={week} className="flex flex-col gap-1">
                {days.map((day) => (
                  <div
                    key={day}
                    className="h-3 w-3 animate-pulse rounded-sm bg-gray-300 dark:bg-gray-700"
                    style={{
                      animationDelay: `${(week * 7 + day) * 10}ms`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend skeleton */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="h-4 w-12 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="h-3 w-3 animate-pulse rounded-sm bg-gray-300 dark:bg-gray-700"
              style={{
                animationDelay: `${level * 100}ms`,
              }}
            />
          ))}
          <span className="h-4 w-12 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
