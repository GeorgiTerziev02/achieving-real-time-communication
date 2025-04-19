import { ITransport } from "./itransport";
import { Message } from "../message";
export declare class ShortPollingTransport implements ITransport {
    send(message: Message): void;
}
