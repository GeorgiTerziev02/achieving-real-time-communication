"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSETransport = void 0;
class SSETransport {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    send(message) {
        this.res.write(`data: ${JSON.stringify(message)}\n\n`);
    }
}
exports.SSETransport = SSETransport;
//# sourceMappingURL=sse-transport.js.map