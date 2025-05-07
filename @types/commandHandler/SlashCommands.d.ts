import { ApplicationCommandOption, ApplicationCommandOptionData, Client } from "discord.js";
import { Permission } from "../types/command.js";
import { Options } from "../types/options.js";
export default class SlashCommands {
    private _client;
    private _readyPromise;
    constructor(client: Client);
    private ensureReady;
    getCommands(guildId?: string): Promise<import("discord.js").GuildApplicationCommandManager | import("discord.js").ApplicationCommandManager<import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }>, {
        guild: import("discord.js").GuildResolvable;
    }, null> | undefined>;
    areOptionsDifferent(existingOptions: (ApplicationCommandOption & {
        nameLocalized?: string;
        descriptionLocalized?: string;
    })[], newOptions: ApplicationCommandOptionData[]): boolean;
    create(name: string, description: string, options: Options, permissions?: Permission[], dmOnly?: boolean, guildOnly?: boolean, guildId?: string): Promise<void>;
    delete(commandName: string, guildId?: string): Promise<void>;
}
//# sourceMappingURL=SlashCommands.d.ts.map