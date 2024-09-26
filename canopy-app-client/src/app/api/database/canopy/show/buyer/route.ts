// 파일 위치: src/app/api/database/canopy/show/buyer/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CanopyModel } from "@/types/models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const buyerId = searchParams.get("buyerId");

  if (!buyerId) {
    return NextResponse.json(
      { error: "Buyer ID is required" },
      { status: 400 }
    );
  }

  try {
    const canopies = await prisma.canopy.findMany({
      where: {
        buyer_id: parseInt(buyerId),
      },
      include: {
        location: true,
        buyer: true,
      },
    });

    const data: CanopyModel[] = canopies.map(
      ({ id, location, buyer, ...rest }) => ({
        id,
        data: {
          id,
          ...rest,
          location: {
            ...location,
          },
          buyer: buyer
            ? {
                ...buyer,
              }
            : undefined,
        },
      })
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching buyer canopies:", error);
    return NextResponse.json(
      { error: "Failed to fetch buyer canopies" },
      { status: 500 }
    );
  }
}
