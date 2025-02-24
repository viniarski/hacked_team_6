// src/components/TimelineEvent.jsx
export const TimelineEvent = ({
  time,
  metric,
  previousValue,
  currentValue,
  unit,
}) => {
  const getDelta = () => {
    const delta = currentValue - previousValue;
    return {
      value: Math.abs(delta).toFixed(1),
      increased: delta > 0,
      color: delta > 0 ? 'text-red-500' : 'text-blue-500',
    };
  };

  const delta = getDelta();

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{time}</span>
        <span className="font-medium">{metric}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={delta.color}>
          {delta.increased ? '↑' : '↓'} {delta.value}
          {unit}
        </span>
      </div>
    </div>
  );
};
