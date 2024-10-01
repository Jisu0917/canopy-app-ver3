import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "그늘막 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.SERVER_URL}/api/canopy/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update canopy");
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error handling canopy request:", error);
    return NextResponse.json(
      { error: "그늘막 정보 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
