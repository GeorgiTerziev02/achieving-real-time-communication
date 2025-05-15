"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRealTimeCommunicationInfrastructure = configureRealTimeCommunicationInfrastructure;
const ws_configuration_1 = require("./ws-configuration");
const sse_configuration_1 = require("./sse-configuration");
const longPolling_configuration_1 = require("./longPolling-configuration");
const transportsToConfigure = {
    ws: ws_configuration_1.configureWebSocket,
    sse: sse_configuration_1.configureSSE,
    "long-polling": longPolling_configuration_1.configureLongPolling,
};
function configureRealTimeCommunicationInfrastructure(transportTypes, app, server) {
    transportTypes.forEach((transportType) => {
        if (!transportsToConfigure[transportType]) {
            throw new Error(`Transport ${transportType} not supported`);
        }
        transportsToConfigure[transportType](app, server);
    });
}
//# sourceMappingURL=configure.js.map