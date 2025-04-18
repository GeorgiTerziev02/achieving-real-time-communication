import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket from 'ws';

// Types
interface Message {
  type: string;
  content: string;
  timestamp: string;
}

interface Client {
  id: number;
  type: 'sse' | 'long-poll' | 'short-poll';
  res: Response;
}

// Initialize Express app and WebSocket server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store messages and clients
const messages: Message[] = [];
const clients: Set<WebSocket | Client> = new Set();

// Middleware
app.use(express.static('public'));
app.use(express.json());

app.get('/negotiate', (req: Request, res: Response) => {
  res.json({
    supportedTransports: ['webSockets', 'longPolling', 'shortPolling', 'serverSentEvents']
  })
});


// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
  console.log('WebSocket client connected');
  clients.add(ws);

  // Send welcome message
  const welcomeMessage: Message = {
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
  ws.on('message', (data: WebSocket.Data) => {
    try {
      const message: Message = JSON.parse(data.toString());
      message.timestamp = new Date().toISOString();
      messages.push(message);
      
      // Broadcast to all WebSocket clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    } catch (error) {
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
app.get('/events', (req: Request, res: Response) => {
  console.log('SSE client connected');
  
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send initial message
  const initialMessage: Message = {
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
  const client: Client = { id: clientId, type: 'sse', res };
  clients.add(client);
  
  // Handle client disconnection
  req.on('close', () => {
    console.log('SSE client disconnected');
    clients.delete(client);
  });
});

// Long Polling endpoint
app.get('/long-poll', (req: Request, res: Response) => {
  console.log('Long Polling client connected');
  
  // Send initial message
  const initialMessage: Message = {
    type: 'system',
    content: 'Connected via Long Polling',
    timestamp: new Date().toISOString()
  };
  res.json(initialMessage);
  
  // Add client to the set
  const clientId = Date.now();
  const client: Client = { id: clientId, type: 'long-poll', res };
  clients.add(client);
  
  // Handle client disconnection
  req.on('close', () => {
    console.log('Long Polling client disconnected');
    clients.delete(client);
  });
});

// Short Polling endpoint
app.get('/short-poll', (req: Request, res: Response) => {
  console.log('Short Polling client connected');
  
  // Send initial message
  const initialMessage: Message = {
    type: 'system',
    content: 'Connected via Short Polling',
    timestamp: new Date().toISOString()
  };
  res.json(initialMessage);
  
  // Add client to the set
  const clientId = Date.now();
  const client: Client = { id: clientId, type: 'short-poll', res };
  clients.add(client);
  
  // Handle client disconnection
  req.on('close', () => {
    console.log('Short Polling client disconnected');
    clients.delete(client);
  });
});

// Message endpoint for all transport methods
app.post('/message', (req: Request, res: Response) => {
  const message: Message = req.body;
  message.timestamp = new Date().toISOString();
  messages.push(message);
  
  // Broadcast to all clients
  clients.forEach(client => {
    if ('type' in client) { // Type guard for Client interface
      if (client.type === 'sse') {
        client.res.write(`data: ${JSON.stringify(message)}\n\n`);
      } else if (client.type === 'long-poll' || client.type === 'short-poll') {
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