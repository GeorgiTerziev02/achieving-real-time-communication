"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("./real-time-communication-infrastructure/ws");
const connections_registry_1 = require("./connections-registry");
// Initialize Express app and WebSocket server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, ws_1.configureWebSocket)(server);
// Middleware
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.get('/negotiate', (req, res) => {
    res.json({
        supportedTransports: ['webSockets', 'longPolling', 'shortPolling', 'serverSentEvents']
    });
});
const connectionsRegistry = connections_registry_1.ConnectionsRegistry.getInstance();
// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map