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
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commandResults, setCommandResults] = useState<{
    [key: string]: boolean | string;
  }>({});
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectSocketIO = useCallback(() => {
    if (!userId) {
      debug("UserId not available, skipping Socket.IO connection");
      return;
    }

    const serialNumber = `WEB_${userType.toUpperCase()}_${userId}`;
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || window.location.host;

    debug(`Connecting to Socket.IO server at ${socketUrl}`);

    const newSocket = io(socketUrl, {
      query: { serialNumber },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: RECONNECT_INTERVAL,
    });

    newSocket.on("connect", () => {
      debug("Socket.IO connected successfully");
      setIsLoading(false);
      setError(null);
    });

    newSocket.on("connected", (message: ConnectedMessage) => {
      debug("Connection confirmed:", message.content);
    });

    newSocket.on("disconnect", (reason: string) => {
      debug("Socket.IO disconnected:", reason);
      setError("Socket.IO connection closed");
      setIsLoading(false);
    });

    newSocket.on("error", (error: Error) => {
      debug("Socket.IO error:", error);
      setError("Socket.IO connection error");
      setIsLoading(false);
    });

    newSocket.on("commandResult", (result: any) => {
      debug("Received commandResult:", result);
      setCommandResults((prev) => ({
        ...prev,
        [result.command]: result.value,
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userType, userId]);

  useEffect(() => {
    if (userId) {
      debug("Setting up Socket.IO connection");
      const cleanup = connectSocketIO();

      return () => {
        debug("Cleaning up Socket.IO connection");
        if (cleanup) cleanup();
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };
    }
  }, [userId, connectSocketIO]);

  const sendControlCommand = useCallback(
    async (id: number, control: string, value: boolean): Promise<boolean> => {
      if (!socket) {
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
        socket.emit("command", command);

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

        socket.once("commandResult", handleCommandResult);
      });
    },
    [socket]
  );

  return { sendControlCommand, isLoading, error, commandResults };
};

export default useSocketIO;
