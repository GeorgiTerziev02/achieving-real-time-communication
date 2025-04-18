import { Message, addMessage, updateStatus } from '../common.js';

export class SSETransport {
    private eventSource: EventSource | null = null;
    private reconnectTimeout: number | null = null;

    public connect(): void {
        updateStatus('connecting', 'Connecting via Server-Sent Events...');
        
        const sseUrl = `${window.location.protocol}//${window.location.host}/sse`;
        this.eventSource = new EventSource(sseUrl);
        
        this.eventSource.onopen = () => {
            updateStatus('connected', 'SSE connection established');
            addMessage({
                type: 'system',
                content: 'SSE connection established',
                timestamp: new Date().toISOString()
            });
        };
        
        this.eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data) as Message;
            addMessage(message);
        };
        
        this.eventSource.onerror = () => {
            //updateStatus('error', 'SSE connection error');
            addMessage({
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

    public disconnect(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
            
            updateStatus('disconnected', 'SSE connection closed');
            addMessage({
                type: 'system',
                content: 'SSE connection closed',
                timestamp: new Date().toISOString()
            });
        }
    }

    public sendMessage(message: Message): void {
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
            addMessage(message);
        })
        .catch(error => {
            //updateStatus('error');
            addMessage({
                type: 'system',
                content: `Failed to send message: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        });
    }

    public getName(): string {
        return 'Server-Sent Events';
    }

    public getFeatures(): string {
        return 'One-way server-to-client streaming, automatic reconnection, HTTP-based';
    }
} 