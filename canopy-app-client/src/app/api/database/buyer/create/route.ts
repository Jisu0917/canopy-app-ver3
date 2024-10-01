import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const data = req.data;
    const response = await fetch(`${process.env.SERVER_URL}/api/buyer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create buyer");
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/database/buyer`
    );
  } catch (err) {
    console.error("Error adding buyer:", err);
    return NextResponse.json({ error: "Error adding buyer" }, { status: 500 });
  }
}
