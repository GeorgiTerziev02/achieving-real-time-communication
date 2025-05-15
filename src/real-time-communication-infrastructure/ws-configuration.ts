import WebSocket from "ws";
import http from "http";
import { ConnectionsRegistry } from "../connections-registry";
import { Message } from "../message";
import { RealTimeConnectionFactory } from "../real-time-connection";
import { WebSocketTransport } from "../transport/websocket-transport";

export function configureWebSocket(
	app: Express.Application,
	server: http.Server
) {
	// WebSocket connection handler
	const wss = new WebSocket.Server({ server });
	const registry = ConnectionsRegistry.getInstance();

	wss.on("connection", (ws: WebSocket) => {
		console.log("WebSocket client connected");

		const connection = RealTimeConnectionFactory.createConnection(
			new WebSocketTransport(ws)
		);
		registry.addConnection(connection.id, connection);

		
		ws.on("message", (data: WebSocket.Data) => {
			const message: Message = JSON.parse(data.toString());
			// here you should register all the events that the server listens to
			registry.getAllConnections().forEach((conn) => {
				conn.sendMessage(message);
			});
		});

		// Handle client disconnection
		ws.on("close", () => {
			console.log("WebSocket client disconnected");
			registry.removeConnection("user1");
		});
	});
}
