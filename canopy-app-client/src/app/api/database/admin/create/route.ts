import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    /*
      id: 0,
      data: { id: 0, user_id: 'thv', password: 'pw951230', name: '김태형' },
    */
    const data = req.data;
    console.log("Sending admin data:", {
      ...data,
      password: data.password ? "[REDACTED]" : "NOT PROVIDED",
    });

    if (!data.name || !data.user_id || !data.password) {
      throw new Error("Missing required fields");
    }

    const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
    const response = await fetch(`${serverUrl}/api/admin/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server response:", errorData);
      throw new Error(errorData.error || "Failed to create admin");
    }

    const result = await response.json();
    console.log("Admin created:", result);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/database/admin`
    );
  } catch (err) {
    console.error("Error adding admin:", err);
    return NextResponse.json({ error: "Error adding admin" }, { status: 500 });
  }
}
