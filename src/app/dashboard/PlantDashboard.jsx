import React from 'react';
import { Thermometer, Droplets, Sun, AlertCircle } from 'lucide-react';

const MetricCard = ({ title, value, unit, icon: Icon, color, description, isOptimal }) => (
  <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <div className="mt-4">
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="ml-1 text-sm text-gray-500">{unit}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${isOptimal ? 'bg-green-500' : 'bg-red-500'}`} />
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

const PlantDashboard = () => {
  // Sample data - replace with your actual data source
  const plantData = {
    temperature: 23.5,
    humidity: 65,
    light: 80,
    lastUpdated: new Date().toLocaleTimeString(),
    plantName: "Monstera Deliciosa"
  };

  const metrics = [
    {
      title: "Temperature",
      value: plantData.temperature,
      unit: "°C",
      icon: Thermometer,
      color: "text-red-500",
      description: "Optimal range: 20-25°C",
      isOptimal: plantData.temperature >= 20 && plantData.temperature <= 25
    },
    {
      title: "Humidity",
      value: plantData.humidity,
      unit: "%",
      icon: Droplets,
      color: "text-blue-500",
      description: "Optimal range: 60-80%",
      isOptimal: plantData.humidity >= 60 && plantData.humidity <= 80
    },
    {
      title: "Light Level",
      value: plantData.light,
      unit: "%",
      icon: Sun,
      color: "text-yellow-500",
      description: "Optimal range: 60-90%",
      isOptimal: plantData.light >= 60 && plantData.light <= 90
    }
  ];

  const getStatusSummary = () => {
    const nonOptimalMetrics = metrics.filter(metric => !metric.isOptimal);
    if (nonOptimalMetrics.length === 0) return {
      message: "All parameters are optimal",
      color: "text-green-600",
      icon: "bg-green-100"
    };
    return {
      message: `${nonOptimalMetrics.length} parameter${nonOptimalMetrics.length > 1 ? 's' : ''} need${nonOptimalMetrics.length === 1 ? 's' : ''} attention`,
      color: "text-red-600",
      icon: "bg-red-100"
    };
  };

  const status = getStatusSummary();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{plantData.plantName}</h1>
              <p className="text-sm text-gray-500 mt-1">Last updated: {plantData.lastUpdated}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.icon}`}>
              <AlertCircle className={`h-4 w-4 ${status.color}`} />
              <span className={`text-sm font-medium ${status.color}`}>{status.message}</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Recent History */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Changes</h2>
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-3">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="font-medium text-gray-700">{metric.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={metric.isOptimal ? 'text-green-600' : 'text-red-600'}>
                    {metric.value}{metric.unit}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">1h ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDashboard;