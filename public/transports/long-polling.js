export class LongPollingTransport {
    constructor() {
        this.stopRequested = false;
    }
    connect() {
        fetch("/api/realTime/longPolling")
            .then((res) => {
            if (this.stopRequested) {
                return;
            }
            // connection timeout
            if (res.status === 502) {
                this.connect();
                return;
            }
            if (res.status === 200) {
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
    send(eventName, data) {
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
    stop() {
        // not the best way
        // bettter play around with promise.race/promise.any
        this.stopRequested = true;
    }
}
//# sourceMappingURL=long-polling.js.map