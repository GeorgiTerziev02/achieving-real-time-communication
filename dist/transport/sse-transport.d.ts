import { ITransport } from "./itransport";
import { Message } from "../message";
import { Request, Response } from "express";
export declare class SSETransport implements ITransport {
    private req;
    private res;
    constructor(req: Request, res: Response);
    send(message: Message): void;
}
