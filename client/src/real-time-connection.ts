// @ts-check

import { ITransport, EventMessage } from "./transports/itransport";

export class RealTimeConnection {
	// also manages:
	// - retry mechanisms
	// - ping pong - keep alive connection
	// - operation logging
	// - protocol => json, binary, custom

	private eventsToHandlers = new Map();
	private intentionalClose = false;

	constructor(private transport: ITransport) {
		this.transport.onreceive((eventMessage: EventMessage) => {
			if (this.eventsToHandlers.has(eventMessage.eventName)) {
				this.eventsToHandlers
					.get(eventMessage.eventName)
					.forEach((handler: any) => handler(eventMessage.data));
			}
		});

		this.transport.onclose(() => {
			if (this.intentionalClose) {
				return;
			}

			setTimeout(() => {
				this.start();
			}, 5000);
		});
	}

	start() {
		return this.transport.connect();
	}

	send(eventName: string, data: any) {
		this.transport.send(eventName, data);
	}

	on(eventName: string, handler: any) {
		if (!this.eventsToHandlers.has(eventName)) {
			this.eventsToHandlers.set(eventName, new Set());
		}

		this.eventsToHandlers.get(eventName).add(handler);
	}

	off(eventName: string, handler: any) {
		if (this.eventsToHandlers.has(eventName)) {
			this.eventsToHandlers.get(eventName).delete(handler);
		}
	}

	stop() {
		this.intentionalClose = true;
		this.transport.stop();
	}
}
