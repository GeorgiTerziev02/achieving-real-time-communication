import { RealTimeConnection } from "./real-time-connection";

// usually has mapping connectionId -> connection
// Should support grouping -> some connections can be grouped
// cool thing to keep map userId -> connectionId map so you will be able to find connection by userId
export class ConnectionsRegistry {
    private static instance: ConnectionsRegistry | null = null;
    private connections: Map<string, RealTimeConnection>;

    private constructor() {
        this.connections = new Map();
    }

    public static getInstance(): ConnectionsRegistry {
        if (!ConnectionsRegistry.instance) {
            ConnectionsRegistry.instance = new ConnectionsRegistry();
        }
        return ConnectionsRegistry.instance;
    }

    // Add your connection management methods here
    public addConnection(id: string, connection: RealTimeConnection) {
        this.connections.set(id, connection);
    }

    public removeConnection(id: string) {
        this.connections.delete(id);
    }

    public getConnection(id: string) {
        return this.connections.get(id);
    }

    public getAllConnections() {
        return Array.from(this.connections.values());
    }
}
