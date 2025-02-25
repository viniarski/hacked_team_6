"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Utensils, Home, Droplets, Plus, Leaf } from "lucide-react";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import CheckUser from "@/components/checkUser";

// const KitchenIcon = () => <Utensils className="h-10 w-10" />;
// const BedroomIcon = () => <Home className="h-10 w-10" />;
// const BathroomIcon = () => <Droplets className="h-10 w-10" />;

export default function SpacesPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [boards, setBoards] = useState([]);
  //   { id: 1, name: "Kitchen", icon: KitchenIcon, color: "#5c8f57" },
  //   { id: 2, name: "Bedroom", icon: BedroomIcon, color: "#d4846f" },
  //   { id: 3, name: "Bathroom", icon: BathroomIcon, color: "#d4b16f" },
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  // fetch spaces from db
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch("/api/spaces");
        // if (!response.ok) {
        //   throw new Error("Failed to fetch spaces");
        // }
        const spaces = await response.json();
        console.log(spaces);
        if (!Array.isArray(spaces) || spaces.length === 0) {
          console.warn("No spaces returned from API");
          return;
        }

        setBoards(
          spaces.map((space) => ({
            id: space.id,
            name: space.tag,
            icon: () => <Leaf className="h-10 w-10" />,
            color: "#5c8f57",
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpaces();
  }, []);

  // add new board to db
  const addNewBoard = async () => {
    if (!newBoardName.trim()) return;

    try {
      const response = await fetch("/api/spaces/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: newBoardName }),
      });
      console.log(response);
      if (!response.ok) {
        console.error("Failed to create space");
        return;
      }

      const newSpace = await response.json();

      // Update state with new space
      setBoards(
        spaces.map((space) => ({
          id: space.id,
          name: space.tag,
          icon: Leaf,
          color: "#5c8f57",
        }))
      );

      setNewBoardName("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding space:", error);
    }
  };

  // Use useEffect for navigation after render
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/signin");
    }
  }, [isLoaded, userId, router]);

  // If still loading auth state, show nothing or a loading indicator
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <Image
          src="/logo_flaura.webp"
          alt="Flaura Logo"
          width={150}
          height={40}
          className="h-10 w-auto animate-pulse"
        />
      </div>
    );
  }

  // If no user and auth is loaded, don't render the main content
  if (isLoaded && !userId) {
    return null; // We'll redirect in the useEffect above
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] p-6">
      <CheckUser />
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <div className="mb-4">
              <Image
                src="/logo_flaura.webp"
                alt="Flaura Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Plant Spaces
            </h1>
            <p className="text-gray-600 mt-2">
              Select a space to view your plants
            </p>
          </div>

          <div className="flex items-center gap-4">
            <UserButton
              // afterSignOutUrl is now configured globally
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "2.5rem",
                    height: "2.5rem",
                  },
                },
              }}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {boards.map((board) => (
            <Link
              href={`/plants/${board.id}`}
              key={board.id}
              className="flex flex-col items-center bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${board.color}20` }}
              >
                <div style={{ color: board.color }}>
                  {board.icon && <board.icon className="h-10 w-10" />}
                </div>
              </div>
              <h2 className="text-xl font-medium text-gray-800">
                {board.name}
              </h2>
              <span className="mt-2 text-sm text-gray-500">4 plants</span>
            </Link>
          ))}

          {/* Add New Board Button */}
          <div
            onClick={() => setShowAddForm(true)}
            className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-6 cursor-pointer hover:bg-gray-50"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100 mb-4">
              <Plus className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-800">Add New Space</h2>
          </div>
        </div>

        {/* Add New Board Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Space</h2>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Space name"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewBoard}
                  className="px-4 py-2 rounded bg-[#5c8f57] text-white"
                >
                  Add Space
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
