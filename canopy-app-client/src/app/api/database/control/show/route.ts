import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ControlModel } from "@/types/models";

interface CanopyData {
  manage_number: string;
}

interface BuyerData {
  supervisor_name: string;
}

type RelatedData =
  | { id: number; data: CanopyData }
  | { id: number; data: BuyerData };

export async function GET() {
  try {
    // 1. DB에서 필요한 데이터를 가져옴
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

    // 2. data와 relatedData로 변환
    // main model data
    const data: ControlModel[] = controls.map(
      ({ id, canopy, buyer, ...rest }) => ({
        id,
        data: {
          id,
          ...rest,
          canopy: canopy
            ? {
                ...canopy,
                location: {
                  ...canopy.location, // location도 id와 data로 분리
                },
              }
            : undefined,
          buyer: buyer
            ? {
                ...buyer,
              }
            : undefined,
        },
      })
    );

    // related models data
    const relatedData: RelatedData[] = controls.reduce<RelatedData[]>(
      (acc, control) => {
        if (control.canopy) {
          acc.push({
            id: control.canopy.id,
            data: { manage_number: control.canopy.manage_number },
          });
        }

        if (control.buyer) {
          acc.push({
            id: control.buyer.id,
            data: { supervisor_name: control.buyer.supervisor_name },
          });
        }

        return acc;
      },
      []
    );

    // 3. formattedRelatedData 생성
    const formattedRelatedData: { [key: number]: RelatedData[] } =
      controls.reduce(
        (acc, control) => {
          acc[control.id] = relatedData.filter(
            (rel) =>
              ("manage_number" in rel.data && rel.id === control.canopy?.id) ||
              ("supervisor_name" in rel.data && rel.id === control.buyer?.id)
          );
          return acc;
        },
        {} as { [key: number]: RelatedData[] }
      );

    // 4. 응답 데이터 반환
    return NextResponse.json({ data, relatedData: formattedRelatedData });
  } catch (error) {
    console.error("Error fetching controls:", error);
    return NextResponse.json(
      { error: "Failed to fetch controls" },
      { status: 500 }
    );
  }
}
