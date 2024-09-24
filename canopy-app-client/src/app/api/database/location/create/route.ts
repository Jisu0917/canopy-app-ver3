import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LocationModel } from "@/types/models";

export async function POST(request: Request) {
  try {
    const {
      data: { region, address },
    }: Omit<LocationModel, "id" | "canopies"> = await request.json();
    await prisma.location.create({
      data: { region: region as string, address: address as string },
    });

    return NextResponse.redirect("/location");
  } catch (err) {
    console.error("Error adding location:", err);
    return NextResponse.json(
      { error: "Error adding location" },
      { status: 500 }
    );
  }
}
