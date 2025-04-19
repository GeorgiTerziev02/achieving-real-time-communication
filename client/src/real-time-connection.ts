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
		this.transport.onreceive((data: EventMessage) => {
			if (this.eventsToHandlers.has(data.eventName)) {
				this.eventsToHandlers
					.get(data.eventName)
					.forEach((handler: any) => handler(data));
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

	send(data: any) {
		this.transport.send(data);
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
