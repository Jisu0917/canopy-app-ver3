import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ControlModel } from "@/types/models";

export async function POST(request: Request) {
  try {
    const {
      data: { buyer_id, canopy_id, fold, motor, led, sound, inform },
    }: Omit<ControlModel, "id" | "canopy" | "buyer"> = await request.json();

    // 1. Add new control entry
    await prisma.control.create({
      data: {
        buyer_id: buyer_id as number,
        canopy_id: canopy_id as number,
        fold: fold ?? false,
        motor: motor ?? false,
        led: led ?? false,
        sound: sound ?? false,
        inform: inform ?? false,
        timestamp: new Date(),
      },
    });

    // 2. Find Canopy and update its status based on the control data
    const canopy = await prisma.canopy.findUnique({
      where: { id: canopy_id as number },
    });
    if (canopy) {
      const latestControl = await prisma.control.findFirst({
        where: { canopy_id: canopy_id as number },
        orderBy: { timestamp: "desc" },
      });

      if (latestControl) {
        await prisma.canopy.update({
          where: { id: canopy_id as number },
          data: {
            status_fold: latestControl.fold,
            status_motor: latestControl.motor,
            status_led: latestControl.led,
            status_sound: latestControl.sound,
            status_inform: latestControl.inform,
          },
        });
      }
    }

    return NextResponse.redirect("/database/control");
  } catch (err) {
    console.error("Error adding control:", err);
    return NextResponse.json(
      { error: "Error adding control" },
      { status: 500 }
    );
  }
}
