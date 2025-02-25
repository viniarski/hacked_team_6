import { NextResponse } from "next/server";
import { connect } from "@/utils/connect.js";
import { currentUser } from "@clerk/nextjs/server";

// GET route to fetch spaces
export async function GET() {
  const db = connect();
  try {
    const userId = (await currentUser()).id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.query(
      "SELECT id, tag, color, icon FROM pi_spaces WHERE user_id = $1",
      [userId]
    );

    if (result) {
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
