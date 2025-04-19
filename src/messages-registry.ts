export class MessagesRegistry {
    private static instance: MessagesRegistry | null = null;
    private messages: string[] = [];

    private constructor() {  }

    public static getInstance(): MessagesRegistry {
        if (!MessagesRegistry.instance) {
            MessagesRegistry.instance = new MessagesRegistry();
        }
        return MessagesRegistry.instance;
    }

    public addMessage(message: string) {
        this.messages.push(message);
    }

    public getMessages() {
        return Array.from(this.messages);
    }
}
