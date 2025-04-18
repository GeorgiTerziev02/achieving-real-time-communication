import { Message, addMessage, updateStatus } from './common.js';
import { WebSocketTransport } from './transports/websocket.js';
import { SSETransport } from './transports/sse.js';
import { LongPollingTransport } from './transports/long-polling.js';
import { ShortPollingTransport } from './transports/short-polling.js';

// Transport interface
interface Transport {
    connect(): void;
    disconnect(): void;
    sendMessage(message: Message): void;
    getName(): string;
    getFeatures(): string;
}

// Transport manager class
class TransportManager {
    private currentTransport: Transport | null = null;
    private transports: { [key: string]: Transport } = {
        websocket: new WebSocketTransport(),
        sse: new SSETransport(),
        longPolling: new LongPollingTransport(),
        shortPolling: new ShortPollingTransport()
    };

    constructor() {
        this.initializeButtons();
        this.switchTransport('websocket'); // Start with WebSocket
    }

    private initializeButtons(): void {
        const buttons = {
            wsButton: 'websocket',
            sseButton: 'sse',
            longPollButton: 'longPolling',
            shortPollButton: 'shortPolling'
        };

        Object.entries(buttons).forEach(([buttonId, transportName]) => {
            const button = document.getElementById(buttonId) as HTMLButtonElement;
            button.addEventListener('click', () => this.switchTransport(transportName));
        });
    }

    private switchTransport(transportName: string): void {
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

    private updateTransportUI(transportName: string): void {
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