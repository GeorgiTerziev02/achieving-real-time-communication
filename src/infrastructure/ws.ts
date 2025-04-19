import WebSocket from "ws";

export function configureWebSocket(wss: WebSocket.Server) {
	// WebSocket connection handler
	wss.on("connection", (ws: WebSocket) => {
		console.log("WebSocket client connected");
		clients.add(ws);

		// Send welcome message
		const welcomeMessage: Message = {
			type: "system",
			content: "Connected via WebSocket",
			timestamp: new Date().toISOString(),
		};
		ws.send(JSON.stringify(welcomeMessage));

		// Send existing messages
		messages.forEach((msg) => {
			ws.send(JSON.stringify(msg));
		});

		// Handle incoming messages
		ws.on("message", (data: WebSocket.Data) => {
			try {
				const message: Message = JSON.parse(data.toString());
				message.timestamp = new Date().toISOString();
				messages.push(message);

				// Broadcast to all WebSocket clients
				wss.clients.forEach((client) => {
					if (client !== ws && client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify(message));
					}
				});
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		});

		// Handle client disconnection
		ws.on("close", () => {
			console.log("WebSocket client disconnected");
			clients.delete(ws);
		});
	});
}
