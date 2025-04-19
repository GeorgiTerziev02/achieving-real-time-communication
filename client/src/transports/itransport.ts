export type EventMessage = { eventName: string; data: any };

export type EventHandler = (data: any) => void;

export interface ITransport {
	connect(): void;
	send(eventName: string, data: any): void;
	stop(): void;
	onreceive(handler: EventHandler): void;
	onclose(handler: EventHandler): void;
}
