import { Message, addMessage, updateStatus } from '../common.js';

export class LongPollingTransport {
    private isPolling: boolean = false;
    private lastMessageTimestamp: string = new Date().toISOString();
    private pollTimeout: number | null = null;

    public connect(): void {
        updateStatus('connecting', 'Connecting via Long Polling...');
        this.isPolling = true;
        this.startPolling();
        
        addMessage({
            type: 'system',
            content: 'Long polling started',
            timestamp: new Date().toISOString()
        });
    }

    public disconnect(): void {
        this.isPolling = false;
        if (this.pollTimeout) {
            clearTimeout(this.pollTimeout);
            this.pollTimeout = null;
        }
        
        updateStatus('disconnected', 'Long polling stopped');
        addMessage({
            type: 'system',
            content: 'Long polling stopped',
            timestamp: new Date().toISOString()
        });
    }

    public sendMessage(message: Message): void {
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
            addMessage(message);
        })
        .catch(error => {
            //updateStatus('d', `Failed to send message: ${error.message}`);
            addMessage({
                type: 'system',
                content: `Failed to send message: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        });
    }

    private startPolling(): void {
        if (!this.isPolling) return;

        fetch(`/api/messages?since=${this.lastMessageTimestamp}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }
                return response.json();
            })
            .then((messages: Message[]) => {
                if (messages.length > 0) {
                    messages.forEach(message => {
                        addMessage(message);
                        this.lastMessageTimestamp = message.timestamp;
                    });
                }
                updateStatus('connected', 'Long polling connected');
            })
            .catch(error => {
                //updateStatus('error');
                addMessage({
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

    public getName(): string {
        return 'Long Polling';
    }

    public getFeatures(): string {
        return 'HTTP-based, server holds request until new data, efficient for infrequent updates';
    }
} 