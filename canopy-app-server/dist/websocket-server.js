"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma_1 = __importDefault(require("./lib/prisma"));
const http_1 = require("http");
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
const crypto = __importStar(require("crypto"));
const path_1 = __importDefault(require("path"));
// 디버그 로깅 설정
const DEBUG = true;
function debug(...args) {
    if (DEBUG) {
        console.log(new Date().toISOString(), ...args);
    }
}
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const server = (0, http_1.createServer)();
const wss = new ws_1.Server({ noServer: true });
const clients = new Map();
const WebSocketState = {
    OPEN: 1,
    CLOSED: 3,
};
function broadcastMessage(senderSerial, content) {
    const message = JSON.stringify({
        type: "broadcast",
        senderSerial,
        content,
    });
    clients.forEach((client, serial) => {
        if (serial !== senderSerial && client.readyState === WebSocketState.OPEN) {
            client.send(message);
        }
    });
    debug(`Broadcasted message from ${senderSerial}`);
}
function sendPrivateMessage(senderSerial, targetSerial, content) {
    const targetClient = clients.get(targetSerial);
    if (targetClient && targetClient.readyState === WebSocketState.OPEN) {
        targetClient.send(JSON.stringify({ type: "private", senderSerial, content }));
        debug(`Sent private message from ${senderSerial} to ${targetSerial}`);
    }
    else {
        debug(`Target client not found: ${targetSerial}`);
    }
}
function executeCommand(senderSerial, targetSerial, command, value) {
    const targetClient = clients.get(targetSerial);
    if (targetClient && targetClient.readyState === WebSocketState.OPEN) {
        targetClient.send(JSON.stringify({ type: "command", senderSerial, command, value }));
    }
    else {
        console.log(`Target client not found: ${targetSerial}`);
    }
}
async function processClientInfo(targetSerial, content, content_value) {
    switch (content) {
        case "temperature":
            console.log(`${targetSerial}로부터 온도 수신: ${content_value}`);
            try {
                const canopy_id = parseInt(targetSerial.split("_")[2], 10);
                await prisma_1.default.canopy.update({
                    where: { id: canopy_id },
                    data: { status_temperature: content_value },
                });
                console.log("온도 데이터 저장 성공");
            }
            catch (err) {
                console.error("온도 데이터 저장 오류:", err);
            }
            break;
        case "command_result":
            const { device, state, result } = content_value;
            console.log(`${targetSerial}로부터 [device: ${device}] [state: ${state}] 명령 결과 수신: ${result}`);
            try {
                const canopy_id = parseInt(targetSerial.split("_")[2], 10);
                const canopy = await prisma_1.default.canopy.findUnique({
                    where: { id: canopy_id },
                });
                if (!canopy) {
                    console.log("Canopy not found");
                    return;
                }
                const status = state === "ON";
                const updateData = {};
                switch (device) {
                    case "fold":
                        updateData.status_fold = status;
                        break;
                    case "motor":
                        updateData.status_motor = status;
                        break;
                    case "led":
                        updateData.status_led = status;
                        break;
                    case "speaker":
                        updateData.status_sound = status;
                        break;
                    case "inform":
                        updateData.status_inform = status;
                        break;
                }
                await prisma_1.default.canopy.update({
                    where: { id: canopy_id },
                    data: updateData,
                });
                console.log("제어 데이터 저장 성공");
            }
            catch (err) {
                console.error("제어 데이터 저장 오류:", err);
            }
            break;
        default:
            break;
    }
}
function generateAcceptKey(key) {
    return crypto
        .createHash("sha1")
        .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", "binary")
        .digest("base64");
}
wss.on("connection", function connection(ws, req, protocol) {
    debug("New WebSocket connection established");
    debug("Protocol:", protocol);
    const url = new URL(req.url, `http://${req.headers.host}`);
    const serialNumber = url.searchParams.get("serialNumber");
    if (!serialNumber) {
        debug("Invalid serial number. Connection rejected.");
        ws.close(1008, "Valid serial number required.");
        return;
    }
    if (clients.has(serialNumber)) {
        debug(`Existing client reconnected: ${serialNumber}, Total connections: ${clients.size}`);
        const existingClient = clients.get(serialNumber);
        existingClient === null || existingClient === void 0 ? void 0 : existingClient.close(1000, "Replaced by new connection");
    }
    else {
        debug(`New client connected: ${serialNumber}, Total connections: ${clients.size}`);
    }
    clients.set(serialNumber, ws);
    // 연결 확인 메시지 즉시 전송
    const connectedMessage = {
        type: "connected",
        content: serialNumber,
    };
    ws.send(JSON.stringify(connectedMessage));
    ws.on("message", async function incoming(message) {
        debug("Received message:", message.toString());
        try {
            const parsedMessage = JSON.parse(message.toString());
            const { type, content, content_value, targetSerial } = parsedMessage;
            if (!type) {
                throw new Error("Invalid message format: missing 'type' field");
            }
            debug(`type: ${type}, targetSerial: ${targetSerial}, content: ${content}, content_value: ${content_value}`);
            switch (type) {
                case "init":
                    debug(`Initialization message received from ${serialNumber}`);
                    const connectedMessage = {
                        type: "connected",
                        content: serialNumber,
                    };
                    ws.send(JSON.stringify(connectedMessage));
                    break;
                case "ping":
                    const pongMessage = { type: "pong", content: "" };
                    ws.send(JSON.stringify(pongMessage));
                    break;
                case "broadcast":
                    const broadcastMsg = {
                        type: "broadcast",
                        senderSerial: serialNumber,
                        content: content,
                    };
                    broadcastMessage(broadcastMsg.senderSerial, broadcastMsg.content);
                    break;
                case "private":
                    if (targetSerial) {
                        const privateMsg = {
                            type: "private",
                            senderSerial: serialNumber,
                            content: content,
                        };
                        sendPrivateMessage(privateMsg.senderSerial, targetSerial, privateMsg.content);
                    }
                    break;
                case "command":
                    if (targetSerial) {
                        const commandMsg = {
                            type: "command",
                            senderSerial: serialNumber,
                            command: content,
                            value: content_value,
                        };
                        executeCommand(commandMsg.senderSerial, targetSerial, commandMsg.command, commandMsg.value);
                    }
                    break;
                case "clientInfo":
                    if (targetSerial) {
                        const clientInfoMsg = {
                            type: "clientInfo",
                            targetSerial,
                            content: content,
                            content_value: content_value,
                        };
                        await processClientInfo(clientInfoMsg.targetSerial, clientInfoMsg.content, clientInfoMsg.content_value);
                    }
                    break;
                default:
                    debug(`Unknown message type: ${type}`);
                    ws.send(JSON.stringify({ error: "Unknown message type", type }));
            }
        }
        catch (error) {
            debug("Error parsing WebSocket message:", error);
            ws.send(JSON.stringify({ error: "Invalid message format", details: error }));
        }
    });
    ws.on("close", function close(code, reason) {
        debug(`Client disconnected: ${serialNumber}, Code: ${code}, Reason: ${reason}`);
        clients.delete(serialNumber);
        debug(`Remaining connections: ${clients.size}`);
    });
    ws.on("error", function error(err) {
        debug("WebSocket error:", err);
    });
});
server.on("upgrade", function upgrade(request, socket, head) {
    var _a;
    debug("Upgrade request received:");
    debug("Headers:", request.headers);
    const url = new URL(request.url, `http://${request.headers.host}`);
    const origin = request.headers.origin;
    const key = request.headers["sec-websocket-key"];
    const allowedOrigins = [
        ...(((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(",")) || []),
        "http://localhost:3000",
        "http://localhost:8000",
    ];
    if (!origin || !allowedOrigins.includes(origin)) {
        console.log(`Rejecting connection from unauthorized origin: ${origin}`);
        socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
        socket.destroy();
        return;
    }
    if (!key || typeof key !== "string") {
        console.log("Invalid or missing Sec-WebSocket-Key");
        socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
        socket.destroy();
        return;
    }
    const acceptKey = generateAcceptKey(key);
    const headers = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${acceptKey}`,
    ];
    headers.push("", "");
    console.log("Sending response headers:");
    console.log(headers.join("\r\n"));
    socket.write(headers.join("\r\n"));
    if (url.pathname === "/websocket") {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit("connection", ws, request); // 프로토콜 인자 제거
        });
    }
    else {
        console.log(`Invalid path: ${url.pathname}`);
        socket.destroy();
    }
});
const PORT = process.env.WS_PORT || 8080;
try {
    server.listen(PORT, () => {
        console.log(`WebSocket server is running on port ${PORT}`);
    });
}
catch (error) {
    console.error("Failed to start WebSocket server:", error);
    process.exit(1);
}
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});
