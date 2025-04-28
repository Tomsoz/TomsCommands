import { Client } from "discord.js";
export declare class Handlers {
    private _devGuilds;
    private _prefix;
    constructor({ client, commandsDir, databaseUrl, prefix, devGuilds }: {
        client: Client<boolean>;
        commandsDir?: string;
        databaseUrl?: string;
        prefix?: string;
        devGuilds?: string[];
    });
    get prefix(): string | undefined;
    get devGuilds(): string[];
    connectToDatabase(databaseUrl: string): void;
}
export * from "./builders.js";
export type * from "./types/command.js";
export type * from "./types/options.js";
export type * from "./types/validations.js";
//# sourceMappingURL=index.d.ts.map