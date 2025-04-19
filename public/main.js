import { RealTimeConnection } from "./real-time-connection.js";
import { WebSocketTransport } from "./transports/websocket.js";
const transport = new WebSocketTransport();
const realTimeConnection = new RealTimeConnection(transport);
realTimeConnection.start();
//# sourceMappingURL=main.js.map