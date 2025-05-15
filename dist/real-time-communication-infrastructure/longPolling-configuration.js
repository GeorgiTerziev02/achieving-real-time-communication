"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureLongPolling = configureLongPolling;
const express_1 = require("express");
const connections_registry_1 = require("../connections-registry");
const real_time_connection_1 = require("../real-time-connection");
const longpolling_transport_1 = require("../transport/longpolling-transport");
function configureLongPolling(app) {
    const longPollingRouter = (0, express_1.Router)();
    // here the request should also contain the connectionId!!!!
    longPollingRouter.get('/api/realTime/longPolling', (req, res) => {
        const connectionsRegistry = connections_registry_1.ConnectionsRegistry.getInstance();
        const connection = real_time_connection_1.RealTimeConnectionFactory.createConnection(new longpolling_transport_1.LongPollingTransport(res));
        connectionsRegistry.addConnection(connection.id, connection);
        // Clean up when the client disconnects
        req.on('close', () => {
            connectionsRegistry.removeConnection(connection.id);
        });
    });
    longPollingRouter.post('/api/realTime/longPolling', (req, res) => {
        const connectionsRegistry = connections_registry_1.ConnectionsRegistry.getInstance();
        console.log(req.body);
        // Funny but this won't work in the mean time between two request for long-polling
        // Possible solution: queue-ing of messages that should be send
        // map userId -> not received messages
        // on next connectionId => user gets
        // if he never reconnects => disconnect => remove from map
        connectionsRegistry.getAllConnections().forEach((conn) => {
            conn.sendMessage(req.body);
        });
        res.status(200).send();
    });
    app.use(longPollingRouter);
}
//# sourceMappingURL=longPolling-configuration.js.map