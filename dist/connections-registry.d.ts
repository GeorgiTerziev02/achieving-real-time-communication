import { RealTimeConnection } from "./real-time-connection";
export declare class ConnectionsRegistry {
    private connections;
    private groups;
    addConnection(connection: RealTimeConnection): void;
    removeConnection(connection: RealTimeConnection): void;
    getConnection(id: string): RealTimeConnection | undefined;
    hasConnection(id: string): boolean;
}
