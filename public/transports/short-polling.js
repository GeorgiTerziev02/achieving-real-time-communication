export class ShortPollingTransport {
    connect() {
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
    send(eventName, data) {
        // event source is one directional
        // here can set a logic like sending normal http request to specific endpoint
        fetch("/api/realTime/shortPolling/event", {
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
        clearInterval(this.intervalId);
    }
    onreceive(handler) {
        this.onReceiveHandler = handler;
    }
    onclose(handler) {
        // is there such moment of closing?
        // probably if are wainting for some specific answer from the server
        this.onCloseHandler = handler;
    }
}
//# sourceMappingURL=short-polling.js.map