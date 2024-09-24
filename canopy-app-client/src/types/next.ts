import { NextApiResponse } from "next";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as NetServer } from "http";
import { Server as WebSocketServer } from "ws";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
      ws: WebSocketServer;
    };
  };
};
