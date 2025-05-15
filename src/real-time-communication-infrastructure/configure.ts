import { configureWebSocket } from "./ws-configuration";
import { configureSSE } from "./sse-configuration";
import http from "http";
import { Application } from "express";
import { configureLongPolling } from "./longPolling-configuration";

export type TransportType = "ws" | "sse" | "long-polling";

const transportsToConfigure = {
    ws: configureWebSocket,
    sse: configureSSE,
    "long-polling": configureLongPolling,
};

export function configureRealTimeCommunicationInfrastructure(transportTypes: TransportType[], app: Application, server: http.Server) {
    transportTypes.forEach((transportType: TransportType) => {
        if (!transportsToConfigure[transportType]) {
            throw new Error(`Transport ${transportType} not supported`);
        }
        transportsToConfigure[transportType](app, server);
    });
}
