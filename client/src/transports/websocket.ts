import { EventHandler, ITransport } from './itransport.js';

function getWsUrl() {
	const domain = window.location.hostname;
	return domain === "localhost" ? `ws://${domain}:3000` : `wss://${domain}`;
}
export class WebSocketTransport implements ITransport {
    private socket!: WebSocket;
    public onReceiveHandler!: EventHandler;
    public onCloseHandler!: EventHandler;

    public connect(): Promise<void> {
        this.socket = new WebSocket(getWsUrl());

        return new Promise<void>((resolve, reject) => {
            this.socket.addEventListener("open", (_) => {
                resolve();
            });

            this.socket.addEventListener("message", (_) => {
                this.onReceiveHandler(JSON.parse(_.data));
            });

            this.socket.addEventListener("error", (_) => {
                this.onCloseHandler({ eventName: "error", data: _ });
                reject(_);
            })
        });
    }

    public send(eventName: string, data: any) {
        this.socket.send(JSON.stringify({ eventName, data }));
    }

    public stop() {
        this.socket.close();
    }
} 