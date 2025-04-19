import { ITransport } from './transport/itransport';
import { Message } from './message';
export declare class RealTimeConnection {
    private transport;
    private _id;
    get id(): string;
    constructor(transport: ITransport);
    sendMessage(message: Message): void;
}
export declare class RealTimeConnectionFactory {
    static createConnection(transport: ITransport): RealTimeConnection;
}
