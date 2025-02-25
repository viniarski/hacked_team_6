import { NextResponse } from "next/server";
import { connect } from "@/utils/connect.js";
import { currentUser } from "@clerk/nextjs/server";

// POST route to add a plant to a space
export async function POST(req) {
  const db = connect();
  try {
    const { apiId, spaceId } = await req.json();
    const userId = (await currentUser()).id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!apiId || !spaceId) {
      return NextResponse.json(
        { error: "Plant ID and space ID are required" },
        { status: 400 }
      );
    }

    // Verify the space belongs to the user
    const spaceCheck = await db.query(
      "SELECT id FROM pi_spaces WHERE id = $1 AND user_id = $2",
      [spaceId, userId]
    );

    if (spaceCheck.rowCount === 0) {
      return NextResponse.json(
        { error: "Space not found or doesn't belong to user" },
        { status: 404 }
      );
    }
    
    // Verify the plant ID by fetching details from ZylaLabs API
    try {
      // Get API key from environment variables
      const apiKey = process.env.ZYLALABS_API_KEY;
      
      if (!apiKey) {
        console.error("Missing ZYLALABS_API_KEY environment variable");
        throw new Error("API key not configured");
      }
      
      const url = `https://zylalabs.com/api/774/house+plants+database+api/510/get+plant+by+id?plant_id=${apiId}`;
      const response = await fetch(url, { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        return NextResponse.json(
          { error: "Invalid plant ID or API error" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error verifying plant ID:", error);
    }

    // Insert the new plant with the updated fields
    const result = await db.query(
      "INSERT INTO pi_plants (api_id, space_id, name, temperature, brightness, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, api_id, space_id, watered, name, temperature, brightness, image_url;",
      [apiId, spaceId, '', null, null, '']
    );

    // Now fetch the plant details to update with actual data
    try {
      const plantDetails = await getPlantDetailsFromAPI(apiId);
      
      if (plantDetails) {
        // Extract data for our schema
        const name = plantDetails.name || plantDetails.commonName || '';
        
        // Calculate average temperature
        let temperature = null;
        if (plantDetails.careInfo.minTemp !== null && plantDetails.careInfo.maxTemp !== null) {
          temperature = (plantDetails.careInfo.minTemp + plantDetails.careInfo.maxTemp) / 2;
        }
        
        // Calculate brightness from light values
        let brightness = null;
        if (plantDetails.careInfo.minLight && plantDetails.careInfo.maxLight) {
          brightness = Math.floor((plantDetails.careInfo.minLight + plantDetails.careInfo.maxLight) / 2);
        }
        
        // Store the image URL
        const imageUrl = plantDetails.image || '';
        
        // Update the plant record with the detailed information
        await db.query(
          "UPDATE pi_plants SET name = $1, temperature = $2, brightness = $3, image_url = $4 WHERE id = $5",
          [name, temperature, brightness, imageUrl, result.rows[0].id]
        );
        
        // Update the result with the new data
        result.rows[0].name = name;
        result.rows[0].temperature = temperature;
        result.rows[0].brightness = brightness;
        result.rows[0].image_url = imageUrl;
      }
    } catch (error) {
      console.error("Error fetching plant details for new plant:", error);
      // We continue without the extra details in case of error
    };

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error adding plant:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

// Helper function to get plant details from the ZylaLabs API
async function getPlantDetailsFromAPI(id) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.ZYLALABS_API_KEY;
    
    if (!apiKey) {
      console.error("Missing ZYLALABS_API_KEY environment variable");
      throw new Error("API key not configured");
    }
    
    // Form the API request URL
    const url = `https://zylalabs.com/api/774/house+plants+database+api/510/get+plant+by+id?plant_id=${id}`;

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
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const result = await response.json();

    // Extract light values
    let minLight = 0;
    let maxLight = 0;
    
    if (result["Light ideal"]) {
      const lightInfo = result["Light ideal"];
      // Extract numeric values from the light description
      const matches = lightInfo.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/g);
      if (matches && matches.length >= 2) {
        // Format is usually "Strong light ( 21,500 to 3,200 lux/2000 to 300 fc)"
        const values = matches.map(m => parseInt(m.replace(/,/g, '')));
        minLight = Math.min(...values);
        maxLight = Math.max(...values);
      }
    }

    // Extract temperature values
    let minTemp = null;
    let maxTemp = null;
    
    if (result["Temperature min"] && result["Temperature min"]["C"]) {
      minTemp = result["Temperature min"]["C"];
    }
    
    if (result["Temperature max"] && result["Temperature max"]["C"]) {
      maxTemp = result["Temperature max"]["C"];
    }

    // Process the results into the format we need
    const careInfo = {
      watering: result["Watering"] || "Unknown",
      minLight: minLight,
      maxLight: maxLight,
      minTemp: minTemp,
      maxTemp: maxTemp
    };

    // Return formatted plant details
    return {
      id: result.id || id,
      name: result["Latin name"] || "",
      commonName: Array.isArray(result["Common name"]) ? result["Common name"][0] : "",
      image: result.Img || null,
      careInfo: careInfo
    };
  } catch (error) {
    console.error("Error getting plant details:", error);
    return null;
  }
}