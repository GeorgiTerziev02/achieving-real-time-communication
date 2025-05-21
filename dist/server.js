"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const connections_registry_1 = require("./connections-registry");
const configure_1 = require("./real-time-communication-infrastructure/configure");
const body_parser_1 = __importDefault(require("body-parser"));
// Initialize Express app and WebSocket server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Middleware
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
(0, configure_1.configureRealTimeCommunicationInfrastructure)(['ws', 'sse', 'long-polling'], app, server);
app.get('/negotiate', (req, res) => {
    res.json({
        supportedTransports: ['webSockets', 'longPolling', 'serverSentEvents']
    });
});
app.get('/test', (req, res) => {
    // freeze the main thread
    const start = Date.now();
    while (Date.now() - start < 5000) {
        // do nothing
    }
    res.send('Hello World');
});
const connectionsRegistry = connections_registry_1.ConnectionsRegistry.getInstance();
// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map