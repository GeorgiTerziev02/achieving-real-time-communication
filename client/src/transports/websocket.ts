import { EventHandler } from './itransport.js';

function getWsUrl() {
	const domain = window.location.hostname;
	return domain === "localhost" ? `ws://${domain}:3000` : `wss://${domain}`;
}
export class WebSocketTransport {
    private socket!: WebSocket;
    private onReceiveHandler!: EventHandler;
    private onCloseHandler!: EventHandler;

    public connect() {
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
            })
        });

        return promise;
    }

    public send(eventName: string, data: any) {
        this.socket.send(JSON.stringify({ eventName, data }));
    }

    public stop() {
        this.socket.close();
    }

    public onreceive(handler: EventHandler) {
        this.onReceiveHandler = handler;
    }

    public onclose(handler: EventHandler) {
        this.onCloseHandler = handler;
    }
} 