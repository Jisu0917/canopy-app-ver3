import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "위치 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.SERVER_URL}/api/location/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update location");
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error handling location request:", error);
    return NextResponse.json(
      { error: "위치 정보 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
