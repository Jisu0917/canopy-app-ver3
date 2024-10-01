import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    console.log("Sending canopy data:", data);
    const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
    const response = await fetch(`${serverUrl}/api/canopy/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error(
        `Failed to create canopy: ${errorData.error || "Unknown error"}`
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/database/canopy`
    );
  } catch (err) {
    console.error("Error adding canopy:", err);
    return NextResponse.json({ error: "Error adding canopy" }, { status: 500 });
  }
}
