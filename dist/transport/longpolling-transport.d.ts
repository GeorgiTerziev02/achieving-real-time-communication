import { ITransport } from "./itransport";
import { Message } from "../message";
export declare class LongPollingTransport implements ITransport {
    send(message: Message): void;
}
