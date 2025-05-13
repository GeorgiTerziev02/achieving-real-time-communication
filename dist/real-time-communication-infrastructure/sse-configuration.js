"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSSE = configureSSE;
const express_1 = require("express");
function configureSSE(app, server) {
    const sseRouter = (0, express_1.Router)();
    sseRouter.get('/api/realTime/sse', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const connectionsRegistry = ConnectionsRegistry.getInstance();
        const connection = RealTimeConnectionFactory.createConnection(new SSETransport(req, res));
        connectionsRegistry.addConnection();
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