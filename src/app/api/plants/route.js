import { NextResponse } from "next/server";
import { connect } from "@/utils/connect.js";
import { currentUser } from "@clerk/nextjs/server";

// fetch plants
export async function GET(req) {
  const db = connect();
  try {
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get('spaceId');
    const plantId = searchParams.get('plantId');
    
    const user = await currentUser();
    const userId = user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const recentDataResult = await db.query(
      "SELECT * FROM pi_data ORDER BY collected_at DESC LIMIT 1"
    );
    const recentData = recentDataResult.rows[0];
    
    // Convert pi data humidity - using raw value from the DB without conversion
    const humidityValue = recentData ? recentData.humidity : 0;
    
    // Convert brightness from raw value to lux (multiplying by 10)
    const brightnessLux = recentData ? recentData.brightness * 10 : 0;
    
    // Fetch plant details if plantId exists
    let plantDetails = null;
    if (plantId) {
      const plantResult = await db.query(
        "SELECT * FROM pi_plants WHERE id = $1",
        [plantId]
      );
      plantDetails = plantResult.rows[0];
    }
    
    // Fetch all plants for the space
    let spacePlants = [];
    if (spaceId) {
      const plantsResult = await db.query(
        "SELECT * FROM pi_plants WHERE space_id = $1",
        [spaceId]
      );
      spacePlants = plantsResult.rows;
    }
    
    // Fetch space info
    let spaceDetails = null;
    if (spaceId) {
      const spaceResult = await db.query(
        "SELECT * FROM pi_spaces WHERE id = $1 AND user_id = $2",
        [spaceId, userId]
      );
      spaceDetails = spaceResult.rows[0];
    }
    
    return NextResponse.json({
      currentData: recentData ? {
        temperature: recentData.temperature,
        humidity: humidityValue,
        brightness: brightnessLux,
        collectedAt: recentData.collected_at
      } : null,
      plant: plantDetails,
      plants: spacePlants,
      space: spaceDetails
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}