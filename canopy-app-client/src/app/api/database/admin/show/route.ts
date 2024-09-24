import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AdminModel } from "@/types/models";

export async function GET() {
  try {
    const admins = await prisma.admin.findMany();

    const data: AdminModel[] = admins.map(({ id, ...rest }) => ({
      id,
      data: {
        id,
        ...rest,
      },
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}
