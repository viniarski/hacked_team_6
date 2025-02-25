import { NextResponse } from "next/server";
import { connect } from "@/utils/connect.js";
import { currentUser } from "@clerk/nextjs/server";

// fetch plants
export async function GET(req) {
  const db = connect();
  try {
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get('spaceId');
    
    const userId = (await currentUser()).id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let result;
    if (spaceId) {
      // Get plants for a specific space
      result = await db.query(
        "SELECT id, space_id, watered, api_id, name, temperature, brightness, image_url FROM pi_plants WHERE space_id = $1",
        [spaceId]
      );
    } else {
      // Get all plants for the user
      result = await db.query(
        "SELECT id, space_id, watered, api_id, name, temperature, brightness, image_url FROM pi_plants WHERE space_id IN (SELECT id FROM pi_spaces WHERE user_id = $1)",
        [userId]
      );
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching plants:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}