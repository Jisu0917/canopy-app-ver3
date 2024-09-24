import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CanopyModel } from "@/types/models";

export async function POST(request: Request) {
  try {
    const {
      data: {
        manage_number,
        class_number,
        region: address,
        buyer_id,
        status_fold,
        status_motor,
        status_led,
        status_sound,
        status_inform,
        status_temperature,
        status_transmit,
      },
    }: Omit<
      CanopyModel,
      "id" | "location_id" | "location" | "buyer" | "controls"
    > & {
      data: { region: string };
    } = await request.json();

    // 1. Buyer 정보 조회
    const buyer = await prisma.buyer.findUnique({
      where: { id: buyer_id as number },
    });
    if (!buyer) {
      throw new Error("Buyer not found");
    }

    // 2. Buyer의 region을 사용하여 Location 테이블에서 해당 region의 location_id 가져오기
    let location = await prisma.location.findUnique({ where: { address } });

    if (!location) {
      // Location 주소가 존재하지 않는다면 새로 생성
      location = await prisma.location.create({
        data: {
          region: buyer.region,
          address,
        },
      });
    }

    // 3. Canopy 데이터 생성
    await prisma.canopy.create({
      data: {
        manage_number: manage_number as string,
        class_number: class_number as string,
        location_id: location.id,
        buyer_id: buyer_id as number,
        status_fold: (status_fold as boolean) ?? false,
        status_motor: (status_motor as boolean) ?? false,
        status_led: (status_led as boolean) ?? false,
        status_sound: (status_sound as boolean) ?? false,
        status_inform: (status_inform as boolean) ?? false,
        status_temperature: status_temperature as number,
        status_transmit: (status_transmit as boolean) ?? false,
      },
    });

    return NextResponse.redirect("/database/canopy");
  } catch (err) {
    console.error("Error adding canopy:", err);
    return NextResponse.json({ error: "Error adding canopy" }, { status: 500 });
  }
}
