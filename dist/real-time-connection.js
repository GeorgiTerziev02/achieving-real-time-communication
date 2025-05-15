"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeConnectionFactory = exports.RealTimeConnection = void 0;
const uuid_1 = require("uuid");
class RealTimeConnection {
    get id() {
        return this._id;
    }
    constructor(transport) {
        this.transport = transport;
        // What is the special purpose of this id?
        // signalr for example ties it to user not to request or tcp connection
        this._id = (0, uuid_1.v4)();
    }
    sendMessage(message) {
        this.transport.send(message);
    }
}
exports.RealTimeConnection = RealTimeConnection;
class RealTimeConnectionFactory {
    static createConnection(transport) {
        return new RealTimeConnection(transport);
    }
}
exports.RealTimeConnectionFactory = RealTimeConnectionFactory;
//# sourceMappingURL=real-time-connection.js.map