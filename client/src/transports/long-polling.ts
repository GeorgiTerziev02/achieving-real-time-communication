import { EventHandler, ITransport } from './itransport.js';

export class LongPollingTransport implements ITransport {
    private stopRequested = false;

    public onReceiveHandler!: EventHandler;
    public onCloseHandler!: EventHandler;

    public connect() {
        fetch("/api/realTime/longPolling")
            .then((res) => {
                if(this.stopRequested) {
                    return;
                }
                // connection timeout
                if(res.status === 502) {
                    this.connect();
                    return;
                }

                if(res.status === 200) {
                    res.json().then((data) => {
                        this.onReceiveHandler(data);
                    });
                    this.connect();
                    return;
                }

                // something unexpected happened
                // => retry mechanism
                setTimeout(() => {
                    this.connect();
                }, 5000);
            })
            // what should happen on error? disconnect?
            .catch(console.error);

        return Promise.resolve();
    }

    public send(eventName: string, data: any) {
        // event source is one directional
		// here can set a logic like sending normal http request to specific endpoint
		fetch("/api/realTime/longPolling", {
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
        // not the best way
        // bettter play around with promise.race/promise.any
        this.stopRequested = true;
    }
} 