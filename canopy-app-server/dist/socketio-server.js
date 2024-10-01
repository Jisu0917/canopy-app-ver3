"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const prisma_1 = __importDefault(require("./lib/prisma"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const buyerRoutes_1 = __importDefault(require("./routes/buyerRoutes"));
const canopyRoutes_1 = __importDefault(require("./routes/canopyRoutes"));
const controlRoutes_1 = __importDefault(require("./routes/controlRoutes"));
const locationRoutes_1 = __importDefault(require("./routes/locationRoutes"));
app.use(express_1.default.json());
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/buyer", buyerRoutes_1.default);
app.use("/api/canopy", canopyRoutes_1.default);
app.use("/api/control", controlRoutes_1.default);
app.use("/api/location", locationRoutes_1.default);
const server = http_1.default.createServer(app);
const allowedHeaders = process.env.NODE_ENV === "production"
    ? ["Authorization", "Content-Type"]
    : ["*"];
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(",")) || [],
        methods: ["GET", "POST"],
        allowedHeaders: allowedHeaders,
        credentials: true,
    },
});
const DEBUG = true;
function debug(...args) {
    if (DEBUG) {
        console.log(new Date().toISOString(), ...args);
    }
}
// 데이터베이스 연결 확인
prisma_1.default
    .$connect()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection failed:", err));
// 명령을 전달하는 함수
function sendCommand(targetSerial, command, value) {
    io.to(targetSerial).emit("command", {
        command: command,
        value: value,
    });
    debug(`Command sent to ${targetSerial}: ${command} ${value}`);
}
io.on("connection", (socket) => {
    debug("New client connected");
    const serialNumber = socket.handshake.query.serialNumber;
    if (!serialNumber) {
        debug("Invalid serial number. Connection rejected.");
        socket.disconnect(true);
        return;
    }
    socket.join(serialNumber);
    debug(`Client connected: ${serialNumber}`);
    // 연결 확인 메시지 즉시 전송
    socket.emit("connected", { content: serialNumber });
    socket.on("broadcast", (message) => {
        debug(`Broadcasting message from ${serialNumber}: ${message.content}`);
        socket.broadcast.emit("broadcast", {
            senderSerial: serialNumber,
            content: message.content,
        });
    });
    socket.on("private", (message) => {
        debug(`Private message from ${serialNumber} to ${message.targetSerial}: ${message.content}`);
        io.to(message.targetSerial).emit("private", {
            senderSerial: serialNumber,
            content: message.content,
        });
    });
    socket.on("command", (message) => {
        debug(`Received command: ${JSON.stringify(message)}`);
        // 명령을 대상 기기로 전송
        sendCommand(message.targetSerial, message.command, message.value);
        debug(`Sent command to target: ${message.targetSerial}`);
    });
    socket.on("clientInfo", async (message) => {
        debug(`Client info from ${message.targetSerial}: ${JSON.stringify(message)}`);
        try {
            const canopy_id = parseInt(message.targetSerial.split("_")[2], 10);
            if (message.content === "temperature") {
                const temperature = parseFloat(message.content_value);
                debug(`Updating temperature for canopy ${canopy_id}: ${temperature}`);
                await prisma_1.default.canopy.update({
                    where: { id: canopy_id },
                    data: { status_temperature: temperature },
                });
                debug(`Temperature updated successfully for canopy ${canopy_id}`);
            }
            else if (message.content === "command_result") {
                const { device, state, result } = message.content_value;
                const updateData = {};
                updateData[`status_${device.toLowerCase()}`] = state === "ON";
                debug(`Updating control state for canopy ${canopy_id}: ${device} = ${state}`);
                await prisma_1.default.canopy.update({
                    where: { id: canopy_id },
                    data: updateData,
                });
                debug(`Control state updated successfully for canopy ${canopy_id}`);
                // 명령 실행 결과를 모든 클라이언트에게 전송
                io.emit("commandResult", {
                    success: result,
                    command: device,
                    value: state === "ON",
                    targetSerial: message.targetSerial,
                    message: `Command ${device} ${state} executed ${result ? "successfully" : "with failure"}`,
                });
                debug(`Command result sent: ${JSON.stringify({ success: result, command: device, value: state === "ON", targetSerial: message.targetSerial })}`);
            }
            debug("Data saved successfully");
        }
        catch (err) {
            console.error("Error saving data:", err);
            debug("Error details:", JSON.stringify(err, null, 2));
            io.emit("commandResult", {
                success: false,
                targetSerial: message.targetSerial,
                message: "Error processing command result",
            });
        }
    });
    socket.on("disconnect", () => {
        debug(`Client disconnected: ${serialNumber}`);
    });
});
const PORT = process.env.WS_PORT || 5000;
server.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`);
    console.log(`Allowed origins: ${process.env.ALLOWED_ORIGINS}`);
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});
