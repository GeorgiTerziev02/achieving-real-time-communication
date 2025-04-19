import { RealTimeConnection } from "./real-time-connection.js";
import { LongPollingTransport } from "./transports/long-polling.js";
import { ShortPollingTransport } from "./transports/short-polling.js";
import { SSETransport } from "./transports/sse.js";
import { WebSocketTransport } from "./transports/websocket.js";

var transport = new WebSocketTransport();
var realTimeConnection = new RealTimeConnection(transport);

realTimeConnection.start();

const supportedTransports = [
    {
        buttonId: "wsButton",
        transportFactory: () => new WebSocketTransport()
    },
    {
        buttonId: "sseButton",
        transportFactory: () => new SSETransport()
    },
    {
        buttonId: "longPollButton",
        transportFactory: () => new LongPollingTransport()
    },
    {
        buttonId: "shortPollButton",
        transportFactory: () => new ShortPollingTransport()
    }
];

supportedTransports.forEach(({ buttonId, transportFactory }) => {
	const button = document.getElementById(buttonId);
	button!.addEventListener("click", () => {
		realTimeConnection.stop();
        const transport = transportFactory();
        realTimeConnection = new RealTimeConnection(transport);
        realTimeConnection.start();
	});
});

