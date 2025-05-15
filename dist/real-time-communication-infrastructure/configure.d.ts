import http from "http";
import { Application } from "express";
export type TransportType = "ws" | "sse" | "long-polling";
export declare function configureRealTimeCommunicationInfrastructure(transportTypes: TransportType[], app: Application, server: http.Server): void;
