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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectSocketIO = useCallback(() => {
    if (!userId) {
      debug("UserId not available, skipping Socket.IO connection");
      return;
    }

    const serialNumber = `WEB_${userType.toUpperCase()}_${userId}`;
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || window.location.host;

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
        socket.emit("command", {
          targetSerial: `RASPBERRY_PI_${id}`,
          command: control,
          value: value ? "ON" : "OFF",
        });

        // 서버로부터의 응답을 기다립니다
        socket.once(
          "commandResult",
          (result: { success: boolean | PromiseLike<boolean> }) => {
            resolve(result.success);
          }
        );

        // 5초 후에 타임아웃 처리
        setTimeout(() => {
          resolve(false);
        }, 5000);
      });
    },
    [socket]
  );

  return { sendControlCommand, isLoading, error };
};

export default useSocketIO;
