// File: server/src/routes/controlRoutes.ts

import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

// Create control
router.post("/create", async (req, res) => {
  try {
    const { buyer_id, canopy_id, fold, motor, led, sound, inform } = req.body;

    const newControl = await prisma.control.create({
      data: {
        buyer_id,
        canopy_id,
        fold: fold ?? false,
        motor: motor ?? false,
        led: led ?? false,
        sound: sound ?? false,
        inform: inform ?? false,
        timestamp: new Date(),
      },
    });

    const canopy = await prisma.canopy.findUnique({
      where: { id: canopy_id },
    });

    if (canopy) {
      const latestControl = await prisma.control.findFirst({
        where: { canopy_id },
        orderBy: { timestamp: "desc" },
      });

      if (latestControl) {
        await prisma.canopy.update({
          where: { id: canopy_id },
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

    res.status(201).json(newControl);
  } catch (error) {
    console.error("Error adding control:", error);
    res.status(500).json({ error: "Error adding control" });
  }
});

// Delete control
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.control.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Control deleted" });
  } catch (error) {
    console.error("Error deleting control:", error);
    res.status(500).json({ error: "Failed to delete control" });
  }
});

// Get all controls
router.get("/show", async (req, res) => {
  try {
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

    const data = controls.map(({ id, canopy, buyer, ...rest }) => ({
      id,
      data: {
        id,
        ...rest,
        canopy: canopy
          ? {
              ...canopy,
              location: {
                ...canopy.location,
              },
            }
          : undefined,
        buyer: buyer
          ? {
              ...buyer,
            }
          : undefined,
      },
    }));

    const relatedData = controls.reduce((acc: any, control) => {
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
    }, []);

    const formattedRelatedData = controls.reduce((acc: any, control) => {
      acc[control.id] = relatedData.filter(
        (rel: { data: any; id: number }) =>
          ("manage_number" in rel.data && rel.id === control.canopy?.id) ||
          ("supervisor_name" in rel.data && rel.id === control.buyer?.id)
      );
      return acc;
    }, {});

    res.status(200).json({ data, relatedData: formattedRelatedData });
  } catch (error) {
    console.error("Error fetching controls:", error);
    res.status(500).json({ error: "Failed to fetch controls" });
  }
});

// Update control
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { canopy_id, buyer_id, fold, motor, led, sound, inform, timestamp } =
      req.body;

    const updateData = {
      canopy_id: canopy_id ? parseInt(canopy_id, 10) : undefined,
      buyer_id: buyer_id ? parseInt(buyer_id, 10) : undefined,
      fold,
      motor,
      led,
      sound,
      inform,
      timestamp: timestamp || new Date().toISOString(),
    };

    const updatedControl = await prisma.control.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(updatedControl);
  } catch (error) {
    console.error("Error updating control:", error);
    res.status(500).json({ error: "Failed to update control" });
  }
});

export default router;
