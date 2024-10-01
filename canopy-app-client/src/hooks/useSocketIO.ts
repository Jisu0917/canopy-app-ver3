/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { ConnectedMessage } from "@/types/websocket";

const DEBUG = true;
function debug(...args: any[]) {
  if (DEBUG) {
    console.log(new Date().toISOString(), ...args);
  }
}

const RECONNECT_INTERVAL = 5000;

const useSocketIO = (userType: "admin" | "buyer", userId: string | null) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commandResults, setCommandResults] = useState<{
    [key: string]: boolean | string;
  }>({});
  const socketRef = useRef<typeof Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectSocketIO = useCallback(() => {
    if (!userId || !userType) {
      debug("UserId or userType not available, skipping Socket.IO connection");
      return;
    }

    if (socketRef.current?.connected) {
      debug("Socket already connected, skipping connection");
      return;
    }

    const serialNumber = `WEB_${userType.toUpperCase()}_${userId}`;
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "localhost:5000";

    debug(`Connecting to Socket.IO server at ${socketUrl}`);

    socketRef.current = io(socketUrl, {
      query: { serialNumber },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: RECONNECT_INTERVAL,
    });

    socketRef.current.on("connect", () => {
      debug("Socket.IO connected successfully");
      setIsLoading(false);
      setError(null);
    });

    socketRef.current.on("connected", (message: ConnectedMessage) => {
      debug("Connection confirmed:", message.content);
    });

    socketRef.current.on("disconnect", (reason: string) => {
      debug("Socket.IO disconnected:", reason);
      setError("Socket.IO connection closed");
      setIsLoading(false);
    });

    socketRef.current.on("error", (error: Error) => {
      debug("Socket.IO error:", error);
      setError("Socket.IO connection error");
      setIsLoading(false);
    });

    socketRef.current.on("commandResult", (result: any) => {
      debug("Received commandResult:", result);
      setCommandResults((prev) => ({
        ...prev,
        [result.command]: result.value,
      }));
    });
  }, [userType, userId]);

  useEffect(() => {
    if (userId) {
      debug("Setting up Socket.IO connection");
      connectSocketIO();

      return () => {
        debug("Cleaning up Socket.IO connection");
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };
    }
  }, [userId, connectSocketIO]);

  const sendControlCommand = useCallback(
    async (id: number, control: string, value: boolean): Promise<boolean> => {
      if (!socketRef.current) {
        console.error("Socket is not connected");
        return false;
      }

      return new Promise((resolve) => {
        const command = {
          targetSerial: `RASPBERRY_PI_${id}`,
          command: control,
          value: value ? "ON" : "OFF",
        };
        debug("Emitting command:", command);
        socketRef.current?.emit("command", command);

        const timeout = setTimeout(() => {
          debug("Command timed out");
          resolve(false);
        }, 5000);

        const handleCommandResult = (result: any) => {
          debug("Received command result:", result);
          clearTimeout(timeout);
          if (
            result.command === control &&
            result.targetSerial === `RASPBERRY_PI_${id}`
          ) {
            setCommandResults((prev) => ({
              ...prev,
              [result.command]: result.value,
            }));
            resolve(result.success);
          } else {
            debug("Received result for different command or target:", result);
            resolve(false);
          }
        };

        socketRef.current?.once("commandResult", handleCommandResult);
      });
    },
    []
  );

  return { sendControlCommand, isLoading, error, commandResults };
};

export default useSocketIO;
