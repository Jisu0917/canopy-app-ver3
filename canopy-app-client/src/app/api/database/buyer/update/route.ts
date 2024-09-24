import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const {
      id,
      data: { user_id, password, region, supervisor_name, supervisor_phone },
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "구매자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 업데이트할 데이터 객체 초기화
    const updateData: {
      user_id?: string;
      password?: string;
      region?: string;
      supervisor_name?: string;
      supervisor_phone?: string;
    } = { user_id, region, supervisor_name, supervisor_phone };

    if (password && password.trim() !== "") {
      // 비밀번호가 제공된 경우에만 해싱하여 추가
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // 구매자 정보 업데이트
    const updatedBuyer = await prisma.buyer.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedBuyer, { status: 200 });
  } catch (error) {
    console.error("Error handling buyer request:", error);
    return NextResponse.json(
      { error: "구매자 정보 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
