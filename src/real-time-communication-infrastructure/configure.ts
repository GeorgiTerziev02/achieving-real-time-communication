import { configureWebSocket } from "./ws-configuration";
import { configureSSE } from "./sse-configuration";
import http from "http";
import { Application } from "express";

export type TransportType = "ws" | "sse" | "long-polling" | "short-polling";

const transportsToConfigure = {
    ws: configureWebSocket,
    sse: configureSSE,
    // TODO: Implement Long Polling
    "long-polling": () => {},
    // TODO: Implement Short Polling
    "short-polling": () => {}
};

export function configureRealTimeCommunicationInfrastructure(transportTypes: TransportType[], app: Application, server: http.Server) {
    transportTypes.forEach((transportType: TransportType) => {
        if (!transportsToConfigure[transportType]) {
            throw new Error(`Transport ${transportType} not supported`);
        }
        transportsToConfigure[transportType](app, server);
    });
}
