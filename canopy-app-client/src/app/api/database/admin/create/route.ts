import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AdminModel } from "@/types/models";

const saltRounds = 10;

export async function POST(request: Request) {
  try {
    const {
      data: { name, user_id, password },
    }: Omit<AdminModel, "id"> = await request.json();

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password as string, saltRounds);

    // 해싱된 비밀번호를 사용해 관리자 계정 생성
    await prisma.admin.create({
      data: {
        user_id: user_id as string,
        password: hashedPassword,
        name: name as string,
      },
    });

    return NextResponse.redirect("/database/admin");
  } catch (err) {
    console.error("Error adding admin:", err);
    return NextResponse.json({ error: "Error adding admin" }, { status: 500 });
  }
}
