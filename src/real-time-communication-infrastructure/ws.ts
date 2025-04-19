import WebSocket from "ws";
import http from "http";
import { ConnectionsRegistry } from '../connections-registry';
import { Message } from "../message";
import { RealTimeConnectionFactory } from "../real-time-connection";
import { WebSocketTransport } from "../transport/websocket-transport";

export function configureWebSocket(server: http.Server) {
	// WebSocket connection handler
	const wss = new WebSocket.Server({ server });
	const registry = ConnectionsRegistry.getInstance();

	wss.on("connection", (ws: WebSocket) => {
		console.log("WebSocket client connected");

		const connection = RealTimeConnectionFactory.createConnection(new WebSocketTransport(ws));
		registry.addConnection(connection.id, connection);
		
		ws.send(JSON.stringify({ eventName: "welcome", data: "Connected via WebSocket" }));

		// Handle incoming messages
		ws.on("message", (data: WebSocket.Data) => {
			try {
				const message: Message = JSON.parse(data.toString());

				// Broadcast to all WebSocket clients
				registry.getAllConnections().forEach((connection) => {
					connection.sendMessage(message);
				});
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		});

		// Handle client disconnection
		ws.on("close", () => {
			console.log("WebSocket client disconnected");
			registry.removeConnection('user1');
		});
	});
}
