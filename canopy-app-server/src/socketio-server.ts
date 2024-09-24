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
    debug(
      `Command from ${serialNumber} to ${message.targetSerial}: ${message.command} ${message.value}`
    );
    io.to(message.targetSerial).emit("command", {
      senderSerial: serialNumber,
      command: message.command,
      value: message.value,
    });
  });

  socket.on("clientInfo", async (message) => {
    debug(`Client info from ${message.targetSerial}: ${message.content}`);
    try {
      const canopy_id = parseInt(message.targetSerial.split("_")[2], 10);
      if (message.content === "temperature") {
        await prisma.canopy.update({
          where: { id: canopy_id },
          data: { status_temperature: message.content_value as number },
        });
      } else if (message.content === "command_result") {
        const { device, state, result } = message.content_value;
        const updateData: any = {};
        updateData[`status_${device.toLowerCase()}`] = state === "ON";
        await prisma.canopy.update({
          where: { id: canopy_id },
          data: updateData,
        });
      }
      debug("Data saved successfully");
    } catch (err) {
      console.error("Error saving data:", err);
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
