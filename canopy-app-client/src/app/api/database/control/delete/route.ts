import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // 쿼리 파라미터에서 id 추출

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.control.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Control deleted" });
  } catch (error) {
    console.error("Error deleting control:", error);
    return NextResponse.json(
      { error: "Failed to delete control" },
      { status: 500 }
    );
  }
}
