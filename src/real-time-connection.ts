import { v4 as uuidv4 } from 'uuid';
import { ITransport } from './transport/itransport';
import { Message } from './message';

export class RealTimeConnection {
    // What is the special purpose of this id?
    // signalr for example ties it to user not to request or tcp connection
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


