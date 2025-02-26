'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import {
  Thermometer,
  Droplets,
  Sun,
  Leaf,
  ChevronDown,
  Clock,
  Calendar,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { MetricCard } from '@/app/dashboard/MetricCard';
import { StatusOverview } from '@/app/dashboard/StatusOverview';
import { TimelineEvent } from '@/components/TimelineEvent';
import PlantMetricsCharts from '@/components/PlantMetricsCharts';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';
import { motion } from "motion/react";

// TimeDisplay component
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

// PlantSelector component
const PlantSelector = ({ selectedPlant, plants, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="relative z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl theme-card theme-hover transition-colors shadow-sm"
      >
        <Leaf className="h-5 w-5 text-[#7fa37a]" />
        <span>{selectedPlant?.name || 'Select Plant'}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && plants && plants.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-64 py-2 rounded-xl theme-card shadow-xl z-30 border border-gray-300">
          {plants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => {
                onSelect(plant);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left theme-hover transition-colors flex flex-col"
            >
              <span className="theme-text-primary">
                {plant.name || `Plant #${plant.id}`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DashboardPage({ params }) {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { theme } = useTheme();
  const unwrappedParams = use(params);
  const spaceId = unwrappedParams?.spaceId;
  const plantId = unwrappedParams?.plantId;

  // Initialize all state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plantData, setPlantData] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [debugInfo, setDebugInfo] = useState(null);

  // Fetch data function
  const fetchData = async (spaceId, plantId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/plants?spaceId=${spaceId}&plantId=${plantId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setDebugInfo(data); // Store for debugging
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update metrics based on current data
  const updateMetrics = (currentData, plantDetails) => {
    if (!currentData) return [];

    // Get plant's ideal temperature
    const plantTemp = plantDetails?.temperature;

    // Get plant's ideal brightness - no need to scale, it's already in LUX
    const plantBrightness = plantDetails?.brightness;

    // Define optimal ranges
    const tempOptimal = plantTemp
      ? { min: plantTemp - 2, max: plantTemp + 2 }
      : { min: 20, max: 25 };

    const tempWarning = {
      min: tempOptimal.min - 3,
      max: tempOptimal.max + 3,
    };

    const tempCritical = {
      min: tempOptimal.min - 5,
      max: tempOptimal.max + 5,
    };

    const humidityOptimal = { min: 60, max: 80 };
    const humidityWarning = { min: 50, max: 90 };
    const humidityCritical = { min: 40, max: 95 };

    // Scale up the brightness from Raspberry Pi to lux
    // Based on your chart: 44 from Pi ≈ 300-500 lux in a bright office
    const sensorBrightValue = currentData.brightness * 10; // Scale factor of 10 (44 → 440 lux)

    // For brightness, define optimal ranges in lux
    const brightnessOptimal = plantBrightness
      ? { min: Math.max(0, plantBrightness * 0.9), max: plantBrightness * 1.1 }
      : { min: 400, max: 600 }; // Default for a bright office if plant value not available

    const brightnessWarning = {
      min: Math.max(0, brightnessOptimal.min * 0.8),
      max: brightnessOptimal.max * 1.2,
    };

    const brightnessCritical = {
      min: Math.max(0, brightnessOptimal.min * 0.6),
      max: brightnessOptimal.max * 1.4,
    };

    return [
      {
        title: 'Temperature',
        value: currentData.temperature,
        unit: '°C',
        icon: Thermometer,
        color: 'text-[#d4846f]',
        optimal: tempOptimal,
        warning: tempWarning,
        critical: tempCritical,
        previousValue: currentData.temperature - 0.5, // Simulate a slight change
        plantValue: plantTemp,
        time: new Date(currentData.collectedAt).toLocaleTimeString(),
        gradient: 'from-[#d4846f] to-[#c27559]',
      },
      {
        title: 'Humidity',
        value: currentData.humidity,
        unit: '%',
        icon: Droplets,
        color: 'text-[#7fa37a]',
        optimal: humidityOptimal,
        warning: humidityWarning,
        critical: humidityCritical,
        previousValue: currentData.humidity - 1, // Simulate a slight change
        plantValue: null, // We don't store ideal humidity in the plant table
        time: new Date(currentData.collectedAt).toLocaleTimeString(),
        gradient: 'from-[#7fa37a] to-[#5c8f57]',
      },
      {
        title: 'Light Level',
        value: sensorBrightValue,
        unit: ' lux',
        icon: Sun,
        color: 'text-[#d4b16f]',
        optimal: brightnessOptimal,
        warning: brightnessWarning,
        critical: brightnessCritical,
        previousValue: sensorBrightValue - 20, // Simulate a slight change
        plantValue: plantBrightness,
        time: new Date(currentData.collectedAt).toLocaleTimeString(),
        gradient: 'from-[#d4b16f] to-[#c29859]',
      },
    ];
  };

  // Generate timeline events
  const generateTimelineEvents = (metrics) => {
    return metrics.map((metric) => ({
      time: metric.time,
      metric: metric.title,
      previousValue: metric.previousValue,
      currentValue: metric.value,
      unit: metric.unit,
      plantValue: metric.plantValue,
    }));
  };

  // Handle plant selection
  const handlePlantChange = (plant) => {
    setSelectedPlant(plant);
    router.push(`/dashboard/${spaceId}/${plant.id}`);
  };

  // Load data when component mounts or params change
  useEffect(() => {
    // Redirect if not authenticated
    if (isLoaded && !userId) {
      router.push('/signin');
      return;
    }

    if (isLoaded && userId && spaceId) {
      // Fetch data
      fetchData(spaceId, plantId).then((data) => {
        if (data) {
          setPlantData(data);

          // Set selected plant
          if (data.plant) {
            setSelectedPlant(data.plant);
          } else if (data.plants && data.plants.length > 0) {
            setSelectedPlant(data.plants[0]);
            if (!plantId) {
              // Redirect to the first plant if no plantId was specified
              router.push(`/dashboard/${spaceId}/${data.plants[0].id}`);
            }
          }

          // Set metrics based on fetched data
          if (data.currentData) {
            const updatedMetrics = updateMetrics(data.currentData, data.plant);
            setMetrics(updatedMetrics);
            setTimelineEvents(generateTimelineEvents(updatedMetrics));
          }
        }
      });
    }
  }, [isLoaded, userId, spaceId, plantId, router]);

  // If still loading auth state, show loading indicator
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <motion.div             
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.6, bounce: 0.5 },
          }}>
        <Image
          src="/logo_flaura.webp"
          alt="Flaura Logo"
          width={88}
          height={64}
          className="h-16 w-auto"
        />
      </motion.div>
      </div>
    );
  }

  // If no user and auth is loaded, don't render the main content
  if (isLoaded && !userId) {
    return null;
  }

  // If there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center flex-col">
        <Image
          src="/logo_flaura.webp"
          alt="Flaura Logo"
          width={88}
          height={64}
          className="h-16 w-auto mb-4"
        />
        <div className="text-red-500 flex items-center gap-2">
          <AlertTriangle size={20} />
          Error: {error}
        </div>
      </div>
    );
  }

  // Get space details
  const currentSpace = plantData?.space || { tag: 'Plants', color: '#5c8f57' };

  return (
    <div className="min-h-screen bg-[#f8faf9] p-6">
      <div className="mx-auto max-w-7xl">
        {/* Navigation and user button */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/plants/${spaceId}`}
            className="flex items-center text-gray-600 hover:text-gray-400"
          >
            <ArrowLeft className="h-7 w-7 mr-1" />
          </Link>

          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/logo_flaura.webp"
              alt="Flaura Logo"
              width={88}
              height={64}
              className="h-16 w-auto"
            />
          </div>

          {/* User button with theme toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: '2.5rem',
                    height: '2.5rem',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="rounded-2xl border theme-card p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <div className="relative w-16 h-16 bg-[#7fa37a]/30 rounded-full overflow-hidden flex items-center justify-center">
                {selectedPlant?.image_url ? (
                  <img
                    src={selectedPlant.image_url}
                    alt={selectedPlant.name || 'Plant'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Leaf className="h-8 w-8 text-[#7fa37a]" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold theme-text-primary">
                  {selectedPlant?.name || 'Plant'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 theme-text-tertiary" />
                  <span className="text-sm theme-text-tertiary">
                    <TimeDisplay />
                  </span>
                  <span className="mx-1 opacity-30 theme-text-tertiary">|</span>
                  <Calendar className="h-4 w-4 theme-text-tertiary" />
                  <span className="text-sm theme-text-tertiary">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <StatusOverview metrics={metrics} />
              <PlantSelector
                selectedPlant={selectedPlant}
                plants={plantData?.plants || []}
                onSelect={handlePlantChange}
              />
            </div>
          </div>
        </div>

        {metrics.length > 0 ? (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>

            {/* Plant Metrics Charts */}
            <PlantMetricsCharts plantId={plantId} spaceId={spaceId} />

            {/* Recent Changes Timeline */}
            <div className="theme-card rounded-2xl shadow-sm p-6 mt-8">
              <h2 className="text-lg font-semibold mb-6 theme-text-primary">
                Recent Changes
              </h2>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <TimelineEvent
                    key={index}
                    time={event.time}
                    metric={event.metric}
                    previousValue={event.previousValue}
                    currentValue={event.currentValue}
                    unit={event.unit}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="theme-card rounded-2xl shadow-sm p-8 text-center">
            <Leaf className="h-16 w-16 text-[#7fa37a]/40 mx-auto mb-4" />
            <h2 className="text-xl font-semibold theme-text-primary mb-2">
              No Sensor Data Available
            </h2>
            <p className="theme-text-secondary max-w-md mx-auto">
              We're waiting for your Raspberry Pi to send us some data about
              your plant's environment. Make sure your sensors are connected and
              running.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
