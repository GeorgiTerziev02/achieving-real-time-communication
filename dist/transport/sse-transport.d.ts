import { ITransport } from "./itransport";
import { Message } from "../message";
export declare class SseTransport implements ITransport {
    send(message: Message): void;
}
