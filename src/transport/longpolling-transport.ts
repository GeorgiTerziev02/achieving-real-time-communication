import { ITransport } from "./itransport";
import { Message } from "../message";
import { Response } from "express";

export class LongPollingTransport implements ITransport {
    constructor(private res: Response) { }

    public send(message: Message): void {
        this.res.json(message);
    }
}
