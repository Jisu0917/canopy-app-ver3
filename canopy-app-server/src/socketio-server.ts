import express from "express";
import http from "http";
import { Server } from "socket.io";
import prisma from "./lib/prisma";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(cors());

import adminRoutes from "./routes/adminRoutes";
import buyerRoutes from "./routes/buyerRoutes";
import canopyRoutes from "./routes/canopyRoutes";
import controlRoutes from "./routes/controlRoutes";
import locationRoutes from "./routes/locationRoutes";

app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/canopy", canopyRoutes);
app.use("/api/control", controlRoutes);
app.use("/api/location", locationRoutes);

const server = http.createServer(app);

const allowedHeaders =
  process.env.NODE_ENV === "production"
    ? ["Authorization", "Content-Type"]
    : ["*"];

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
    methods: ["GET", "POST"],
    allowedHeaders: allowedHeaders,
    credentials: true,
  },
});

const DEBUG = true;
function debug(...args: any[]) {
  if (DEBUG) {
    console.log(new Date().toISOString(), ...args);
  }
}

// 데이터베이스 연결 확인
prisma
  .$connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// 명령을 전달하는 함수
function sendCommand(
  targetSerial: string,
  command: string,
  value: string
): void {
  io.to(targetSerial).emit("command", {
    command: command,
    value: value,
  });
  debug(`Command sent to ${targetSerial}: ${command} ${value}`);
}

io.on("connection", (socket) => {
  debug("New client connected");

  const serialNumber = socket.handshake.query.serialNumber as string;
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
    debug(
      `Private message from ${serialNumber} to ${message.targetSerial}: ${message.content}`
    );
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
    debug(
      `Client info from ${message.targetSerial}: ${JSON.stringify(message)}`
    );
    try {
      const canopy_id = parseInt(message.targetSerial.split("_")[2], 10);
      if (message.content === "temperature") {
        const temperature = parseFloat(message.content_value as string);
        debug(`Updating temperature for canopy ${canopy_id}: ${temperature}`);
        await prisma.canopy.update({
          where: { id: canopy_id },
          data: { status_temperature: temperature },
        });
        debug(`Temperature updated successfully for canopy ${canopy_id}`);
      } else if (message.content === "command_result") {
        const { device, state, result } = message.content_value as {
          device: string;
          state: string;
          result: boolean;
        };
        const updateData: any = {};
        updateData[`status_${device.toLowerCase()}`] = state === "ON";
        debug(
          `Updating control state for canopy ${canopy_id}: ${device} = ${state}`
        );
        await prisma.canopy.update({
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
        debug(
          `Command result sent: ${JSON.stringify({ success: result, command: device, value: state === "ON", targetSerial: message.targetSerial })}`
        );
      }
      debug("Data saved successfully");
    } catch (err) {
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
