'use client';

import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Sun } from 'lucide-react';
import { MetricCard } from '@/app/dashboard/MetricCard';
import { StatusOverview } from '@/app/dashboard/StatusOverview';
import { TimelineEvent } from '@/app/dashboard/TimelineEvent';

const TimeDisplay = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <span>{time}</span>;
};

const PlantDashboard = () => {
  const metrics = [
    {
      title: 'Temperature',
      value: 23.5,
      unit: '°C',
      icon: Thermometer,
      color: 'text-rose-500',
      optimal: { min: 20, max: 25 },
      warning: { min: 18, max: 27 },
      critical: { min: 15, max: 30 },
      previousValue: 24.2,
      time: '1h ago',
      gradient: 'from-rose-500 to-orange-500',
    },
    {
      title: 'Humidity',
      value: 65,
      unit: '%',
      icon: Droplets,
      color: 'text-blue-500',
      optimal: { min: 60, max: 80 },
      warning: { min: 50, max: 90 },
      critical: { min: 40, max: 95 },
      previousValue: 68,
      time: '1h ago',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Light Level',
      value: 80,
      unit: '%',
      icon: Sun,
      color: 'text-amber-500',
      optimal: { min: 60, max: 90 },
      warning: { min: 40, max: 95 },
      critical: { min: 30, max: 100 },
      previousValue: 75,
      time: '1h ago',
      gradient: 'from-amber-500 to-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Plant Monitor
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Last updated: <TimeDisplay />
            </p>
          </div>
          <StatusOverview metrics={metrics} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold mb-6 text-slate-200">
            Recent Changes
          </h2>
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <TimelineEvent
                key={index}
                time={metric.time}
                metric={metric.title}
                previousValue={metric.previousValue}
                currentValue={metric.value}
                unit={metric.unit}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDashboard;
