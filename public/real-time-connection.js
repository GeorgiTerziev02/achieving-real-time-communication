// @ts-check
export class RealTimeConnection {
    constructor(transport) {
        this.transport = transport;
        // also manages:
        // - retry mechanisms
        // - ping pong - keep alive connection
        // - operation logging
        // - protocol => json, binary, custom
        this.eventsToHandlers = new Map();
        this.intentionalClose = false;
        this.transport.onreceive((eventMessage) => {
            if (this.eventsToHandlers.has(eventMessage.eventName)) {
                this.eventsToHandlers
                    .get(eventMessage.eventName)
                    .forEach((handler) => handler(eventMessage.data));
            }
        });
        this.transport.onclose(() => {
            if (this.intentionalClose) {
                return;
            }
            setTimeout(() => {
                this.start();
            }, 5000);
        });
    }
    start() {
        return this.transport.connect();
    }
    send(eventName, data) {
        this.transport.send(eventName, data);
    }
    on(eventName, handler) {
        if (!this.eventsToHandlers.has(eventName)) {
            this.eventsToHandlers.set(eventName, new Set());
        }
        this.eventsToHandlers.get(eventName).add(handler);
    }
    off(eventName, handler) {
        if (this.eventsToHandlers.has(eventName)) {
            this.eventsToHandlers.get(eventName).delete(handler);
        }
    }
    stop() {
        this.intentionalClose = true;
        this.transport.stop();
    }
}
//# sourceMappingURL=real-time-connection.js.map