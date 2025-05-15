import express, { Request, Response } from 'express';
import http from 'http';
import { ConnectionsRegistry } from './connections-registry';
import { configureRealTimeCommunicationInfrastructure } from './real-time-communication-infrastructure/configure';
import bodyParser from 'body-parser';

// Initialize Express app and WebSocket server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

configureRealTimeCommunicationInfrastructure(['ws', 'sse', 'long-polling'], app, server);

app.get('/negotiate', (req: Request, res: Response) => {
  res.json({
    supportedTransports: ['webSockets', 'longPolling', 'serverSentEvents']
  })
});


const connectionsRegistry = ConnectionsRegistry.getInstance();


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 