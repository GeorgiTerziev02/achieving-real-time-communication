export type EventMessage = { eventName: string; data: any };

export type EventHandler = (data: any) => void;

export interface ITransport {
	connect(): Promise<void>;
	send(eventName: string, data: any): void;
	stop(): void;
    onReceiveHandler: EventHandler
	// in this case data is error
    onCloseHandler: EventHandler;
}
