// File: server/src/routes/locationRoutes.ts

import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

// Create location
router.post("/create", async (req, res) => {
  try {
    const { region, address } = req.body;
    const newLocation = await prisma.location.create({
      data: { region, address },
    });
    res.status(201).json(newLocation);
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ error: "Error adding location" });
  }
});

// Delete location
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.location.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Location deleted" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Failed to delete location" });
  }
});

// Get all locations
router.get("/show", async (req, res) => {
  try {
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

    const data = locationDetails.map((location) => ({
      id: location.id,
      data: {
        id: location.id,
        region: location.region,
        address: location.address,
      },
    }));

    const relatedData = locationDetails.flatMap((location) => [
      ...location.canopies.map((canopy) => ({
        id: canopy.id,
        data: {
          manage_number: canopy.manage_number,
          class_number: canopy.class_number,
        },
      })),
      ...location.canopies
        .filter((canopy) => canopy.buyer)
        .map((canopy) => ({
          id: canopy.buyer?.id,
          data: {
            buyer_id: canopy.buyer?.user_id,
            region: canopy.buyer?.region,
          },
        })),
    ]);

    const formattedRelatedData = locationDetails.reduce(
      (acc: any, location) => {
        acc[location.id] = relatedData.filter(
          (rel) =>
            ("manage_number" in rel.data && rel.id === location.id) ||
            ("buyer_id" in rel.data && rel.id === location.id)
        );
        return acc;
      },
      {}
    );

    res.status(200).json({ data, relatedData: formattedRelatedData });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Update location
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { region, address } = req.body;

    const updatedLocation = await prisma.location.update({
      where: { id: parseInt(id) },
      data: { region, address },
    });

    res.status(200).json(updatedLocation);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Failed to update location" });
  }
});

export default router;
