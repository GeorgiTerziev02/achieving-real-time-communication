"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureShortPolling = configureShortPolling;
const express_1 = require("express");
function configureShortPolling(app, server) {
    const spRouter = (0, express_1.Router)();
    spRouter.get('/api/realTime/short-polling', (req, res) => {
        // Handle the initial connection
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // Here you can send an initial message or keep the connection open
        res.json({ message: "Connected to Short Polling" });
    });
    spRouter.post('/api/realTime/short-polling', (req, res) => {
        // Handle incoming messages
        const connectionsRegistry = ConnectionsRegistry.getInstance();
        console.log(req.body);
        connectionsRegistry.getAllConnections().forEach((conn) => {
            conn.sendMessage(req.body);
        });
        res.status(200).send();
    });
}
//# sourceMappingURL=shortPolling-configuration.js.map