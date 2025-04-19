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
            .catch((err) => {
            // something unexpected happened
            // => retry mechanism
            setTimeout(() => {
                this.connect();
            }, 5000);
        });
        return Promise.resolve();
    }
    send(data) {
        // event source is one directional
        // here can set a logic like sending normal http request to specific endpoint
        fetch("/api/realTime/longPolling/event", {
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
    stop() {
        // not the best way
        // bettter play around with promise.race/promise.any
        this.stopRequested = true;
    }
    onreceive(handler) {
        this.onReceiveHandler = handler;
    }
    onclose(handler) {
        // is there such moment of closing?
        // probably if we predefine some answer from the server
        this.onCloseHandler = handler;
    }
}
//# sourceMappingURL=long-polling.js.map