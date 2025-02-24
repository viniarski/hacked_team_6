// src/components/MetricCard.jsx
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
  critical,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    if (value >= optimal.min && value <= optimal.max) return 'bg-green-500';
    if (value >= warning.min && value <= warning.max) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div
      className={`relative bg-white rounded-xl p-6 transition-all duration-300 ${
        isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-3 right-3">
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-gray-500">{unit}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
          <span className="text-sm text-gray-500">
            Optimal: {optimal.min}-{optimal.max}
            {unit}
          </span>
        </div>
      </div>
      {isHovered && (
        <div className="absolute inset-x-0 -bottom-1 h-1 rounded-b-xl bg-gradient-to-r from-blue-500 to-purple-500 transform transition-all duration-300" />
      )}
    </div>
  );
};
