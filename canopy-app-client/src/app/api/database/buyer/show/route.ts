import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BuyerModel } from "@/types/models";

export async function GET() {
  try {
    const buyers = await prisma.buyer.findMany();

    const data: BuyerModel[] = buyers.map(({ id, ...rest }) => ({
      id,
      data: {
        id,
        ...rest,
      },
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch buyers" },
      { status: 500 }
    );
  }
}
