import { EventHandler } from './itransport.js';

export class SSETransport {
	private eventSource!: EventSource;
	private onReceiveHandler!: EventHandler;
	private onCloseHandler!: EventHandler;

	public connect() {
		this.eventSource = new EventSource("/api/realTime/sse");

		this.eventSource.onmessage = (event) => {
			this.onReceiveHandler({ eventName: "message", data: event.data });
		}

		const promise = new Promise((resolve, reject) => {
			this.eventSource.onopen = (event) => {
				resolve(event);
			};

			this.eventSource.onmessage = (event) => {
				this.onReceiveHandler(JSON.parse(event.data));
			};
	
			this.eventSource.onerror = (event) => {
				console.error("EventSource failed:", event);
			};
		});
		
		return promise;
	}

	public send(eventName: string, data: any) {
		// event source is one directional
		// here can set a logic like sending normal http request to specific endpoint
		fetch("/api/realTime/sse/event", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				eventName: eventName,
				data: data
			})
		});
	}

	public stop() {
		this.eventSource.close();
	}

	public onreceive(handler: EventHandler) {
		this.onReceiveHandler = handler;
	}

	public onclose(handler: EventHandler) {
		this.onCloseHandler = handler;
	}
} 