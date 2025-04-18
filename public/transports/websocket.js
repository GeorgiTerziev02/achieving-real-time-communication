import { addMessage, updateStatus } from '../common.js';
export class WebSocketTransport {
    constructor() {
        this.ws = null;
        this.reconnectTimeout = null;
    }
    connect() {
        updateStatus('connecting', 'Connecting via WebSocket...');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        this.ws = new WebSocket(wsUrl);
        this.ws.onopen = () => {
            updateStatus('connected', 'WebSocket connection established');
            addMessage({
                type: 'system',
                content: 'WebSocket connection established',
                timestamp: new Date().toISOString()
            });
        };
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            addMessage(message);
        };
        this.ws.onclose = () => {
            updateStatus('disconnected', 'WebSocket connection closed');
            addMessage({
                type: 'system',
                content: 'WebSocket connection closed',
                timestamp: new Date().toISOString()
            });
            // Attempt to reconnect after 5 seconds
            this.reconnectTimeout = window.setTimeout(() => this.connect(), 5000);
        };
        this.ws.onerror = () => {
            //updateStatus('error');
            addMessage({
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
            addMessage(message);
        }
        else {
            //  updateStatus('error');
            addMessage({
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
//# sourceMappingURL=websocket.js.map