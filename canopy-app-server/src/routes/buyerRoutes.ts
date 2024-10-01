// File: server/src/routes/buyerRoutes.ts

import express from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

const router = express.Router();

// Create buyer
router.post("/create", async (req, res) => {
  try {
    const { user_id, password, region, supervisor_name, supervisor_phone } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newBuyer = await prisma.buyer.create({
      data: {
        user_id,
        password: hashedPassword,
        region,
        supervisor_name,
        supervisor_phone,
      },
    });

    res.status(201).json(newBuyer);
  } catch (error) {
    console.error("Error adding buyer:", error);
    res.status(500).json({ error: "Error adding buyer" });
  }
});

// Delete buyer
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.buyer.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Buyer deleted" });
  } catch (error) {
    console.error("Error deleting buyer:", error);
    res.status(500).json({ error: "Failed to delete buyer" });
  }
});

// Get all buyers
router.get("/show", async (req, res) => {
  try {
    const buyers = await prisma.buyer.findMany();
    const data = buyers.map(({ id, ...rest }) => ({
      id,
      data: {
        id,
        ...rest,
      },
    }));
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    res.status(500).json({ error: "Failed to fetch buyers" });
  }
});

// Update buyer
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, password, region, supervisor_name, supervisor_phone } =
      req.body;

    const updateData: any = {
      user_id,
      region,
      supervisor_name,
      supervisor_phone,
    };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedBuyer = await prisma.buyer.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(updatedBuyer);
  } catch (error) {
    console.error("Error updating buyer:", error);
    res.status(500).json({ error: "Failed to update buyer" });
  }
});

export default router;
