import { ITransport } from "./itransport";
import { Message } from "../message";
import { Request, Response } from "express";
export class SSETransport implements ITransport {
    constructor(private res: Response) { }

    public send(message: Message): void {
        this.res.write(`data: ${JSON.stringify(message)}\n\n`);
    }
}