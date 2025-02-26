'use client';

import { useTheme } from '@/components/ThemeProvider';

export const StatusOverview = ({ metrics }) => {
  const { theme } = useTheme();

  const getOverallStatus = () => {
    if (!metrics || metrics.length === 0) {
      return {
        text: 'No Data Available',
        color:
          theme === 'light'
            ? 'text-gray-800 bg-gray-200'
            : 'text-[#e2e8df] bg-[#4a5d4e]',
      };
    }

    const criticalCount = metrics.filter(
      (m) => m.value < m.critical.min || m.value > m.critical.max
    ).length;

    const warningCount = metrics.filter(
      (m) =>
        m.value >= m.warning.min &&
        m.value <= m.warning.max &&
        (m.value < m.optimal.min || m.value > m.optimal.max)
    ).length;

    // Check for significant deviations from plant's ideal values
    const significantDeviations = metrics.filter((m) => {
      if (m.plantValue === null || m.plantValue === undefined) return false;

      const diff = Math.abs(m.value - m.plantValue);
      const percentDiff = (diff / m.plantValue) * 100;
      return percentDiff > 15; // More than 15% deviation is significant
    }).length;

    if (criticalCount > 0)
      return {
        text: 'Critical Attention Needed',
        color: 'text-white bg-[#9e5548]',
      };

    if (warningCount > 0 || significantDeviations > 0)
      return {
        text: 'Some Parameters Need Attention',
        color: 'text-white bg-[#9e8548]',
      };

    return {
      text: 'All Parameters Optimal',
      color: 'text-white bg-[#5c8f57]',
    };
  };

  const status = getOverallStatus();

  return (
    <div
      className={`rounded-full px-4 py-2 ${status.color} border border-transparent shadow-sm inline-flex items-center gap-2`}
    >
      <div className={`h-2 w-2 rounded-full bg-white/80`} />
      <span className="font-medium">{status.text}</span>
    </div>
  );
};
