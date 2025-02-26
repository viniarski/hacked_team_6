'use client';

import { useTheme } from '@/components/ThemeProvider';

export const TimelineEvent = ({
  time,
  metric,
  previousValue,
  currentValue,
  unit,
  plantValue,
}) => {
  const { theme } = useTheme();

  const getDelta = () => {
    const delta = currentValue - previousValue;
    return {
      value: Math.abs(delta).toFixed(1),
      increased: delta > 0,
      color: delta > 0 ? 'text-[#d4846f]' : 'text-[#7fa37a]',
    };
  };

  // Get comparison with plant's ideal value
  const getPlantComparison = () => {
    if (plantValue === undefined || plantValue === null) return null;

    const delta = currentValue - plantValue;
    const percentDelta = (Math.abs(delta) / plantValue) * 100;

    return {
      value: Math.abs(delta).toFixed(1),
      percent: Math.round(percentDelta),
      above: delta > 0,
      significant: percentDelta > 10,
    };
  };

  const delta = getDelta();
  const plantComparison = getPlantComparison();

  return (
    <div className="flex items-center justify-between py-3 border-b theme-border last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-sm theme-text-tertiary">{time}</span>
        <span className="font-medium theme-text-primary">{metric}</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Current vs previous value */}
        <span className={delta.color}>
          {delta.increased ? '↑' : '↓'} {delta.value}
          {unit}
        </span>

        {/* Plant's ideal value comparison */}
        {plantComparison && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              plantComparison.significant
                ? plantComparison.above
                  ? 'bg-[#9e5548]/20 text-[#d4846f]'
                  : 'bg-[#5c8f57]/20 text-[#7fa37a]'
                : theme === 'light'
                ? 'bg-gray-100 text-gray-600'
                : 'bg-[#4a5d4e]/30 text-[#a8b3a6]'
            }`}
          >
            {plantComparison.above ? 'Above' : 'Below'} ideal by{' '}
            {plantComparison.value}
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
