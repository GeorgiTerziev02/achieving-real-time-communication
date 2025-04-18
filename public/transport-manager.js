import { WebSocketTransport } from './transports/websocket.js';
import { SSETransport } from './transports/sse.js';
import { LongPollingTransport } from './transports/long-polling.js';
import { ShortPollingTransport } from './transports/short-polling.js';
// Transport manager class
class TransportManager {
    constructor() {
        this.currentTransport = null;
        this.transports = {
            websocket: new WebSocketTransport(),
            sse: new SSETransport(),
            longPolling: new LongPollingTransport(),
            shortPolling: new ShortPollingTransport()
        };
        this.initializeButtons();
        this.switchTransport('websocket'); // Start with WebSocket
    }
    initializeButtons() {
        const buttons = {
            wsButton: 'websocket',
            sseButton: 'sse',
            longPollButton: 'longPolling',
            shortPollButton: 'shortPolling'
        };
        Object.entries(buttons).forEach(([buttonId, transportName]) => {
            const button = document.getElementById(buttonId);
            button.addEventListener('click', () => this.switchTransport(transportName));
        });
    }
    switchTransport(transportName) {
        // Disconnect current transport if exists
        if (this.currentTransport) {
            this.currentTransport.disconnect();
        }
        // Update UI
        this.updateTransportUI(transportName);
        // Connect new transport
        this.currentTransport = this.transports[transportName];
        this.currentTransport.connect();
    }
    updateTransportUI(transportName) {
        // Update buttons
        document.querySelectorAll('.transport-button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(`${transportName}Button`)?.classList.add('active');
        // Update transport info
        const transport = this.transports[transportName];
        const currentTransportElement = document.getElementById('currentTransport');
        const transportFeaturesElement = document.getElementById('transportFeatures');
        if (currentTransportElement && transportFeaturesElement) {
            currentTransportElement.textContent = transport.getName();
            transportFeaturesElement.textContent = transport.getFeatures();
        }
    }
}
// Initialize transport manager when the page loads
window.addEventListener('load', () => {
    new TransportManager();
});
//# sourceMappingURL=transport-manager.js.map