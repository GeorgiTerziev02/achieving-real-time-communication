"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRealTimeCommunicationInfrastructure = configureRealTimeCommunicationInfrastructure;
const ws_configuration_1 = require("./ws-configuration");
const sse_configuration_1 = require("./sse-configuration");
const transportsToConfigure = {
    ws: ws_configuration_1.configureWebSocket,
    sse: sse_configuration_1.configureSSE,
    // TODO: Implement Long Polling
    "long-polling": () => { },
    // TODO: Implement Short Polling
    "short-polling": () => { }
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