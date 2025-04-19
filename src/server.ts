import express, { Request, Response } from 'express';
import http from 'http';
import { configureWebSocket } from './real-time-communication-infrastructure/ws';
import { ConnectionsRegistry } from './connections-registry';

// Initialize Express app and WebSocket server
const app = express();
const server = http.createServer(app);
configureWebSocket(server);

// Middleware
app.use(express.static('public'));
app.use(express.json());

app.get('/negotiate', (req: Request, res: Response) => {
  res.json({
    supportedTransports: ['webSockets', 'longPolling', 'shortPolling', 'serverSentEvents']
  })
});


const connectionsRegistry = ConnectionsRegistry.getInstance();


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 