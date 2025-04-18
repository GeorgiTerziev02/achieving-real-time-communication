export interface Message {
    type: string;
    content: string;
    timestamp: string;
}
export declare function addMessage(message: Message, type?: 'received' | 'sent' | 'system'): void;
export declare function sendMessage(): void;
export declare function updateStatus(status: 'connected' | 'disconnected' | 'connecting', message: string): void;
