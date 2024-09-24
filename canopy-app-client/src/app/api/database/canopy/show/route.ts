import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CanopyModel } from "@/types/models";

interface LocationData {
  location_id: number;
  region: string;
}

interface BuyerData {
  buyer_id: number;
  supervisor_name: string;
}

type RelatedData =
  | { id: number; data: LocationData }
  | { id: number; data: BuyerData };

export async function GET() {
  try {
    // 1. DB에서 필요한 데이터를 가져옴
    const canopies = await prisma.canopy.findMany({
      include: {
        location: true,
        buyer: true,
      },
    });

    const locations = await prisma.location.findMany();
    const buyers = await prisma.buyer.findMany();

    // 2. data와 relatedData로 변환
    // main model data
    const data: CanopyModel[] = canopies.map(
      ({ id, location, buyer, ...rest }) => ({
        id,
        data: {
          id,
          ...rest, // 나머지 필드들 (manage_number, class_number 등)
          location: {
            ...location, // location을 Model의 data로 변환
          },
          buyer: buyer
            ? {
                ...buyer, // buyer가 있을 경우에만 변환
              }
            : undefined, // buyer가 없는 경우 undefined
        },
      })
    );

    // related models data
    const relatedData: RelatedData[] = [
      ...locations.map((location) => ({
        id: location.id,
        data: {
          location_id: location.id,
          region: location.region,
        },
      })),
      ...buyers.map((buyer) => ({
        id: buyer.id,
        data: {
          buyer_id: buyer.id,
          supervisor_name: buyer.supervisor_name,
        },
      })),
    ];

    // 3. formattedRelatedData 생성
    const formattedRelatedData: { [key: number]: RelatedData[] } = {};

    for (const canopy of canopies) {
      formattedRelatedData[canopy.id] = relatedData.filter(
        (rel) =>
          ("location_id" in rel.data &&
            rel.data.location_id === canopy.location_id) ||
          ("buyer_id" in rel.data && rel.data.buyer_id === canopy.buyer_id)
      );
    }

    // 4. 응답 데이터 반환
    return NextResponse.json({ data, relatedData: formattedRelatedData });
  } catch (error) {
    console.error("Error fetching canopies:", error);
    return NextResponse.json(
      { error: "Failed to fetch canopies" },
      { status: 500 }
    );
  }
}
