"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesRegistry = void 0;
class MessagesRegistry {
    constructor() {
        this.messages = [];
    }
    static getInstance() {
        if (!MessagesRegistry.instance) {
            MessagesRegistry.instance = new MessagesRegistry();
        }
        return MessagesRegistry.instance;
    }
    addMessage(message) {
        this.messages.push(message);
    }
    getMessages() {
        return Array.from(this.messages);
    }
}
exports.MessagesRegistry = MessagesRegistry;
MessagesRegistry.instance = null;
//# sourceMappingURL=messages-registry.js.map