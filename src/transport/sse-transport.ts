import { ITransport } from "./itransport";
import { Message } from "../message";

export class SseTransport implements ITransport {

    public send(message: Message): void {
        throw new Error("Method not implemented.");
    }

}