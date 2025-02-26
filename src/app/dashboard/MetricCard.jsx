'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
  optimal,
  warning,
  critical,
  previousValue,
  plantValue,
  time,
  gradient,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { theme } = useTheme();

  const getStatusColor = () => {
    if (value >= optimal.min && value <= optimal.max) return 'bg-[#7fa37a]';
    if (value >= warning.min && value <= warning.max) return 'bg-[#d4b16f]';
    return 'bg-[#d4846f]';
  };

  // Calculate difference between current value and plant's ideal value
  const calculateDifference = () => {
    if (plantValue === null || plantValue === undefined) return null;

    const diff = value - plantValue;
    const percentDiff = (Math.abs(diff) / plantValue) * 100;

    return {
      value: diff.toFixed(1),
      percent: percentDiff.toFixed(0),
      increased: diff > 0,
      significant: percentDiff > 10,
    };
  };

  const difference = calculateDifference();

  return (
    <div
      className={`relative theme-card rounded-2xl shadow-sm p-6 transition-all duration-300 ${
        isHovered ? 'transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-4 right-4">
        <Icon className={`h-6 w-6 ${color}`} />
      </div>

      <div className="flex flex-col space-y-3">
        <span className="text-sm font-medium theme-text-secondary">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
          <span className="theme-text-secondary">{unit}</span>
        </div>

        {/* Plant's ideal value comparison */}
        {plantValue !== null && plantValue !== undefined && (
          <div className="flex items-center gap-2 mt-1">
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="h-4 w-4 theme-text-tertiary" />
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-[var(--tooltip-bg)] border theme-border text-[var(--text-primary)] text-xs rounded-lg shadow-lg z-10 w-48">
                  Ideal {title.toLowerCase()} for this plant is{' '}
                  {plantValue.toFixed(1)}
                  {unit}
                </div>
              )}
            </div>

            <span className="text-sm theme-text-secondary">
              Ideal: {plantValue.toFixed(1)}
              {unit}
            </span>

            {difference && (
              <span
                className={`text-sm ml-auto ${
                  difference.increased ? 'text-[#d4846f]' : 'text-[#7fa37a]'
                }`}
              >
                {difference.increased ? (
                  <ArrowUp className="h-3 w-3 inline" />
                ) : (
                  <ArrowDown className="h-3 w-3 inline" />
                )}
                {difference.value}
                {unit}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
          <span className="text-sm theme-text-secondary">
            Optimal: {optimal.min.toFixed(1)}-{optimal.max.toFixed(1)}
            {unit}
          </span>
        </div>

        <div className="text-xs theme-text-tertiary mt-1">
          Updated at {time}
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
