import { EventHandler } from './itransport.js';

export class ShortPollingTransport {
    private intervalId!: number;

    private onReceiveHandler!: EventHandler;
    private onCloseHandler!: EventHandler;

    public connect() {
        this.intervalId = window.setInterval(() => {
            fetch("/api/realTime/shortPolling")
                .then(response => {
                    if (response.status === 204) {
                        throw new Error("No content");
                    }
                    return response;
                })
                .then(response => response.json())
                .then(data => {
                    this.onReceiveHandler(data);
                })
                .catch(console.error);
        }, 1000);

        return Promise.resolve();
    }

    public send(data: any) {
        		// event source is one directional
		// here can set a logic like sending normal http request to specific endpoint
		fetch("/api/realTime/shortPolling/event", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				eventName: "message",
				data: "Hello from client"
			})
		});
    }

    public stop() {
        clearInterval(this.intervalId);
    }

    public onreceive(handler: EventHandler) {
        this.onReceiveHandler = handler;
    }

    public onclose(handler: EventHandler) {
        // is there such moment of closing?
        // probably if are wainting for some specific answer from the server
        this.onCloseHandler = handler;
    }
} 