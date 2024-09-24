import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: Number(id) },
    });

    if (!buyer) {
      return NextResponse.json({ message: "Buyer not found" }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (error) {
    console.error("Error fetching buyer:", error);
    return NextResponse.json(
      { message: "Error fetching buyer", error },
      { status: 500 }
    );
  }
}
