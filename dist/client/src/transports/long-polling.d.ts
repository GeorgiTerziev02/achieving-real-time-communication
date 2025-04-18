import { Message } from '../common';
export declare class LongPollingTransport {
    private isPolling;
    private lastMessageTimestamp;
    private pollTimeout;
    connect(): void;
    disconnect(): void;
    sendMessage(message: Message): void;
    private startPolling;
    getName(): string;
    getFeatures(): string;
}
