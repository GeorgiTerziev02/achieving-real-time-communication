import { ITransport } from "./itransport";
import { Message } from "../message";
import { Response } from "express";
export declare class SSETransport implements ITransport {
    private res;
    constructor(res: Response);
    send(message: Message): void;
}
