// src/components/TimelineEvent.jsx
"use client";

export const TimelineEvent = ({ time, metric, previousValue, currentValue, unit }) => {
  const getDelta = () => {
    const delta = currentValue - previousValue;
    return {
      value: Math.abs(delta).toFixed(1),
      increased: delta > 0,
      color: delta > 0 ? 'text-[#d4846f]' : 'text-[#7fa37a]'
    };
  };

  const delta = getDelta();

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#4a5d4e] last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#a8b3a6]">{time}</span>
        <span className="font-medium text-[#e2e8df]">{metric}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={delta.color}>
          {delta.increased ? '↑' : '↓'} {delta.value}{unit}
        </span>
      </div>
    </div>
  );
};