import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.SERVER_URL}/api/buyer/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete buyer");
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error deleting buyer:", error);
    return NextResponse.json(
      { error: "Failed to delete buyer" },
      { status: 500 }
    );
  }
}
