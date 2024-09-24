import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const {
      id,
      data: { region, address },
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "위치 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 업데이트할 데이터 객체 초기화
    const updateData: {
      region: string;
      address: string;
    } = {
      region,
      address,
    };

    // 위치 정보 업데이트
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedLocation, { status: 200 });
  } catch (error) {
    console.error("Error handling location request:", error);
    return NextResponse.json(
      { error: "위치 정보 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
