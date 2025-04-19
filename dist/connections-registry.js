"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsRegistry = void 0;
// Should support grouping
class ConnectionsRegistry {
    constructor() {
        this.connections = new Map();
    }
    static getInstance() {
        if (!ConnectionsRegistry.instance) {
            ConnectionsRegistry.instance = new ConnectionsRegistry();
        }
        return ConnectionsRegistry.instance;
    }
    // Add your connection management methods here
    addConnection(id, connection) {
        this.connections.set(id, connection);
    }
    removeConnection(id) {
        this.connections.delete(id);
    }
    getConnection(id) {
        return this.connections.get(id);
    }
    getAllConnections() {
        return Array.from(this.connections.values());
    }
}
exports.ConnectionsRegistry = ConnectionsRegistry;
ConnectionsRegistry.instance = null;
//# sourceMappingURL=connections-registry.js.map