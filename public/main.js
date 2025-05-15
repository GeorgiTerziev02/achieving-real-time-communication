import { RealTimeConnection } from "./real-time-connection.js";
import { LongPollingTransport } from "./transports/long-polling.js";
import { ShortPollingTransport } from "./transports/short-polling.js";
import { SSETransport } from "./transports/sse.js";
import { WebSocketTransport } from "./transports/websocket.js";
var realTimeConnection = new RealTimeConnection(new WebSocketTransport());
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
function registerEvents() {
    realTimeConnection.on("chatMessage", (message) => {
        const chatMessages = document.getElementById('messageArea');
        chatMessages.innerHTML += `<div>${message}</div>`;
    });
}
let currentButtonId = 'wsButton';
supportedTransports.forEach(({ buttonId, transportFactory }) => {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", () => {
        document.getElementById(currentButtonId).classList.remove("active");
        button.classList.add("active");
        document.getElementById("currentTransport").innerHTML = `${buttonId}`;
        currentButtonId = buttonId;
        realTimeConnection.stop();
        const transport = transportFactory();
        realTimeConnection = new RealTimeConnection(transport);
        realTimeConnection.start();
        registerEvents();
    });
});
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
sendButton.addEventListener("click", () => {
    realTimeConnection.send("chatMessage", messageInput.value);
    messageInput.value = "";
});
registerEvents();
//# sourceMappingURL=main.js.map