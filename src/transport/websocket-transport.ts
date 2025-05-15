import { ITransport } from "./itransport";
import { Message } from "../message";
import WebSocket from "ws";

export class WebSocketTransport implements ITransport {
	constructor(private ws: WebSocket) {}

	public send(message: Message): void {
		this.ws.send(JSON.stringify(message));
	}
}
