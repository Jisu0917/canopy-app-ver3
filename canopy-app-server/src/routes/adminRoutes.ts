// File: server/src/routes/adminRoutes.ts

import express from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

const router = express.Router();

// Create admin
router.post("/create", async (req, res) => {
  try {
    const { name, user_id, password } = req.body;
    console.log("Received admin data:", {
      name,
      user_id,
      passwordReceived: !!password,
    });

    if (!name || !user_id || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        user_id,
        password: hashedPassword,
        name,
      },
    });

    console.log("Admin created:", newAdmin);
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ error: "Error adding admin" });
  }
});

// Delete admin
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.admin.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Admin deleted" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Failed to delete admin" });
  }
});

// Get all admins
router.get("/show", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    const data = admins.map(({ id, ...rest }) => ({
      id,
      data: {
        id,
        ...rest,
      },
    }));
    console.log(data);
    res.status(200).json({ data: data });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

// Update admin
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, name, password } = req.body;

    const updateData: any = { user_id, name };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Failed to update admin" });
  }
});

export default router;
