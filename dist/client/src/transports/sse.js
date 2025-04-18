"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSETransport = void 0;
const common_1 = require("../common");
class SSETransport {
    constructor() {
        this.eventSource = null;
        this.reconnectTimeout = null;
    }
    connect() {
        (0, common_1.updateStatus)('connecting', 'Connecting via Server-Sent Events...');
        const sseUrl = `${window.location.protocol}//${window.location.host}/sse`;
        this.eventSource = new EventSource(sseUrl);
        this.eventSource.onopen = () => {
            (0, common_1.updateStatus)('connected', 'SSE connection established');
            (0, common_1.addMessage)({
                type: 'system',
                content: 'SSE connection established',
                timestamp: new Date().toISOString()
            });
        };
        this.eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);
            (0, common_1.addMessage)(message);
        };
        this.eventSource.onerror = () => {
            //updateStatus('error', 'SSE connection error');
            (0, common_1.addMessage)({
                type: 'system',
                content: 'SSE connection error',
                timestamp: new Date().toISOString()
            });
            // Close the current connection
            this.disconnect();
            // Attempt to reconnect after 5 seconds
            this.reconnectTimeout = window.setTimeout(() => this.connect(), 5000);
        };
    }
    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
            (0, common_1.updateStatus)('disconnected', 'SSE connection closed');
            (0, common_1.addMessage)({
                type: 'system',
                content: 'SSE connection closed',
                timestamp: new Date().toISOString()
            });
        }
    }
    sendMessage(message) {
        // SSE is one-way communication from server to client
        // We'll use a regular fetch request to send messages
        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            (0, common_1.addMessage)(message);
        })
            .catch(error => {
            //updateStatus('error');
            (0, common_1.addMessage)({
                type: 'system',
                content: `Failed to send message: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        });
    }
    getName() {
        return 'Server-Sent Events';
    }
    getFeatures() {
        return 'One-way server-to-client streaming, automatic reconnection, HTTP-based';
    }
}
exports.SSETransport = SSETransport;
//# sourceMappingURL=sse.js.map