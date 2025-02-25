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
      "INSERT INTO pi_spaces (tag, user_id, colour, icon) VALUES ($1, $2, $3, $4) RETURNING id, tag;",
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