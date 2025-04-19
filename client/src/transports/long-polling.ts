import { EventHandler, ITransport } from './itransport.js';

export class LongPollingTransport implements ITransport {
    private stopRequested = false;

    private onReceiveHandler!: EventHandler;
    private onCloseHandler!: EventHandler;

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
            .catch((err) => {
                // something unexpected happened
                // => retry mechanism
                setTimeout(() => {
                    this.connect();
                }, 5000);
            });

        return Promise.resolve();
    }

    public send(eventName: string, data: any) {
        // event source is one directional
		// here can set a logic like sending normal http request to specific endpoint
		fetch("/api/realTime/longPolling/event", {
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

    public onreceive(handler: EventHandler) {
        this.onReceiveHandler = handler;
    }

    public onclose(handler: EventHandler) {
        // is there such moment of closing?
        // probably if we predefine some answer from the server
        this.onCloseHandler = handler;
    }

} 