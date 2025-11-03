'use client';

import { useState } from 'react';
import type { ContributionGraphProps } from '@/lib/types';

export default function ContributionGraph({
  username,
  theme,
  data,
}: ContributionGraphProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Get intensity level based on contribution count
  const getIntensityLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  // Get color class based on intensity and theme
  const getColorClass = (count: number): string => {
    const level = getIntensityLevel(count);

    if (theme === 'light') {
      const lightColors = [
        'bg-gray-100',
        'bg-green-200',
        'bg-green-400',
        'bg-green-600',
        'bg-green-800',
      ];
      return lightColors[level];
    }

    // Dark theme
    const darkColors = [
      'bg-gray-800',
      'bg-green-900',
      'bg-green-700',
      'bg-green-500',
      'bg-green-400',
    ];
    return darkColors[level];
  };

  // Format date for tooltip
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle mouse enter on contribution day
  const handleMouseEnter = (
    date: string,
    count: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredDay({
      date,
      count,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === 'light'
          ? 'bg-white text-gray-900'
          : 'bg-black text-gray-100'
      }`}
    >
      {/* Contribution Graph - No wrapper, no centering */}
      <div className="inline-flex gap-1">
        {data.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.contributionDays.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`h-3 w-3 cursor-pointer rounded-sm transition-all hover:ring-2 hover:ring-gray-400 ${getColorClass(
                  day.contributionCount
                )}`}
                onMouseEnter={(e) =>
                  handleMouseEnter(day.date, day.contributionCount, e)
                }
                onMouseLeave={() => setHoveredDay(null)}
                title={`${day.contributionCount} contributions on ${formatDate(
                  day.date
                )}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded bg-gray-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
          style={{
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y - 8}px`,
          }}
        >
          <div className="font-semibold">
            {hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}
          </div>
          <div className="text-gray-300 dark:text-gray-600">
            {formatDate(hoveredDay.date)}
          </div>
        </div>
      )}
    </div>
  );
}
