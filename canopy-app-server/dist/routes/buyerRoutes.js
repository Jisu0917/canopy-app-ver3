"use strict";
// File: server/src/routes/buyerRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
// Create buyer
router.post("/create", async (req, res) => {
    try {
        const { user_id, password, region, supervisor_name, supervisor_phone } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newBuyer = await prisma_1.default.buyer.create({
            data: {
                user_id,
                password: hashedPassword,
                region,
                supervisor_name,
                supervisor_phone,
            },
        });
        res.status(201).json(newBuyer);
    }
    catch (error) {
        console.error("Error adding buyer:", error);
        res.status(500).json({ error: "Error adding buyer" });
    }
});
// Delete buyer
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.buyer.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Buyer deleted" });
    }
    catch (error) {
        console.error("Error deleting buyer:", error);
        res.status(500).json({ error: "Failed to delete buyer" });
    }
});
// Get all buyers
router.get("/show", async (req, res) => {
    try {
        const buyers = await prisma_1.default.buyer.findMany();
        const data = buyers.map(({ id, ...rest }) => ({
            id,
            data: {
                id,
                ...rest,
            },
        }));
        res.status(200).json({ data });
    }
    catch (error) {
        console.error("Error fetching buyers:", error);
        res.status(500).json({ error: "Failed to fetch buyers" });
    }
});
// Update buyer
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, password, region, supervisor_name, supervisor_phone } = req.body;
        const updateData = {
            user_id,
            region,
            supervisor_name,
            supervisor_phone,
        };
        if (password && password.trim() !== "") {
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            updateData.password = hashedPassword;
        }
        const updatedBuyer = await prisma_1.default.buyer.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        res.status(200).json(updatedBuyer);
    }
    catch (error) {
        console.error("Error updating buyer:", error);
        res.status(500).json({ error: "Failed to update buyer" });
    }
});
exports.default = router;
