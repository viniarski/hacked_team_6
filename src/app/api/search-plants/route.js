import { NextResponse } from "next/server";

// GET route to search plants by search term
export async function GET(req) {
  try {
    // Get search term from the URL query params
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    // Search for plants using ZylaLabs API
    const plantResults = await searchPlantsFromAPI(query);
    return NextResponse.json(plantResults, { status: 200 });
  } catch (error) {
    console.error("Error searching plants:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

// Function to search plants using the ZylaLabs API
async function searchPlantsFromAPI(query) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.ZYLALABS_API_KEY;
    
    if (!apiKey) {
      console.error("Missing ZYLALABS_API_KEY environment variable");
      throw new Error("API key not configured");
    }
    
    // Create the API URL with proper encoding
    const encodedQuery = encodeURIComponent(query);
    const url = `https://zylalabs.com/api/774/house+plants+database+api/509/search?query=${encodedQuery}`;

    console.log(`Searching plants with query: ${query}`);
    
    // Create the API request with proper authorization
    const response = await fetch(url, { 
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`API request failed with status ${response.status}: ${errorText}`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const result = await response.json();
    
    // Format the search results
    const formattedResults = [];
    
    if (Array.isArray(result)) {
      // Process up to 10 results
      for (let i = 0; i < Math.min(result.length, 10); i++) {
        const plant = result[i];
        if (plant && plant.item) {
          formattedResults.push({
            id: plant.item.id,
            name: plant.item["Latin name"] || "",
            commonName: Array.isArray(plant.item["Common name"]) ? plant.item["Common name"][0] : "",
            image: plant.item.Img || null,
            // Add some extra information that might be useful
            category: plant.item.Categories || "",
            watering: plant.item.Watering || ""
          });
        }
      }
    } else {
      console.warn("Unexpected API response format:", result);
    }
    
    return formattedResults;
  } catch (error) {
    console.error("Error in searchPlantsFromAPI:", error);
    throw error;
  }
}