import { Client, ClientEvents } from "discord.js";
import CommandHandler from "./commandHandler/CommandHandler.js";
import { EventHandler } from "./eventHandler/EventHandler.js";
export type EventHandlerOptions = {
    dir?: string;
} & {
    [K in keyof ClientEvents]?: {
        [key: string]: (...args: any[]) => Promise<boolean>;
    };
};
export declare class Handlers {
    private _devGuilds;
    private _prefix;
    private _commandHandler;
    private _eventHandler;
    constructor({ client, commandsDir, prefix, devGuilds, events }: {
        client: Client<boolean>;
        commandsDir?: string;
        prefix?: string;
        devGuilds?: string[];
        events?: EventHandlerOptions;
    });
    get prefix(): string | undefined;
    get devGuilds(): string[];
    get commandHandler(): CommandHandler | undefined;
    get eventHandler(): EventHandler | undefined;
}
export * from "./builders.js";
export type * from "./types/command.js";
export type * from "./types/options.js";
export type * from "./types/validations.js";
//# sourceMappingURL=index.d.ts.map