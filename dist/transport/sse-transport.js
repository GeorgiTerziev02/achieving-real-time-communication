"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SseTransport = void 0;
class SseTransport {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    send(message) {
        this.res.write(`data: ${JSON.stringify(message)}\n\n`);
    }
}
exports.SseTransport = SseTransport;
//# sourceMappingURL=sse-transport.js.map