import { Message } from "../message";

export interface ITransport {
    send(message: Message): void;

    // if I add here onReceive => Interface segregation goes brrrrrrrrrr
    // (some of the transport types don't have nothing in common with receiving their messages.
    // Most of the things are just implemented on server connection level)
    // onReceive(callback: (message: Message) => void): void;
}
