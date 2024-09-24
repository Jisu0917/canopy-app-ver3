import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const canopy = await prisma.canopy.findUnique({
      where: { id: Number(id) },
      include: {
        location: true,
      },
    });

    if (!canopy) {
      return NextResponse.json(
        { message: "Canopy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...canopy,
      location_address: canopy.location ? canopy.location.address : null,
    });
  } catch (error) {
    console.error("Error fetching canopy:", error);
    return NextResponse.json(
      { message: "Error fetching canopy", error },
      { status: 500 }
    );
  }
}
