import { Client } from "discord.js";
import { EventHandlerOptions, Handlers } from "../index.js";
export declare class EventHandler {
    private _eventCallbacks;
    private _instance;
    private _eventsDir;
    private _client;
    private _events;
    private _builtInEvents;
    constructor({ instance, events, client }: {
        instance: Handlers;
        events: EventHandlerOptions;
        client: Client;
    });
    readFiles(register?: boolean): Promise<void>;
    registerEvents(): void;
}
//# sourceMappingURL=EventHandler.d.ts.map