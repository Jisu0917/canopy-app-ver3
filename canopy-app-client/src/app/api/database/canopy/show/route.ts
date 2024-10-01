import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.SERVER_URL}/api/canopy/show`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch canopies");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching canopies:", error);
    return NextResponse.json(
      { error: "Failed to fetch canopies" },
      { status: 500 }
    );
  }
}
