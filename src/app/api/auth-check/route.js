import { NextResponse } from "next/server";
import { connect } from "@/utils/connect.js";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const db = connect();
  try {
    const { userId } = auth();
    console.log("userId from auth:", userId);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists
    const checkUser = await db.query(
      "SELECT clerk_id FROM pi_users WHERE clerk_id = $1",
      [userId]
    );

    if (checkUser.rowCount === 0) {
      // Insert new user
      await db.query("INSERT INTO pi_users (clerk_id) VALUES ($1)", [userId]);
      console.log(`New user created: ${userId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
