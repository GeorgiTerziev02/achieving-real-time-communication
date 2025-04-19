export type EventMessage = { eventName: string; data: any };

export type EventHandler = (data: EventMessage) => void;

export interface ITransport {
	connect(): void;
	send(data: any): void;
	stop(): void;
	onreceive(handler: EventHandler): void;
	onclose(handler: EventHandler): void;
}
