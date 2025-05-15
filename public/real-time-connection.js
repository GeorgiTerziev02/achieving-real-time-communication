// instance of this class should be created using builder pattern
export class RealTimeConnection {
    constructor(transport) {
        this.transport = transport;
        // also manages:
        // - retry mechanisms
        // - ping pong
        // 	 - keep alive connection
        // 	 - timeout interval
        // - operation logging
        // - protocol => json, binary, custom
        //    - kak da se obrabotvat dannite
        this.eventsToHandlers = new Map();
        this.intentionalClose = false;
        this.transport.onReceiveHandler = (eventMessage) => {
            if (this.eventsToHandlers.has(eventMessage.eventName)) {
                this.eventsToHandlers
                    .get(eventMessage.eventName)
                    .forEach((handler) => handler(eventMessage.data));
            }
        };
        // Cases here:
        // intentional close -> no need to do anything
        // unexpected close -> restart connection
        // -- there should be also some retry policy (callback) for when the next retry should be
        this.transport.onCloseHandler = () => {
            if (this.intentionalClose) {
                return;
            }
            setTimeout(() => {
                this.start();
            }, 5000);
        };
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
        if (!this.eventsToHandlers.has(eventName)) {
            return;
        }
        const eventsSet = this.eventsToHandlers.get(eventName);
        eventsSet.delete(handler);
        if (eventsSet.size === 0) {
            this.eventsToHandlers.delete(eventName);
        }
    }
    stop() {
        this.intentionalClose = true;
        this.transport.stop();
    }
}
//# sourceMappingURL=real-time-connection.js.map