import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { BuyerModel } from "@/types/models";

const saltRounds = 10;

export async function POST(request: Request) {
  try {
    const {
      data: { user_id, password, region, supervisor_name, supervisor_phone },
    }: Omit<BuyerModel, "id" | "canopies" | "controls"> = await request.json();

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password as string, saltRounds);

    // 해싱된 비밀번호를 사용해 구매자 계정 생성
    await prisma.buyer.create({
      data: {
        user_id: user_id as string,
        password: hashedPassword,
        region: region as string,
        supervisor_name: supervisor_name as string,
        supervisor_phone: supervisor_phone as string,
      },
    });

    return NextResponse.redirect("/database/buyer");
  } catch (err) {
    console.error("Error adding buyer:", err);
    return NextResponse.json({ error: "Error adding buyer" }, { status: 500 });
  }
}
