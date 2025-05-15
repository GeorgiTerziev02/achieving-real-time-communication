import { EventHandler, ITransport } from './itransport.js';

export class ShortPollingTransport implements ITransport {
    private intervalId!: number;

    public onReceiveHandler!: EventHandler;
    // is there such moment of closing?
    // probably if are wainting for some specific answer from the server
    // or the first error is asumed as closing
    public onCloseHandler!: EventHandler;

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
                // what should happen on error? disconnect?
                .catch(console.error);
        }, 1000);

        return Promise.resolve();
    }

    public send(eventName: string, data: any) {
        // event source is one directional
		// here can set a logic like sending normal http request to specific endpoint
		fetch("/api/realTime/shortPolling/event", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ eventName, data })
		});
    }

    public stop() {
        clearInterval(this.intervalId);
    }
} 