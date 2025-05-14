"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSSE = configureSSE;
const express_1 = require("express");
const connections_registry_1 = require("../connections-registry");
const real_time_connection_1 = require("../real-time-connection");
const sse_transport_1 = require("../transport/sse-transport");
function configureSSE(app, server) {
    const sseRouter = (0, express_1.Router)();
    sseRouter.get('/api/realTime/sse', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const connectionsRegistry = connections_registry_1.ConnectionsRegistry.getInstance();
        const connection = real_time_connection_1.RealTimeConnectionFactory.createConnection(new sse_transport_1.SSETransport(req, res));
        connectionsRegistry.addConnection("some id", connection);
        // Simulate sending updates from the server
        let counter = 0;
        const intervalId = setInterval(() => {
            counter++;
            // Write the event stream format
            res.write(`data: ${JSON.stringify({
                eventName: "chatMessage",
                data: "test",
            })}\n\n`);
        }, 5000);
        // Clean up the interval when the client disconnects
        req.on('close', () => {
            clearInterval(intervalId);
        });
    });
    app.use(sseRouter);
}
//# sourceMappingURL=sse-configuration.js.map