import { RealTimeConnection } from "./real-time-connection";
export declare class ConnectionsRegistry {
    private static instance;
    private connections;
    private constructor();
    static getInstance(): ConnectionsRegistry;
    addConnection(id: string, connection: RealTimeConnection): void;
    removeConnection(id: string): void;
    getConnection(id: string): RealTimeConnection | undefined;
    getAllConnections(): RealTimeConnection[];
}
