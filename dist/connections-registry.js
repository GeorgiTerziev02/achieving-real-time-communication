"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsRegistry = void 0;
// Should support grouping
class ConnectionsRegistry {
    constructor() {
        this.connections = new Map();
        this.groups = new Map();
    }
    addConnection(connection) {
        this.connections.set(connection.id, connection);
    }
    removeConnection(connection) {
        this.connections.delete(connection.id);
    }
    getConnection(id) {
        return this.connections.get(id);
    }
    hasConnection(id) {
        return this.connections.has(id);
    }
}
exports.ConnectionsRegistry = ConnectionsRegistry;
//# sourceMappingURL=connections-registry.js.map