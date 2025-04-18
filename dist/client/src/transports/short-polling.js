"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortPollingTransport = void 0;
const common_1 = require("../common");
class ShortPollingTransport {
    constructor() {
        this.isPolling = false;
        this.lastMessageTimestamp = new Date().toISOString();
        this.pollInterval = null;
        this.POLL_INTERVAL = 1000; // 1 second
    }
    connect() {
        (0, common_1.updateStatus)('connecting', 'Connecting via Short Polling...');
        this.isPolling = true;
        this.startPolling();
        (0, common_1.addMessage)({
            type: 'system',
            content: 'Short polling started',
            timestamp: new Date().toISOString()
        }, 'system');
    }
    disconnect() {
        this.isPolling = false;
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        (0, common_1.updateStatus)('disconnected', 'Disconnected from Short Polling');
        (0, common_1.addMessage)({
            type: 'system',
            content: 'Short polling stopped',
            timestamp: new Date().toISOString()
        }, 'system');
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
            (0, common_1.addMessage)(message, 'sent');
        })
            .catch(error => {
            (0, common_1.updateStatus)('disconnected', 'Failed to send message');
            (0, common_1.addMessage)({
                type: 'system',
                content: `Failed to send message: ${error.message}`,
                timestamp: new Date().toISOString()
            }, 'system');
        });
    }
    startPolling() {
        if (!this.isPolling)
            return;
        this.pollInterval = window.setInterval(() => {
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
                        (0, common_1.addMessage)(message, message.type === 'system' ? 'system' : 'received');
                        this.lastMessageTimestamp = message.timestamp;
                    });
                }
                (0, common_1.updateStatus)('connected', 'Connected via Short Polling');
            })
                .catch(error => {
                (0, common_1.updateStatus)('disconnected', 'Polling error occurred');
                (0, common_1.addMessage)({
                    type: 'system',
                    content: `Polling error: ${error.message}`,
                    timestamp: new Date().toISOString()
                }, 'system');
            });
        }, this.POLL_INTERVAL);
    }
    getName() {
        return 'Short Polling';
    }
    getFeatures() {
        return 'HTTP-based, frequent requests, simple implementation';
    }
}
exports.ShortPollingTransport = ShortPollingTransport;
//# sourceMappingURL=short-polling.js.map