import { NextResponse } from "next/server";
import { connect } from "@/utils/connect.js";
import { currentUser } from "@clerk/nextjs/server";

// POST route to create a new space
export async function POST(req) {
  const db = connect();
  try {
    const { tag } = await req.json(); // grab space name
    const userId = (await currentUser()).id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!tag || tag.trim() === "") {
      return NextResponse.json(
        { error: "Invalid space name" },
        { status: 400 }
      );
    }

    // Insert new space into pi_spaces
    const result = await db.query(
      "INSERT INTO pi_spaces (tag, user_id) VALUES ($1, $2) RETURNING id, tag;",
      [tag, userId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating space:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET route to fetch spaces
export async function GET() {
  const db = connect();
  try {
    const userId = (await currentUser()).id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.query(
      "SELECT id, tag FROM pi_spaces WHERE user_id = $1",
      [userId]
    );

    if (results) {
      return NextResponse.json(result.rows, { status: 200 });
    } else {
      return NextResponse.json({error: "Nothing to return"}, { status: 200 })
    }
  } catch (error) {
    console.error("Error fetching spaces:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
