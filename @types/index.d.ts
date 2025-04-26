import { Client } from "discord.js";
export declare class Handlers {
    private _devGuilds;
    constructor({ client, commandsDir, databaseUrl, devGuilds }: {
        client: Client<boolean>;
        commandsDir?: string;
        databaseUrl?: string;
        devGuilds?: string[];
    });
    get devGuilds(): string[];
    connectToDatabase(databaseUrl: string): void;
}
export * from "./builders.js";
export { createEnv } from "./env.js";
export type * from "./types/command.js";
export type * from "./types/options.js";
export type * from "./types/validations.js";
//# sourceMappingURL=index.d.ts.map