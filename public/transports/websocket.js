function getWsUrl() {
    const domain = window.location.hostname;
    return domain === "localhost" ? `ws://${domain}:3000` : `wss://${domain}`;
}
export class WebSocketTransport {
    connect() {
        this.socket = new WebSocket(getWsUrl());
        return new Promise((resolve, reject) => {
            this.socket.addEventListener("open", (_) => {
                resolve();
            });
            this.socket.addEventListener("message", (_) => {
                this.onReceiveHandler(JSON.parse(_.data));
            });
            this.socket.addEventListener("error", (_) => {
                this.onCloseHandler({ eventName: "error", data: _ });
                reject(_);
            });
        });
    }
    send(eventName, data) {
        this.socket.send(JSON.stringify({ eventName, data }));
    }
    stop() {
        this.socket.close();
    }
}
//# sourceMappingURL=websocket.js.map