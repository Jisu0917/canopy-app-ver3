"use strict";
// File: server/src/routes/canopyRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
// Create canopy
router.post("/create", async (req, res) => {
    try {
        const { manage_number, class_number, region: address, buyer_id, status_fold, status_motor, status_led, status_sound, status_inform, status_temperature, status_transmit, } = req.body;
        const buyer = await prisma_1.default.buyer.findUnique({
            where: { id: buyer_id },
        });
        if (!buyer) {
            return res.status(404).json({ error: "Buyer not found" });
        }
        let location = await prisma_1.default.location.findUnique({ where: { address } });
        if (!location) {
            location = await prisma_1.default.location.create({
                data: {
                    region: buyer.region,
                    address,
                },
            });
        }
        const newCanopy = await prisma_1.default.canopy.create({
            data: {
                manage_number,
                class_number,
                location_id: location.id,
                buyer_id,
                status_fold: status_fold !== null && status_fold !== void 0 ? status_fold : false,
                status_motor: status_motor !== null && status_motor !== void 0 ? status_motor : false,
                status_led: status_led !== null && status_led !== void 0 ? status_led : false,
                status_sound: status_sound !== null && status_sound !== void 0 ? status_sound : false,
                status_inform: status_inform !== null && status_inform !== void 0 ? status_inform : false,
                status_temperature,
                status_transmit: status_transmit !== null && status_transmit !== void 0 ? status_transmit : false,
            },
        });
        res.status(201).json(newCanopy);
    }
    catch (error) {
        console.error("Error adding canopy:", error);
        res.status(500).json({ error: "Error adding canopy" });
    }
});
// Delete canopy
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.canopy.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Canopy deleted" });
    }
    catch (error) {
        console.error("Error deleting canopy:", error);
        res.status(500).json({ error: "Failed to delete canopy" });
    }
});
// Get all canopies
router.get("/show", async (req, res) => {
    try {
        const canopies = await prisma_1.default.canopy.findMany({
            include: {
                location: true,
                buyer: true,
            },
        });
        const locations = await prisma_1.default.location.findMany();
        const buyers = await prisma_1.default.buyer.findMany();
        const data = canopies.map(({ id, location, buyer, ...rest }) => ({
            id,
            data: {
                id,
                ...rest,
                location: { ...location },
                buyer: buyer ? { ...buyer } : undefined,
            },
        }));
        const relatedData = [
            ...locations.map((location) => ({
                id: location.id,
                data: {
                    location_id: location.id,
                    region: location.region,
                },
            })),
            ...buyers.map((buyer) => ({
                id: buyer.id,
                data: {
                    buyer_id: buyer.id,
                    supervisor_name: buyer.supervisor_name,
                },
            })),
        ];
        const formattedRelatedData = canopies.reduce((acc, canopy) => {
            acc[canopy.id] = relatedData.filter((rel) => ("location_id" in rel.data &&
                rel.data.location_id === canopy.location_id) ||
                ("buyer_id" in rel.data && rel.data.buyer_id === canopy.buyer_id));
            return acc;
        }, {});
        res.status(200).json({ data, relatedData: formattedRelatedData });
    }
    catch (error) {
        console.error("Error fetching canopies:", error);
        res.status(500).json({ error: "Failed to fetch canopies" });
    }
});
// Update canopy
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { manage_number, class_number, location_id, buyer_id, status_fold, status_motor, status_led, status_sound, status_inform, status_temperature, status_transmit, } = req.body;
        const updateData = {
            manage_number,
            class_number,
            location_id: location_id ? parseInt(location_id, 10) : undefined,
            buyer_id: buyer_id ? parseInt(buyer_id, 10) : undefined,
            status_fold,
            status_motor,
            status_led,
            status_sound,
            status_inform,
            status_temperature: status_temperature
                ? parseInt(status_temperature, 10)
                : undefined,
            status_transmit,
        };
        const updatedCanopy = await prisma_1.default.canopy.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        res.status(200).json(updatedCanopy);
    }
    catch (error) {
        console.error("Error updating canopy:", error);
        res.status(500).json({ error: "Failed to update canopy" });
    }
});
// Get canopies by buyer ID
router.get("/show/buyer/:buyerId", async (req, res) => {
    const { buyerId } = req.params;
    if (!buyerId) {
        return res.status(400).json({ error: "Buyer ID is required" });
    }
    try {
        const canopies = await prisma_1.default.canopy.findMany({
            where: {
                buyer_id: parseInt(buyerId),
            },
            include: {
                location: true,
                buyer: true,
            },
        });
        const data = canopies.map(({ id, location, buyer, ...rest }) => ({
            id,
            data: {
                id,
                ...rest,
                location: {
                    ...location,
                },
                buyer: buyer ? { ...buyer } : undefined,
            },
        }));
        res.status(200).json({ data });
    }
    catch (error) {
        console.error("Error fetching buyer canopies:", error);
        res.status(500).json({ error: "Failed to fetch buyer canopies" });
    }
});
exports.default = router;
