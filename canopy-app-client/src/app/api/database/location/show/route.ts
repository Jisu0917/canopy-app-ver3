import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LocationModel } from "@/types/models";

interface CanopyData {
  manage_number: string;
  class_number: string;
}

interface BuyerData {
  buyer_id: string;
  region: string;
}

type RelatedData =
  | { id: number; data: CanopyData }
  | { id: number; data: BuyerData };

export async function GET() {
  try {
    // 1. DB에서 필요한 데이터를 가져옴
    const locations = await prisma.location.findMany();
    const canopies = await prisma.canopy.findMany({
      include: {
        location: true,
        buyer: true,
      },
    });
    const controls = await prisma.control.findMany({
      include: {
        canopy: {
          include: {
            location: true,
          },
        },
        buyer: true,
      },
    });

    // 2. locationDetails 생성
    const locationDetails = locations.map((location) => ({
      ...location,
      canopies: canopies.filter((canopy) =>
        controls.some(
          (control) =>
            control.canopy_id === canopy.id &&
            control.canopy.location_id === location.id
        )
      ),
    }));

    // 3. data와 relatedData로 변환
    const data: LocationModel[] = locationDetails.map((location) => ({
      id: location.id,
      data: {
        id: location.id,
        region: location.region,
        address: location.address,
      },
    }));

    const relatedData: RelatedData[] = [];

    for (const location of locationDetails) {
      // CanopyData 추가
      for (const canopy of location.canopies) {
        relatedData.push({
          id: canopy.id,
          data: {
            manage_number: canopy.manage_number,
            class_number: canopy.class_number,
          },
        });
      }

      // BuyerData 추가
      for (const canopy of location.canopies) {
        if (canopy.buyer) {
          relatedData.push({
            id: canopy.buyer.id,
            data: {
              buyer_id: canopy.buyer.user_id,
              region: canopy.buyer.region,
            },
          });
        }
      }
    }

    // 4. formattedRelatedData 생성
    const formattedRelatedData: { [key: number]: RelatedData[] } = {};

    for (const location of locationDetails) {
      formattedRelatedData[location.id] = relatedData.filter(
        (rel) =>
          ("manage_number" in rel.data && rel.id === location.id) ||
          ("buyer_id" in rel.data && rel.id === location.id)
      );
    }

    // 5. 응답 데이터 반환
    return NextResponse.json({ data, relatedData: formattedRelatedData });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
