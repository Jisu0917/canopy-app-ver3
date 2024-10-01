import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.SERVER_URL}/api/admin/show`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch admins");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error showing admin:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}
