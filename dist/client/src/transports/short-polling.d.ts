import { Message } from '../common';
export declare class ShortPollingTransport {
    private isPolling;
    private lastMessageTimestamp;
    private pollInterval;
    private readonly POLL_INTERVAL;
    connect(): void;
    disconnect(): void;
    sendMessage(message: Message): void;
    private startPolling;
    getName(): string;
    getFeatures(): string;
}
