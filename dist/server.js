"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
// Initialize Express app and WebSocket server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
// Store messages and clients
const messages = [];
const clients = new Set();
// Middleware
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.get('/negotiate', (req, res) => {
    res.json({
        supportedTransports: ['webSockets', 'longPolling', 'shortPolling', 'serverSentEvents']
    });
});
// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.add(ws);
    // Send welcome message
    const welcomeMessage = {
        type: 'system',
        content: 'Connected via WebSocket',
        timestamp: new Date().toISOString()
    };
    ws.send(JSON.stringify(welcomeMessage));
    // Send existing messages
    messages.forEach(msg => {
        ws.send(JSON.stringify(msg));
    });
    // Handle incoming messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            message.timestamp = new Date().toISOString();
            messages.push(message);
            // Broadcast to all WebSocket clients
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        }
        catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });
    // Handle client disconnection
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        clients.delete(ws);
    });
});
// Server-Sent Events endpoint
app.get('/events', (req, res) => {
    console.log('SSE client connected');
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Send initial message
    const initialMessage = {
        type: 'system',
        content: 'Connected via Server-Sent Events',
        timestamp: new Date().toISOString()
    };
    res.write(`data: ${JSON.stringify(initialMessage)}\n\n`);
    // Send existing messages
    messages.forEach(msg => {
        res.write(`data: ${JSON.stringify(msg)}\n\n`);
    });
    // Add client to the set
    const clientId = Date.now();
    const client = { id: clientId, type: 'sse', res };
    clients.add(client);
    // Handle client disconnection
    req.on('close', () => {
        console.log('SSE client disconnected');
        clients.delete(client);
    });
});
// Long Polling endpoint
app.get('/long-poll', (req, res) => {
    console.log('Long Polling client connected');
    // Send initial message
    const initialMessage = {
        type: 'system',
        content: 'Connected via Long Polling',
        timestamp: new Date().toISOString()
    };
    res.json(initialMessage);
    // Add client to the set
    const clientId = Date.now();
    const client = { id: clientId, type: 'long-poll', res };
    clients.add(client);
    // Handle client disconnection
    req.on('close', () => {
        console.log('Long Polling client disconnected');
        clients.delete(client);
    });
});
// Short Polling endpoint
app.get('/short-poll', (req, res) => {
    console.log('Short Polling client connected');
    // Send initial message
    const initialMessage = {
        type: 'system',
        content: 'Connected via Short Polling',
        timestamp: new Date().toISOString()
    };
    res.json(initialMessage);
    // Add client to the set
    const clientId = Date.now();
    const client = { id: clientId, type: 'short-poll', res };
    clients.add(client);
    // Handle client disconnection
    req.on('close', () => {
        console.log('Short Polling client disconnected');
        clients.delete(client);
    });
});
// Message endpoint for all transport methods
app.post('/message', (req, res) => {
    const message = req.body;
    message.timestamp = new Date().toISOString();
    messages.push(message);
    // Broadcast to all clients
    clients.forEach(client => {
        if ('type' in client) { // Type guard for Client interface
            if (client.type === 'sse') {
                client.res.write(`data: ${JSON.stringify(message)}\n\n`);
            }
            else if (client.type === 'long-poll' || client.type === 'short-poll') {
                client.res.json(message);
            }
        }
    });
    res.status(200).json({ success: true });
});
// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map