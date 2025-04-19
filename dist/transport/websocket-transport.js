"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketTransport = void 0;
class WebSocketTransport {
    constructor(ws) {
        this.ws = ws;
    }
    send(message) {
        this.ws.send(JSON.stringify(message));
    }
}
exports.WebSocketTransport = WebSocketTransport;
//# sourceMappingURL=websocket-transport.js.map