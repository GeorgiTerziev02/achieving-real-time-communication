"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeConnection = void 0;
const uuid_1 = require("uuid");
class RealTimeConnection {
    constructor() {
        this._id = (0, uuid_1.v4)();
    }
    get id() {
        return this._id;
    }
}
exports.RealTimeConnection = RealTimeConnection;
//# sourceMappingURL=real-time-connection.js.map