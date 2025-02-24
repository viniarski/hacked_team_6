// src/components/StatusOverview.jsx
"use client";

export const StatusOverview = ({ metrics }) => {
  const getOverallStatus = () => {
    const criticalCount = metrics.filter(m => m.value < m.critical.min || m.value > m.critical.max).length;
    const warningCount = metrics.filter(m => 
      (m.value >= m.warning.min && m.value <= m.warning.max) &&
      (m.value < m.optimal.min || m.value > m.optimal.max)
    ).length;

    if (criticalCount > 0) return { text: 'Critical Attention Needed', color: 'text-[#d4846f] bg-[#d4846f]/10' };
    if (warningCount > 0) return { text: 'Some Parameters Need Attention', color: 'text-[#d4b16f] bg-[#d4b16f]/10' };
    return { text: 'All Parameters Optimal', color: 'text-[#7fa37a] bg-[#7fa37a]/10' };
  };

  const status = getOverallStatus();

  return (
    <div className={`rounded-full px-4 py-2 ${status.color} backdrop-blur-sm border border-[#4a5d4e] inline-flex items-center gap-2`}>
      <div className={`h-2 w-2 rounded-full ${status.color.includes('[#d4846f]') ? 'bg-[#d4846f]' : status.color.includes('[#d4b16f]') ? 'bg-[#d4b16f]' : 'bg-[#7fa37a]'}`} />
      <span className="font-medium">{status.text}</span>
    </div>
  );
};