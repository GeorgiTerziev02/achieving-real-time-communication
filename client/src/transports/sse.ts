import { EventHandler, ITransport } from './itransport.js';

export class SSETransport implements ITransport {
	private eventSource!: EventSource;
	public onReceiveHandler!: EventHandler;
	public onCloseHandler!: EventHandler;

	public connect(): Promise<void> {
		this.eventSource = new EventSource("/api/realTime/sse");

		this.eventSource.onmessage = (event) => {
			this.onReceiveHandler({ eventName: "message", data: event.data });
		}

		return new Promise<void>((resolve, reject) => {
			this.eventSource.onopen = (event) => {
				resolve();
			};

			this.eventSource.onmessage = (event) => {
				this.onReceiveHandler(JSON.parse(event.data));
			};
	
			this.eventSource.onerror = (event) => {
				console.error("EventSource failed:", event);
			};
		});
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
} 