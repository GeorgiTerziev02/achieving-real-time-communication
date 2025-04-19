import { Message } from "../message";
export interface ITransport {
    send(message: Message): void;
}
