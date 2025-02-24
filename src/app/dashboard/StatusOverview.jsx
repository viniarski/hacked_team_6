// src/app/dashboard/StatusOverview.jsx
'use client';

export const StatusOverview = ({ metrics }) => {
  const getOverallStatus = () => {
    const criticalCount = metrics.filter(
      (m) => m.value < m.critical.min || m.value > m.critical.max
    ).length;
    const warningCount = metrics.filter(
      (m) =>
        m.value >= m.warning.min &&
        m.value <= m.warning.max &&
        (m.value < m.optimal.min || m.value > m.optimal.max)
    ).length;

    if (criticalCount > 0)
      return {
        text: 'Critical Attention Needed',
        color: 'text-[#d4846f] bg-[#9e5548]',
      };
    if (warningCount > 0)
      return {
        text: 'Some Parameters Need Attention',
        color: 'text-[#e2e8df] bg-[#9e8548]',
      };
    return {
      text: 'All Parameters Optimal',
      color: 'text-[#e2e8df] bg-[#5c8f57]',
    };
  };

  const status = getOverallStatus();

  return (
    <div
      className={`rounded-full px-4 py-2 ${status.color} border border-[#4a5d4e] inline-flex items-center gap-2`}
    >
      <div className={`h-2 w-2 rounded-full bg-[#e2e8df]`} />
      <span className="font-medium">{status.text}</span>
    </div>
  );
};
