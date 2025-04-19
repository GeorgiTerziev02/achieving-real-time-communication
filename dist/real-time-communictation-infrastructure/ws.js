"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureWebSocket = configureWebSocket;
const ws_1 = __importDefault(require("ws"));
const connections_registry_1 = require("../connections-registry");
function configureWebSocket(server) {
    // WebSocket connection handler
    const wss = new ws_1.default.Server({ server });
    const registry = connections_registry_1.ConnectionsRegistry.getInstance();
    wss.on("connection", (ws) => {
        console.log("WebSocket client connected");
        registry.addConnection('user1', ws);
        // Send welcome message
        const welcomeMessage = {
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
        ws.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                message.timestamp = new Date().toISOString();
                messages.push(message);
                // Broadcast to all WebSocket clients
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === ws_1.default.OPEN) {
                        client.send(JSON.stringify(message));
                    }
                });
            }
            catch (error) {
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
//# sourceMappingURL=ws.js.map