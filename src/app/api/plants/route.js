import { NextResponse } from "next/server";
import { connect } from "@/utils/connect.js";
import { auth } from "@clerk/nextjs/server";

// create a new plant
export async function POST(req) {
  const db = connect();
  try {
    const { tag, spaceId } = await req.json(); // grab plant name and space ID
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!tag || tag.trim() === "" || !spaceId) {
      return NextResponse.json(
        { error: "Invalid plant data" },
        { status: 400 }
      );
    }

    // insert new plant into pi_plants
    const result = await db.query(
      "INSERT INTO pi_plants (tag, space_id) VALUES ($1, $2) RETURNING id, tag, space_id, watered;",
      [tag, spaceId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating plant:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// fetch plants
export async function GET(req) {
  const db = connect();
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.query(
      "SELECT id, tag, space_id, watered FROM pi_plants WHERE space_id IN (SELECT id FROM pi_spaces WHERE user_id = $1)",
      [userId]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching plants:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
