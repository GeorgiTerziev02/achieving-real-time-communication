"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureWebSocket = configureWebSocket;
const ws_1 = __importDefault(require("ws"));
const connections_registry_1 = require("../connections-registry");
const real_time_connection_1 = require("../real-time-connection");
const websocket_transport_1 = require("../transport/websocket-transport");
function configureWebSocket(app, server) {
    // WebSocket connection handler
    const wss = new ws_1.default.Server({ server });
    const registry = connections_registry_1.ConnectionsRegistry.getInstance();
    wss.on("connection", (ws) => {
        console.log("WebSocket client connected");
        const connection = real_time_connection_1.RealTimeConnectionFactory.createConnection(new websocket_transport_1.WebSocketTransport(ws));
        registry.addConnection(connection.id, connection);
        ws.send(JSON.stringify({ eventName: "welcome", data: "Connected via WebSocket" }));
        // Handle incoming messages
        ws.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                // Broadcast to all WebSocket clients
                registry.getAllConnections().forEach((connection) => {
                    connection.sendMessage(message);
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
//# sourceMappingURL=ws-configuration.js.map