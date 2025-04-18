import { Message } from '../common';
export declare class WebSocketTransport {
    private ws;
    private reconnectTimeout;
    connect(): void;
    disconnect(): void;
    sendMessage(message: Message): void;
    getName(): string;
    getFeatures(): string;
}
