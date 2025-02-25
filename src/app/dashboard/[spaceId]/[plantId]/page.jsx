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
} from 'lucide-react';
import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { MetricCard } from '@/app/dashboard/MetricCard';
import { StatusOverview } from '@/app/dashboard/StatusOverview';
import { TimelineEvent } from '@/components/TimelineEvent';

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

  return (
    <div className="relative z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#2c392f] hover:bg-[#364940] transition-colors border border-[#4a5d4e] text-[#e2e8df]"
      >
        <Leaf className="h-5 w-5 text-[#7fa37a]" />
        <span>{selectedPlant?.name || 'Select Plant'}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 py-2 rounded-xl bg-[#2c392f] border border-[#4a5d4e] shadow-xl z-30">
          {plants && plants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => {
                onSelect(plant);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-[#364940] transition-colors flex flex-col"
            >
              <span className="text-[#e2e8df]">{plant.name}</span>
              <span className="text-sm text-[#7fa37a]">{plant.tag}</span>
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
  const { spaceId, plantId } = use(params);
  
  // Initialize all state at the top of the component to maintain hook order
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plantData, setPlantData] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [metrics, setMetrics] = useState([]);

  // Fetch data function
  const fetchData = async (spaceId, plantId) => {
    try {
      const response = await fetch(`/api/plants?spaceId=${spaceId}&plantId=${plantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      return null;
    }
  };

  // Update metrics based on current data
  const updateMetrics = (currentData, plantDetails) => {
    if (!currentData) return [];
    
    // Define optimal and warning ranges based on plant details
    // If no plant details, use default ranges
    const tempOptimal = plantDetails?.temperature 
      ? { min: plantDetails.temperature - 2, max: plantDetails.temperature + 2 }
      : { min: 20, max: 25 };
    
    const tempWarning = { 
      min: tempOptimal.min - 2, 
      max: tempOptimal.max + 2 
    };
    
    const humidityOptimal = { min: 60, max: 80 };
    const humidityWarning = { min: 50, max: 90 };
    
    const brightnessOptimal = plantDetails?.brightness
      ? { min: Math.max(0, (plantDetails.brightness / 15000 * 100) - 10), max: (plantDetails.brightness / 15000 * 100) + 10 }
      : { min: 60, max: 90 };
    
    const brightnessWarning = {
      min: Math.max(0, brightnessOptimal.min - 10),
      max: Math.min(100, brightnessOptimal.max + 10)
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
        critical: { min: tempWarning.min - 3, max: tempWarning.max + 3 },
        previousValue: currentData.temperature, // In a real app, you'd store historical data
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
        critical: { min: 40, max: 95 },
        previousValue: currentData.humidity,
        time: new Date(currentData.collectedAt).toLocaleTimeString(),
        gradient: 'from-[#7fa37a] to-[#5c8f57]',
      },
      {
        title: 'Light Level',
        value: currentData.brightness,
        unit: '%',
        icon: Sun,
        color: 'text-[#d4b16f]',
        optimal: brightnessOptimal,
        warning: brightnessWarning,
        critical: { min: 20, max: 100 },
        previousValue: currentData.brightness,
        time: new Date(currentData.collectedAt).toLocaleTimeString(),
        gradient: 'from-[#d4b16f] to-[#c29859]',
      },
    ];
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

    if (isLoaded && userId && spaceId && plantId) {
      setLoading(true);
      
      // Fetch data
      fetchData(spaceId, plantId).then(data => {
        if (data) {
          setPlantData(data);
          
          // Set selected plant
          if (data.plant) {
            setSelectedPlant(data.plant);
          } else if (data.plants && data.plants.length > 0) {
            setSelectedPlant(data.plants[0]);
          }
          
          // Set metrics based on fetched data
          if (data.currentData) {
            setMetrics(updateMetrics(data.currentData, data.plant));
          }
        }
        setLoading(false);
      });
    }
  }, [isLoaded, userId, spaceId, plantId, router]);

  // If still loading auth state, show loading indicator
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <Image
          src="/logo_flaura.webp"
          alt="Flaura Logo"
          width={88}
          height={64}
          className="h-16 w-auto"
        />
      </div>
    );
  }

  // If no user and auth is loaded, don't render the main content
  if (isLoaded && !userId) {
    return null; // We'll redirect in the useEffect above
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
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Get space details
  const currentSpace = plantData?.space || { name: 'Plants', color: '#5c8f57' };

  return (
    <div className="min-h-screen bg-[#f8faf9] p-6">
      <div className="mx-auto max-w-7xl">
        {/* Navigation and user button */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/plants/${spaceId}`}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to {currentSpace.tag || 'Space'} Plants
          </Link>

          <UserButton
            afterSignOutUrl="/"
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

        {/* Header with solid background */}
        <div className="rounded-2xl border border-[#4a5d4e] bg-[#2c392f] p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <div className="bg-[#7fa37a]/30 p-3 rounded-full">
                <Leaf className="h-7 w-7 text-[#7fa37a]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#e2e8df]">
                  {selectedPlant?.name || 'Plant'} Monitor
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-[#a8b3a6]" />
                  <span className="text-sm text-[#a8b3a6]">
                    <TimeDisplay />
                  </span>
                  <span className="mx-1 text-[#4a5d4e]">|</span>
                  <Calendar className="h-4 w-4 text-[#a8b3a6]" />
                  <span className="text-sm text-[#a8b3a6]">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="bg-[#2c392f] rounded-2xl border border-[#4a5d4e] p-6">
          <h2 className="text-lg font-semibold mb-6 text-[#e2e8df]">
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
}