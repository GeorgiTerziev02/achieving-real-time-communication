import { ITransport, EventMessage } from "./transports/itransport";

// instance of this class should be created using builder pattern
export class RealTimeConnection {
	// also should manage:
	// - handshake!
	// - retry mechanisms
	// - ping pong
	// 	 - keep alive connection
	// 	 - timeout interval
	// - operation logging
	// - protocol => json, binary, custom
	//    - kak da se obrabotvat dannite
	// - stateful reconnect
	//   - reconnect with the same connectionId

	private eventsToHandlers = new Map();
	private intentionalClose = false;

	constructor(private transport: ITransport) {
		this.transport.onReceiveHandler = (eventMessage: EventMessage) => {
			if (this.eventsToHandlers.has(eventMessage.eventName)) {
				this.eventsToHandlers
					.get(eventMessage.eventName)
					.forEach((handler: any) => handler(eventMessage.data));
			}
		};

		// Cases here:
		// intentional close -> no need to do anything
		// unexpected close -> restart connection
		// -- there should be also some retry policy (callback) for when the next retry should be
		this.transport.onCloseHandler = () => {
			if (this.intentionalClose) {
				return;
			}

			setTimeout(() => {
				this.start();
			}, 5000);
		};
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
		if (!this.eventsToHandlers.has(eventName)) {
			return;
		}

		const eventsSet = this.eventsToHandlers.get(eventName);
		eventsSet.delete(handler);
		if(eventsSet.size === 0) {
			this.eventsToHandlers.delete(eventName);
		}
	}

	stop() {
		this.intentionalClose = true;
		this.transport.stop();
	}
}
