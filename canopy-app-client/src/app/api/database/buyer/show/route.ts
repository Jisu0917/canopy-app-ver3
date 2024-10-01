import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.SERVER_URL}/api/buyer/show`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch buyers");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error showing buyer:", error);
    return NextResponse.json(
      { error: "Failed to fetch buyers" },
      { status: 500 }
    );
  }
}
