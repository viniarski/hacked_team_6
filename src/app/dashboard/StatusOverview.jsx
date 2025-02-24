// src/components/StatusOverview.jsx
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
        color: 'text-red-500 bg-red-50',
      };
    if (warningCount > 0)
      return {
        text: 'Some Parameters Need Attention',
        color: 'text-yellow-500 bg-yellow-50',
      };
    return {
      text: 'All Parameters Optimal',
      color: 'text-green-500 bg-green-50',
    };
  };

  const status = getOverallStatus();

  return (
    <div
      className={`rounded-lg px-4 py-2 ${status.color} inline-flex items-center gap-2`}
    >
      <div
        className={`h-2 w-2 rounded-full ${
          status.color.includes('red')
            ? 'bg-red-500'
            : status.color.includes('yellow')
            ? 'bg-yellow-500'
            : 'bg-green-500'
        }`}
      />
      <span className="font-medium">{status.text}</span>
    </div>
  );
};
