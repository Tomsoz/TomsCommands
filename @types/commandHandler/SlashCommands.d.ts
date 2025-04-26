import { Client } from "discord.js";
import { Options } from "../types/options.js";
export default class SlashCommands {
    private _client;
    constructor(client: Client);
    getCommands(guildId?: string): Promise<import("discord.js").GuildApplicationCommandManager | import("discord.js").ApplicationCommandManager<import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }>, {
        guild: import("discord.js").GuildResolvable;
    }, null> | undefined>;
    create(name: string, description: string, options: Options, guildId?: string): Promise<void>;
    delete(commandName: string, guildId?: string): Promise<void>;
}
//# sourceMappingURL=SlashCommands.d.ts.map