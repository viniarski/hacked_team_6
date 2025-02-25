'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Leaf, ArrowLeft, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import CheckUser from '@/components/checkUser';

export default function PlantsListPage({ params }) {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  // Properly unwrap params with React.use()
  const unwrappedParams = use(params);
  const spaceId = unwrappedParams?.id || 1;

  // Mock spaces data
  // const spaces = {
  //   1: { name: 'Kitchen', color: '#5c8f57' },
  //   2: { name: 'Bedroom', color: '#d4846f' },
  //   3: { name: 'Bathroom', color: '#d4b16f' }
  // };

  const currentSpace = spaces[spaceId];

  // Mock plants data
  const [plants, setPlants] = useState([]);
  //   { id: 1, name: 'Monstera Deliciosa', type: 'Tropical', lastWatered: '2 days ago' },
  //   { id: 2, name: 'Snake Plant', type: 'Succulent', lastWatered: 'Today' },
  //   { id: 3, name: 'Peace Lily', type: 'Flowering', lastWatered: '1 week ago' },
  //   { id: 4, name: 'Fiddle Leaf Fig', type: 'Indoor Tree', lastWatered: '3 days ago' },
  // ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlants = plants.filter(
    (plant) =>
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch spaces data
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await fetch('/api/spaces');
        const data = await res.json();
        setSpaces(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSpaces();
  }, []);

  // Fetch plants data
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch(`/api/plants?spaceId=${spaceId}`);
        const data = await res.json();
        setPlants(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlants();
  }, [spaceId]);

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
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] p-6">
      <CheckUser />
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/spaces"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Spaces
            </Link>

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

          <div className="flex items-center mb-4">
          <Image
            src="/logo_flaura.webp"
            alt="Flaura Logo"
            width={88}
            height={64}
            className="h-16 w-auto"
          />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {currentSpace.name} Plants
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your plants in this space
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#5c8f57] text-white rounded-lg hover:bg-[#4d7a49] transition-colors"
                onClick={() => {
                  /* Add plant logic */
                }}
              >
                <Plus className="h-5 w-5" />
                Add Plant
              </button>
            </div>
          </div>
        </header>

        {/* Search bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search plants..."
            className="w-full p-3 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5c8f57]/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {/* Plants list */}
        <div className="space-y-4">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => router.push(`/dashboard/${spaceId}/${plant.id}`)}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${currentSpace.color}20` }}
              >
                <Leaf
                  className="h-8 w-8"
                  style={{ color: currentSpace.color }}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-800">
                  {plant.name}
                </h2>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{plant.type}</span>
                  <span>•</span>
                  <span>Last watered: {plant.lastWatered}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredPlants.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No plants found. Try a different search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
