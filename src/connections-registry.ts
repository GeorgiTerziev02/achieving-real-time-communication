import { RealTimeConnection } from "./real-time-connection";

// Should support grouping
export class ConnectionsRegistry {
    private connections = new Map<string, RealTimeConnection>();
    private groups = new Map<string, Set<RealTimeConnection>>();

    addConnection(connection: RealTimeConnection) {
        this.connections.set(connection.id, connection);
    }

    removeConnection(connection: RealTimeConnection) {
        this.connections.delete(connection.id);
    }

    getConnection(id: string) {
        return this.connections.get(id);
    }

    hasConnection(id: string) {
        return this.connections.has(id);
    }
}
