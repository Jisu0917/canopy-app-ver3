import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const {
      id,
      data: { canopy_id, buyer_id, fold, motor, led, sound, inform, timestamp },
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "제어 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 업데이트할 데이터 객체 초기화
    const updateData: {
      canopy_id: number;
      buyer_id: number;
      fold: boolean;
      motor: boolean;
      led: boolean;
      sound: boolean;
      inform: boolean;
      timestamp: Date;
    } = {
      canopy_id: canopy_id ? parseInt(canopy_id, 10) : 0,
      buyer_id: buyer_id ? parseInt(buyer_id, 10) : 0,
      fold,
      motor,
      led,
      sound,
      inform,
      timestamp: timestamp || new Date().toISOString(),
    };

    // 제어 정보 업데이트
    const updatedControl = await prisma.control.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedControl, { status: 200 });
  } catch (error) {
    console.error("Error handling control request:", error);
    return NextResponse.json(
      { error: "제어 정보 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
