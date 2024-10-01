import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    const response = await fetch(
      `${process.env.SERVER_URL}/api/location/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create location");
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/database/location`
    );
  } catch (err) {
    console.error("Error adding location:", err);
    return NextResponse.json(
      { error: "Error adding location" },
      { status: 500 }
    );
  }
}
