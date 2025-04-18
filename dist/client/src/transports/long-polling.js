"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongPollingTransport = void 0;
const common_1 = require("../common");
class LongPollingTransport {
    constructor() {
        this.isPolling = false;
        this.lastMessageTimestamp = new Date().toISOString();
        this.pollTimeout = null;
    }
    connect() {
        (0, common_1.updateStatus)('connecting', 'Connecting via Long Polling...');
        this.isPolling = true;
        this.startPolling();
        (0, common_1.addMessage)({
            type: 'system',
            content: 'Long polling started',
            timestamp: new Date().toISOString()
        });
    }
    disconnect() {
        this.isPolling = false;
        if (this.pollTimeout) {
            clearTimeout(this.pollTimeout);
            this.pollTimeout = null;
        }
        (0, common_1.updateStatus)('disconnected', 'Long polling stopped');
        (0, common_1.addMessage)({
            type: 'system',
            content: 'Long polling stopped',
            timestamp: new Date().toISOString()
        });
    }
    sendMessage(message) {
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
            //updateStatus('d', `Failed to send message: ${error.message}`);
            (0, common_1.addMessage)({
                type: 'system',
                content: `Failed to send message: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        });
    }
    startPolling() {
        if (!this.isPolling)
            return;
        fetch(`/api/messages?since=${this.lastMessageTimestamp}`)
            .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            return response.json();
        })
            .then((messages) => {
            if (messages.length > 0) {
                messages.forEach(message => {
                    (0, common_1.addMessage)(message);
                    this.lastMessageTimestamp = message.timestamp;
                });
            }
            (0, common_1.updateStatus)('connected', 'Long polling connected');
        })
            .catch(error => {
            //updateStatus('error');
            (0, common_1.addMessage)({
                type: 'system',
                content: `Polling error: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        })
            .finally(() => {
            // Schedule next poll
            this.pollTimeout = window.setTimeout(() => this.startPolling(), 5000);
        });
    }
    getName() {
        return 'Long Polling';
    }
    getFeatures() {
        return 'HTTP-based, server holds request until new data, efficient for infrequent updates';
    }
}
exports.LongPollingTransport = LongPollingTransport;
//# sourceMappingURL=long-polling.js.map