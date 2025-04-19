function getWsUrl() {
    const domain = window.location.hostname;
    return domain === "localhost" ? `ws://${domain}:3000` : `wss://${domain}`;
}
export class WebSocketTransport {
    connect() {
        this.socket = new WebSocket(getWsUrl());
        const promise = new Promise((resolve, reject) => {
            this.socket.addEventListener("open", (_) => {
                resolve(_);
            });
            this.socket.addEventListener("message", (_) => {
                this.onReceiveHandler(JSON.parse(_.data));
            });
            this.socket.addEventListener("error", (_) => {
                this.onCloseHandler({ eventName: "error", data: _ });
                reject(_);
            });
        });
        return promise;
    }
    send(eventName, data) {
        this.socket.send(JSON.stringify({ eventName, data }));
    }
    stop() {
        this.socket.close();
    }
    onreceive(handler) {
        this.onReceiveHandler = handler;
    }
    onclose(handler) {
        this.onCloseHandler = handler;
    }
}
//# sourceMappingURL=websocket.js.map