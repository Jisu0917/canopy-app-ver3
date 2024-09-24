import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const control = await prisma.control.findUnique({
      where: { id: Number(id) },
    });

    if (!control) {
      return NextResponse.json(
        { message: "Control not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(control);
  } catch (error) {
    console.error("Error fetching control:", error);
    return NextResponse.json(
      { message: "Error fetching control", error },
      { status: 500 }
    );
  }
}
