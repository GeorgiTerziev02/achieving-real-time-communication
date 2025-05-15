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
        const connection = real_time_connection_1.RealTimeConnectionFactory.createConnection(new sse_transport_1.SSETransport(res));
        connectionsRegistry.addConnection(connection.id, connection);
        // Clean up the interval when the client disconnects
        req.on('close', () => {
            res.end();
            connectionsRegistry.removeConnection(connection.id);
        });
    });
    sseRouter.post('/api/realTime/sse', (req, res) => {
        const connectionsRegistry = connections_registry_1.ConnectionsRegistry.getInstance();
        console.log(req.body);
        connectionsRegistry.getAllConnections().forEach((conn) => {
            conn.sendMessage(req.body);
        });
        res.status(200).send();
    });
    app.use(sseRouter);
}
//# sourceMappingURL=sse-configuration.js.map