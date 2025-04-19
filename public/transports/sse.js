export class SSETransport {
    connect() {
        this.eventSource = new EventSource("/api/realTime/sse");
        this.eventSource.onmessage = (event) => {
            this.onReceiveHandler({ eventName: "message", data: event.data });
        };
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
    send(data) {
        // event source is one directional
        // here can set a logic like sending normal http request to specific endpoint
        fetch("/api/realTime/sse/event", {
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
        this.eventSource.close();
    }
    onreceive(handler) {
        this.onReceiveHandler = handler;
    }
    onclose(handler) {
        this.onCloseHandler = handler;
    }
}
//# sourceMappingURL=sse.js.map