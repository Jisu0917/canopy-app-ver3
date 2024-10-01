import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const buyerId = searchParams.get("buyerId");

  if (!buyerId) {
    return NextResponse.json(
      { error: "Buyer ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.SERVER_URL}/api/canopy/show/buyer/${buyerId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch buyer canopies");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching buyer canopies:", error);
    return NextResponse.json(
      { error: "Failed to fetch buyer canopies" },
      { status: 500 }
    );
  }
}
