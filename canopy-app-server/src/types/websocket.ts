export type WebSocketMessageType =
  | "broadcast"
  | "private"
  | "command"
  | "clientInfo"
  | "init"
  | "ping"
  | "pong"
  | "connected";

export interface WebSocketMessage {
  type: WebSocketMessageType;
  senderSerial?: string;
  targetSerial?: string;
  content: string;
  content_value?: string | ClientInfo | ControlResult;
}

export interface ClientInfo {
  temperature: number;
}

export interface ControlResult {
  device: "fold" | "motor" | "led" | "speaker" | "inform";
  state: "ON" | "OFF";
  result: boolean;
}

export interface ConnectedMessage {
  type: "connected";
  content: string;
}

export interface BroadcastMessage {
  type: "broadcast";
  senderSerial: string;
  content: string;
}

export interface PrivateMessage {
  type: "private";
  senderSerial: string;
  content: string;
}

export interface CommandMessage {
  type: "command";
  senderSerial: string;
  command: string;
  value: string;
}

export interface ClientInfoMessage {
  type: "clientInfo";
  targetSerial: string;
  content: "temperature" | "command_result";
  content_value: ClientInfo | ControlResult;
}
