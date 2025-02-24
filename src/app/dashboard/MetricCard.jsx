// src/app/dashboard/MetricCard.jsx
'use client';

import { useState } from 'react';

export const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
  optimal,
  warning,
  gradient,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    if (value >= optimal.min && value <= optimal.max) return 'bg-[#7fa37a]';
    if (value >= warning.min && value <= warning.max) return 'bg-[#d4b16f]';
    return 'bg-[#d4846f]';
  };

  return (
    <div
      className={`relative bg-[#2c392f] rounded-2xl border border-[#4a5d4e] p-6 transition-all duration-300 ${
        isHovered ? 'transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-4 right-4">
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="flex flex-col space-y-3">
        <span className="text-sm font-medium text-[#a8b3a6]">{title}</span>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {value}
          </span>
          <span className="text-[#a8b3a6]">{unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
          <span className="text-sm text-[#a8b3a6]">
            Optimal: {optimal.min}-{optimal.max}
            {unit}
          </span>
        </div>
      </div>
      {isHovered && (
        <div
          className={`absolute inset-x-0 -bottom-0 h-1 rounded-b-2xl bg-gradient-to-r ${gradient}`}
        />
      )}
    </div>
  );
};
