import { Request, Response, Application, Router } from "express";
import { ConnectionsRegistry } from "../connections-registry";
import { RealTimeConnectionFactory } from "../real-time-connection";
import { LongPollingTransport } from "../transport/longpolling-transport";

export function configureLongPolling(app: Application) {
    const longPollingRouter = Router();

    // here the request should also contain the connectionId!!!!
    longPollingRouter.get('/api/realTime/longPolling', (req: Request, res: Response) => {
        const connectionsRegistry = ConnectionsRegistry.getInstance();
        const connection = RealTimeConnectionFactory.createConnection(new LongPollingTransport(res));
        connectionsRegistry.addConnection(connection.id, connection);

        // Clean up when the client disconnects
        req.on('close', () => {
            connectionsRegistry.removeConnection(connection.id);
        });
    });

    longPollingRouter.post('/api/realTime/longPolling', (req: Request, res: Response) => {
        const connectionsRegistry = ConnectionsRegistry.getInstance();
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