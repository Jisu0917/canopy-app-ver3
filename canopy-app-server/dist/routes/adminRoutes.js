"use strict";
// File: server/src/routes/adminRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
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
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newAdmin = await prisma_1.default.admin.create({
            data: {
                user_id,
                password: hashedPassword,
                name,
            },
        });
        console.log("Admin created:", newAdmin);
        res.status(201).json(newAdmin);
    }
    catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).json({ error: "Error adding admin" });
    }
});
// Delete admin
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.admin.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Admin deleted" });
    }
    catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ error: "Failed to delete admin" });
    }
});
// Get all admins
router.get("/show", async (req, res) => {
    try {
        const admins = await prisma_1.default.admin.findMany();
        const data = admins.map(({ id, ...rest }) => ({
            id,
            data: {
                id,
                ...rest,
            },
        }));
        console.log(data);
        res.status(200).json({ data: data });
    }
    catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ error: "Failed to fetch admins" });
    }
});
// Update admin
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, name, password } = req.body;
        const updateData = { user_id, name };
        if (password && password.trim() !== "") {
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            updateData.password = hashedPassword;
        }
        const updatedAdmin = await prisma_1.default.admin.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        res.status(200).json(updatedAdmin);
    }
    catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ error: "Failed to update admin" });
    }
});
exports.default = router;
