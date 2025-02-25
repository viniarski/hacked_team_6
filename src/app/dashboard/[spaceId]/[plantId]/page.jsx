'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import { use } from 'react';
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
        <span>{selectedPlant?.name}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 py-2 rounded-xl bg-[#2c392f] border border-[#4a5d4e] shadow-xl z-30">
          {plants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => {
                onSelect(plant);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-[#364940] transition-colors flex flex-col"
            >
              <span className="text-[#e2e8df]">{plant.name}</span>
              <span className="text-sm text-[#7fa37a]">{plant.type}</span>
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

  // Use useEffect for navigation after render
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/signin');
    }
  }, [isLoaded, userId, router]);

  // If still loading auth state, show nothing or a loading indicator
  if (!isLoaded) {
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

  // Properly unwrap params with React.use()
  const unwrappedParams = use(params);
  const { spaceId, plantId } = unwrappedParams;

  // Mock spaces data
  const spaces = {
    1: { name: 'Kitchen', color: '#5c8f57' },
    2: { name: 'Bedroom', color: '#d4846f' },
    3: { name: 'Bathroom', color: '#d4b16f' },
  };

  // Mock plants data
  const plantsData = [
    { id: 1, name: 'Monstera Deliciosa', type: 'Tropical' },
    { id: 2, name: 'Snake Plant', type: 'Succulent' },
    { id: 3, name: 'Peace Lily', type: 'Flowering' },
    { id: 4, name: 'Fiddle Leaf Fig', type: 'Indoor Tree' },
  ];

  const [selectedPlant, setSelectedPlant] = useState(
    plantsData.find((p) => p.id.toString() === plantId.toString()) ||
      plantsData[0]
  );

  // Change route when plant changes
  const handlePlantChange = (plant) => {
    setSelectedPlant(plant);
    router.push(`/dashboard/${spaceId}/${plant.id}`);
  };

  const currentSpace = spaces[spaceId];

  const metrics = [
    {
      title: 'Temperature',
      value: 23.5,
      unit: '°C',
      icon: Thermometer,
      color: 'text-[#d4846f]',
      optimal: { min: 20, max: 25 },
      warning: { min: 18, max: 27 },
      critical: { min: 15, max: 30 },
      previousValue: 24.2,
      time: '1h ago',
      gradient: 'from-[#d4846f] to-[#c27559]',
    },
    {
      title: 'Humidity',
      value: 65,
      unit: '%',
      icon: Droplets,
      color: 'text-[#7fa37a]',
      optimal: { min: 60, max: 80 },
      warning: { min: 50, max: 90 },
      critical: { min: 40, max: 95 },
      previousValue: 68,
      time: '1h ago',
      gradient: 'from-[#7fa37a] to-[#5c8f57]',
    },
    {
      title: 'Light Level',
      value: 80,
      unit: '%',
      icon: Sun,
      color: 'text-[#d4b16f]',
      optimal: { min: 60, max: 90 },
      warning: { min: 40, max: 95 },
      critical: { min: 30, max: 100 },
      previousValue: 75,
      time: '1h ago',
      gradient: 'from-[#d4b16f] to-[#c29859]',
    },
  ];

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
            Back to {currentSpace.name} Plants
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
                plants={plantsData}
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
