import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Thermometer, Droplets, Sun } from 'lucide-react';

const PlantMetricsCharts = ({ plantId, spaceId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/plant-metrics?hours=24');

        if (!response.ok) {
          throw new Error('Failed to fetch metrics data');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error('Error fetching metrics data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plantId, spaceId]);

  // Custom tooltip for each chart
  const CustomTooltip = ({ active, payload, label, unit, color }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2c392f] p-2 rounded-md border border-[#4a5d4e] shadow-lg text-xs">
          <p className="text-[#e2e8df] font-medium">{`Hour: ${label}`}</p>
          <p style={{ color: color }}>
            {`${payload[0].value.toFixed(1)} ${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Chart configuration
  const charts = [
    {
      title: 'Temperature',
      dataKey: 'temperature',
      color: '#d4846f',
      gradient: 'from-[#d4846f] to-[#c27559]',
      unit: '°C',
      icon: Thermometer,
      domain: ['auto', 'auto'],
    },
    {
      title: 'Humidity',
      dataKey: 'humidity',
      color: '#7fa37a',
      gradient: 'from-[#7fa37a] to-[#5c8f57]',
      unit: '%',
      icon: Droplets,
      domain: [0, 100],
    },
    {
      title: 'Light Level',
      dataKey: 'brightness',
      color: '#d4b16f',
      gradient: 'from-[#d4b16f] to-[#c29859]',
      unit: ' LUX',
      icon: Sun,
      domain: [0, 100],
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {charts.map((chart, index) => (
          <div
            key={index}
            className="bg-[#2c392f] rounded-2xl border border-[#4a5d4e] p-6 flex justify-center items-center h-48"
          >
            <div className="animate-pulse text-[#a8b3a6] text-sm">
              Loading {chart.title.toLowerCase()} data...
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {charts.map((chart, index) => (
          <div
            key={index}
            className="bg-[#2c392f] rounded-2xl border border-[#4a5d4e] p-6 flex justify-center items-center h-48"
          >
            <div className="text-[#d4846f] text-sm">Error loading data</div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {charts.map((chart, index) => (
          <div
            key={index}
            className="bg-[#2c392f] rounded-2xl border border-[#4a5d4e] p-6 flex justify-center items-center h-48"
          >
            <div className="text-[#a8b3a6] text-sm">
              No history data available
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {charts.map((chart, index) => (
        <div
          key={index}
          className="bg-[#2c392f] rounded-2xl border border-[#4a5d4e] p-6 relative"
        >
          <div className="absolute top-4 right-4">
            <chart.icon
              className={`h-6 w-6 text-${chart.color}`}
              style={{ color: chart.color }}
            />
          </div>

          <div className="flex flex-col space-y-2 mb-2">
            <span className="text-sm font-medium text-[#a8b3a6]">
              {chart.title} History
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-xl font-bold bg-gradient-to-r ${chart.gradient} bg-clip-text text-transparent`}
              >
                24h
              </span>
            </div>
          </div>

          <div className="h-32 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#4a5d4e"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="hour"
                  stroke="#a8b3a6"
                  tick={{ fontSize: 10 }}
                  tickCount={6}
                  opacity={0.5}
                />
                <YAxis
                  stroke="#a8b3a6"
                  domain={chart.domain}
                  tick={{ fontSize: 10 }}
                  tickCount={5}
                  opacity={0.5}
                />
                <Tooltip
                  content={
                    <CustomTooltip unit={chart.unit} color={chart.color} />
                  }
                  cursor={{ stroke: '#a8b3a6', strokeWidth: 1, opacity: 0.3 }}
                />
                <Line
                  type="monotone"
                  dataKey={chart.dataKey}
                  stroke={chart.color}
                  strokeWidth={2}
                  dot={{ fill: chart.color, r: 2 }}
                  activeDot={{ r: 4, fill: chart.color }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantMetricsCharts;
