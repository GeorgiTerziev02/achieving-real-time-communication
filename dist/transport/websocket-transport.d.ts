import { ITransport } from "./itransport";
import { Message } from "../message";
import WebSocket from "ws";
export declare class WebSocketTransport implements ITransport {
    private ws;
    constructor(ws: WebSocket);
    send(message: Message): void;
}
