"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketTransport = void 0;
const common_1 = require("../common");
class WebSocketTransport {
    constructor() {
        this.ws = null;
        this.reconnectTimeout = null;
    }
    connect() {
        (0, common_1.updateStatus)('connecting', 'Connecting via WebSocket...');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        this.ws = new WebSocket(wsUrl);
        this.ws.onopen = () => {
            (0, common_1.updateStatus)('connected', 'WebSocket connection established');
            (0, common_1.addMessage)({
                type: 'system',
                content: 'WebSocket connection established',
                timestamp: new Date().toISOString()
            });
        };
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            (0, common_1.addMessage)(message);
        };
        this.ws.onclose = () => {
            (0, common_1.updateStatus)('disconnected', 'WebSocket connection closed');
            (0, common_1.addMessage)({
                type: 'system',
                content: 'WebSocket connection closed',
                timestamp: new Date().toISOString()
            });
            // Attempt to reconnect after 5 seconds
            this.reconnectTimeout = window.setTimeout(() => this.connect(), 5000);
        };
        this.ws.onerror = () => {
            //updateStatus('error');
            (0, common_1.addMessage)({
                type: 'system',
                content: 'WebSocket error occurred',
                timestamp: new Date().toISOString()
            });
        };
    }
    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
            (0, common_1.addMessage)(message);
        }
        else {
            //  updateStatus('error');
            (0, common_1.addMessage)({
                type: 'system',
                content: 'Cannot send message: WebSocket is not connected',
                timestamp: new Date().toISOString()
            });
        }
    }
    getName() {
        return 'WebSocket';
    }
    getFeatures() {
        return 'Full-duplex communication, low latency, real-time updates';
    }
}
exports.WebSocketTransport = WebSocketTransport;
//# sourceMappingURL=websocket.js.map