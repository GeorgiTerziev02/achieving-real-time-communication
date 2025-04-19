import { v4 as uuidv4 } from 'uuid';

export class RealTimeConnection {
    private _id: string = uuidv4();

    public get id() {
        return this._id;
    }
}