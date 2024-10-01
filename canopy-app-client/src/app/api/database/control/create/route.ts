import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    const response = await fetch(
      `${process.env.SERVER_URL}/api/control/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create control");
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/database/control`
    );
  } catch (err) {
    console.error("Error adding control:", err);
    return NextResponse.json(
      { error: "Error adding control" },
      { status: 500 }
    );
  }
}
