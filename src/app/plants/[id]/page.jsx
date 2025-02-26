'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Leaf,
  ArrowLeft,
  Plus,
  Search,
  X,
  Loader2,
  Sun,
  Thermometer,
} from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import CheckUser from '@/components/checkUser';
import { motion } from "motion/react"

export default function PlantsListPage({ params }) {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const searchRef = useRef(null);

  // Properly unwrap params with React.use()
  const unwrappedParams = use(params);
  const spaceId = unwrappedParams?.id || 1;

  // State variables
  const [spaces, setSpaces] = useState([]);
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingSpace, setLoadingSpace] = useState(true);
  const [loadingPlants, setLoadingPlants] = useState(true);

  // Debounce search
  const searchTimeout = useRef(null);

  // Current space
  const currentSpace =
    spaces.find((space) => space.id === parseInt(spaceId)) || {};

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Don't search if query is empty
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Debounce search
    searchTimeout.current = setTimeout(() => {
      searchPlants(value);
    }, 300);
  };

  // Search plants from API
  const searchPlants = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      // Use the API endpoint that tries real API first, then falls back to mock data
      const response = await fetch(
        `/api/search-plants?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      );

      if (response.ok) {
        const results = await response.json();
        console.log('Search results:', results);
        setSearchResults(results);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to search plants:', response.status, errorData);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching plants:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a plant from search results
  const handleSelectPlant = async (plant) => {
    setIsAddingPlant(true);

    try {
      console.log('Adding plant:', plant);
      // Add plant to space with just the essential fields for your schema
      const response = await fetch('/api/plants/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiId: plant.id,
          spaceId: parseInt(spaceId),
        }),
      });

      if (response.ok) {
        console.log('Plant added successfully');
        // Clear search and refresh plants
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
        if (searchRef.current) {
          searchRef.current.value = '';
        }
        fetchPlants();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to add plant:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error adding plant:', error);
    } finally {
      setIsAddingPlant(false);
    }
  };

  // Filtered plants based on search
  const filteredPlants = plants.filter(
    (plant) =>
      plant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.api_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch spaces data
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setLoadingSpace(true);
        const res = await fetch('/api/spaces');
        const data = await res.json();
        if (Array.isArray(data)) {
          setSpaces(data);
        } else {
          console.warn('No spaces returned from API');
          setSpaces([]);
        }
      } catch (err) {
        console.error(err);
        setSpaces([]);
      } finally {
        setLoadingSpace(false);
      }
    };

    fetchSpaces();
  }, []);

  // Fetch plants data
  const fetchPlants = async () => {
    try {
      setLoadingPlants(true);
      const res = await fetch(`/api/plants?spaceId=${spaceId}`);

      if (!res.ok) {
        console.error('Failed to fetch plants:', res.status);
        setPlants([]);
        return;
      }

      const data = await res.json();
      console.log('Fetched plants data:', data);

      // Check if the response has the expected format
      if (Array.isArray(data)) {
        setPlants(data);
      } else if (data.plants && Array.isArray(data.plants)) {
        setPlants(data.plants);
      } else {
        console.warn('Unexpected plants data format:', data);
        setPlants([]);
      }
    } catch (err) {
      console.error('Error fetching plants:', err);
      setPlants([]);
    } finally {
      setLoadingPlants(false);
    }
  };

  useEffect(() => {
    if (spaceId) {
      fetchPlants();
    }
  }, [spaceId]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-[#f8faf9] p-6">
      <CheckUser />
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/spaces"
              className="flex items-center text-gray-600 hover:text-gray-400"
            >
              <ArrowLeft className="h-7 w-7 mr-1" />
            </Link>

            <Image
              src="/logo_flaura.webp"
              alt="Flaura Logo"
              width={88}
              height={64}
              className="h-16 w-auto"
            />

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

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              {loadingSpace ? (
                <div className="h-9 w-48 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {currentSpace?.tag} Plants
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your plants in this space
                  </p>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Search bar */}
        <div className="relative mb-8" ref={searchRef}>
          <input
            type="text"
            placeholder="Search for plants to add..."
            className="w-full p-3 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5c8f57]/30"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchQuery && searchResults.length > 0) {
                setShowResults(true);
              }
            }}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowResults(false);
                if (searchRef.current) {
                  searchRef.current.value = '';
                }
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Search results dropdown */}
          {showResults && (searchResults.length > 0 || isSearching) && (
            <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 text-[#5c8f57] animate-spin" />
                  <span className="ml-2 text-gray-600">Searching...</span>
                </div>
              ) : (
                <>
                  {searchResults.map((plant) => (
                    <div
                      key={plant.id}
                      className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectPlant(plant)}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#5c8f57]/20 flex items-center justify-center mr-3 overflow-hidden">
                        {plant.image ? (
                          <img
                            src={plant.image}
                            alt={plant.commonName || plant.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <Leaf className="h-5 w-5 text-[#5c8f57]" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {plant.commonName || plant.name}
                        </div>
                        {plant.name && plant.commonName && (
                          <div className="text-sm text-gray-500">
                            {plant.name}
                          </div>
                        )}
                        {plant.category && (
                          <div className="text-xs text-gray-400">
                            {plant.category}
                          </div>
                        )}
                      </div>
                      <div className="ml-auto">
                        {isAddingPlant ? (
                          <Loader2 className="h-5 w-5 text-[#5c8f57] animate-spin" />
                        ) : (
                          <Plus className="h-5 w-5 text-[#5c8f57]" />
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Plants list */}
        <div className="space-y-4">
          {loadingPlants ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {filteredPlants.length > 0 ? (
                filteredPlants.map((plant) => (
                  <div
                    key={plant.id}
                    onClick={() =>
                      router.push(`/dashboard/${spaceId}/${plant.id}`)
                    }
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: `${currentSpace.color}20` }}
                    >
                      {plant.image_url ? (
                        <img
                          src={plant.image_url}
                          alt={plant.name || 'Plant'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = `<div class="flex items-center justify-center w-full h-full"><svg class="h-8 w-8" style="color: ${currentSpace.color}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg></div>`;
                          }}
                        />
                      ) : (
                        <Leaf
                          className="h-8 w-8"
                          style={{ color: currentSpace.color }}
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <h2 className="text-lg font-medium text-gray-800">
                        {plant.name || `Plant #${plant.id}`}
                      </h2>
                      <div className="flex gap-4 text-sm text-gray-500">
                        {plant.temperature && (
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-red-500" />
                            <span>Ideal temp: {plant.temperature}°C</span>
                          </div>
                        )}
                        {plant.brightness && (
                          <div className="flex items-center gap-1">
                            <Sun className="h-3 w-3 text-amber-500" />
                            <span>Ideal light: {plant.brightness} lux</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? (
                    <div>
                      <p>No plants found matching "{searchQuery}".</p>
                      <p className="mt-2">
                        Try a different search or add a new plant.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>No plants in this space yet.</p>
                      <p className="mt-2">
                        Search above to add your first plant!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
