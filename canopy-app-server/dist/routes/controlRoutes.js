"use strict";
// File: server/src/routes/controlRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
// Create control
router.post("/create", async (req, res) => {
    try {
        const { buyer_id, canopy_id, fold, motor, led, sound, inform } = req.body;
        const newControl = await prisma_1.default.control.create({
            data: {
                buyer_id,
                canopy_id,
                fold: fold !== null && fold !== void 0 ? fold : false,
                motor: motor !== null && motor !== void 0 ? motor : false,
                led: led !== null && led !== void 0 ? led : false,
                sound: sound !== null && sound !== void 0 ? sound : false,
                inform: inform !== null && inform !== void 0 ? inform : false,
                timestamp: new Date(),
            },
        });
        const canopy = await prisma_1.default.canopy.findUnique({
            where: { id: canopy_id },
        });
        if (canopy) {
            const latestControl = await prisma_1.default.control.findFirst({
                where: { canopy_id },
                orderBy: { timestamp: "desc" },
            });
            if (latestControl) {
                await prisma_1.default.canopy.update({
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
    }
    catch (error) {
        console.error("Error adding control:", error);
        res.status(500).json({ error: "Error adding control" });
    }
});
// Delete control
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.control.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Control deleted" });
    }
    catch (error) {
        console.error("Error deleting control:", error);
        res.status(500).json({ error: "Failed to delete control" });
    }
});
// Get all controls
router.get("/show", async (req, res) => {
    try {
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
        const relatedData = controls.reduce((acc, control) => {
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
        const formattedRelatedData = controls.reduce((acc, control) => {
            acc[control.id] = relatedData.filter((rel) => {
                var _a, _b;
                return ("manage_number" in rel.data && rel.id === ((_a = control.canopy) === null || _a === void 0 ? void 0 : _a.id)) ||
                    ("supervisor_name" in rel.data && rel.id === ((_b = control.buyer) === null || _b === void 0 ? void 0 : _b.id));
            });
            return acc;
        }, {});
        res.status(200).json({ data, relatedData: formattedRelatedData });
    }
    catch (error) {
        console.error("Error fetching controls:", error);
        res.status(500).json({ error: "Failed to fetch controls" });
    }
});
// Update control
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { canopy_id, buyer_id, fold, motor, led, sound, inform, timestamp } = req.body;
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
        const updatedControl = await prisma_1.default.control.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        res.status(200).json(updatedControl);
    }
    catch (error) {
        console.error("Error updating control:", error);
        res.status(500).json({ error: "Failed to update control" });
    }
});
exports.default = router;
