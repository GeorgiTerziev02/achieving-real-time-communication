"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongPollingTransport = void 0;
class LongPollingTransport {
    constructor(res) {
        this.res = res;
    }
    send(message) {
        this.res.json(message);
    }
}
exports.LongPollingTransport = LongPollingTransport;
//# sourceMappingURL=longpolling-transport.js.map