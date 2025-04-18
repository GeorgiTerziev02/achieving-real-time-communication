import { Message } from '../common';
export declare class SSETransport {
    private eventSource;
    private reconnectTimeout;
    connect(): void;
    disconnect(): void;
    sendMessage(message: Message): void;
    getName(): string;
    getFeatures(): string;
}
