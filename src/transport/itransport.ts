import { Message } from "../message";

export interface ITransport {
    // connect(): void;
    // reconnect(): void;
    // close(): void;
    send(message: Message): void;
    // on(event: string, callback: (message: string) => void): void;
}
