import { v4 as uuidv4 } from 'uuid';
import { ITransport } from './transport/itransport';
import { Message } from './message';

export class RealTimeConnection {
    private _id: string = uuidv4();

    public get id() {
        return this._id;
    }

    constructor(private transport: ITransport) { }

    public sendMessage(message: Message) {
        this.transport.send(message);
    }
}

export class RealTimeConnectionFactory {
    public static createConnection(transport: ITransport) {
        return new RealTimeConnection(transport);
    }
}


