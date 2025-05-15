import http from "http";
import { Request, Response, Application, Router } from "express";
import { ConnectionsRegistry } from "../connections-registry";
import { RealTimeConnectionFactory } from "../real-time-connection";
import { SSETransport } from "../transport/sse-transport";

export function configureSSE(app: Application, server: http.Server) {
    const sseRouter = Router();
    sseRouter.get('/api/realTime/sse', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const connectionsRegistry = ConnectionsRegistry.getInstance();
        const connection = RealTimeConnectionFactory.createConnection(new SSETransport(res));
        connectionsRegistry.addConnection(connection.id, connection);

        // Clean up the interval when the client disconnects
        req.on('close', () => {
            res.end();
            connectionsRegistry.removeConnection(connection.id);
        });
    });

    sseRouter.post('/api/realTime/sse', (req: Request, res: Response) => {
        const connectionsRegistry = ConnectionsRegistry.getInstance();
        console.log(req.body);
        connectionsRegistry.getAllConnections().forEach((conn) => {
            conn.sendMessage(req.body);
        });
        
        res.status(200).send();
    });



    app.use(sseRouter);
}