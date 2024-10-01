"use strict";
// File: server/src/routes/locationRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
// Create location
router.post("/create", async (req, res) => {
    try {
        const { region, address } = req.body;
        const newLocation = await prisma_1.default.location.create({
            data: { region, address },
        });
        res.status(201).json(newLocation);
    }
    catch (error) {
        console.error("Error adding location:", error);
        res.status(500).json({ error: "Error adding location" });
    }
});
// Delete location
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.location.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Location deleted" });
    }
    catch (error) {
        console.error("Error deleting location:", error);
        res.status(500).json({ error: "Failed to delete location" });
    }
});
// Get all locations
router.get("/show", async (req, res) => {
    try {
        const locations = await prisma_1.default.location.findMany();
        const canopies = await prisma_1.default.canopy.findMany({
            include: {
                location: true,
                buyer: true,
            },
        });
        const controls = await prisma_1.default.control.findMany({
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
            canopies: canopies.filter((canopy) => controls.some((control) => control.canopy_id === canopy.id &&
                control.canopy.location_id === location.id)),
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
                .map((canopy) => {
                var _a, _b, _c;
                return ({
                    id: (_a = canopy.buyer) === null || _a === void 0 ? void 0 : _a.id,
                    data: {
                        buyer_id: (_b = canopy.buyer) === null || _b === void 0 ? void 0 : _b.user_id,
                        region: (_c = canopy.buyer) === null || _c === void 0 ? void 0 : _c.region,
                    },
                });
            }),
        ]);
        const formattedRelatedData = locationDetails.reduce((acc, location) => {
            acc[location.id] = relatedData.filter((rel) => ("manage_number" in rel.data && rel.id === location.id) ||
                ("buyer_id" in rel.data && rel.id === location.id));
            return acc;
        }, {});
        res.status(200).json({ data, relatedData: formattedRelatedData });
    }
    catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ error: "Failed to fetch locations" });
    }
});
// Update location
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { region, address } = req.body;
        const updatedLocation = await prisma_1.default.location.update({
            where: { id: parseInt(id) },
            data: { region, address },
        });
        res.status(200).json(updatedLocation);
    }
    catch (error) {
        console.error("Error updating location:", error);
        res.status(500).json({ error: "Failed to update location" });
    }
});
exports.default = router;
