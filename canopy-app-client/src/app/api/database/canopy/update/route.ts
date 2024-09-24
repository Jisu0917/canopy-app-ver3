import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const {
      id,
      data: {
        manage_number,
        class_number,
        location_id,
        buyer_id,
        status_fold,
        status_motor,
        status_led,
        status_sound,
        status_inform,
        status_temperature,
        status_transmit,
      },
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "그늘막 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 업데이트할 데이터 객체 초기화
    const updateData: {
      manage_number?: string;
      class_number?: string;
      location_id?: number;
      buyer_id?: number;
      status_fold?: boolean;
      status_motor?: boolean;
      status_led?: boolean;
      status_sound?: boolean;
      status_inform?: boolean;
      status_temperature?: number;
      status_transmit?: boolean;
    } = {
      manage_number,
      class_number,
      location_id: location_id ? parseInt(location_id, 10) : undefined,
      buyer_id: buyer_id ? parseInt(buyer_id, 10) : undefined,
      status_fold,
      status_motor,
      status_led,
      status_sound,
      status_inform,
      status_temperature: status_temperature
        ? parseInt(status_temperature, 10)
        : undefined,
      status_transmit,
    };

    // 그늘막 정보 업데이트
    const updatedCanopy = await prisma.canopy.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedCanopy, { status: 200 });
  } catch (error) {
    console.error("Error handling canopy request:", error);
    return NextResponse.json(
      { error: "그늘막 정보 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
