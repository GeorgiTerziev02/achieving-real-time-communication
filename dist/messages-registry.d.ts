export declare class MessagesRegistry {
    private static instance;
    private messages;
    private constructor();
    static getInstance(): MessagesRegistry;
    addMessage(message: string): void;
    getMessages(): string[];
}
