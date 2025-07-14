import { InteractionContextType } from "discord.js";
import { getApplicationCommandOptionType } from "../utils/typing.js";
export default class SlashCommands {
    _client;
    _readyPromise;
    constructor(client) {
        this._client = client;
        this._readyPromise = new Promise((resolve) => {
            if (this._client.isReady()) {
                resolve();
            }
            else {
                this._client.once("ready", () => resolve());
            }
        });
    }
    async ensureReady() {
        await this._readyPromise;
    }
    async getCommands(guildId) {
        await this.ensureReady();
        let commands;
        if (guildId) {
            const guild = await this._client.guilds.fetch(guildId);
            await guild.commands.fetch();
            commands = guild.commands;
        }
        else {
            await this._client.application?.commands.fetch();
            commands = this._client.application?.commands;
        }
        return commands;
    }
    areOptionsDifferent(existingOptions, newOptions) {
        return (existingOptions.length !== newOptions.length ||
            existingOptions.some((option, index) => {
                const newOption = newOptions[index];
                const optionHasRequired = "required" in option;
                const newOptionHasRequired = "required" in newOption;
                let requiredIsDifferent = false;
                if (optionHasRequired && newOptionHasRequired) {
                    requiredIsDifferent =
                        option.required !==
                            newOption.required;
                }
                else if (optionHasRequired !== newOptionHasRequired) {
                    requiredIsDifferent = true;
                }
                return (option.name !== newOption.name ||
                    option.description !== newOption.description ||
                    option.type !== newOption.type ||
                    requiredIsDifferent);
            }));
    }
    async create(name, description, options, permissions = [], dmOnly, guildOnly, guildId) {
        const commands = await this.getCommands(guildId);
        if (!commands) {
            throw new Error("Commands object is not set, aborting command creation!");
        }
        const contexts = [];
        if (dmOnly)
            contexts.push(InteractionContextType.BotDM, InteractionContextType.PrivateChannel);
        else if (guildOnly)
            contexts.push(InteractionContextType.Guild);
        else
            contexts.push(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel);
        const discordOptions = Object.entries(options).map(([key, value]) => {
            const optionType = getApplicationCommandOptionType(value.type);
            return {
                name: key.replace(" ", "-"),
                description: value.description,
                type: optionType,
                required: value.required ?? false,
                choices: value.type === "string" || value.type == "number"
                    ? value.choices
                    : undefined
            };
        });
        const existingCommand = commands.cache.find((command) => command.name === name);
        if (existingCommand) {
            const { description: existingDescription, options: existingOptions } = existingCommand;
            if (existingDescription !== description ||
                this.areOptionsDifferent(existingOptions, discordOptions) ||
                contexts.some((context) => !existingCommand.contexts?.includes(context)) ||
                permissions.some((permission) => existingCommand.defaultMemberPermissions &&
                    !existingCommand.defaultMemberPermissions?.has(permission))) {
                await existingCommand.edit({
                    description,
                    options: discordOptions,
                    contexts
                });
                console.log(`Updated slash command ${name}`);
                return;
            }
            console.log(`Command ${name} already exists`);
            return;
        }
        await commands.create({
            name,
            description,
            options: discordOptions,
            contexts,
            defaultMemberPermissions: permissions
        });
        console.log(`Registered slash command ${name}`);
    }
    async delete(commandName, guildId) {
        const commands = await this.getCommands(guildId);
        if (!commands) {
            throw new Error("Commands object is not set, aborting command creation!");
        }
        const existingCommand = commands.cache.find((command) => command.name === commandName);
        if (!existingCommand) {
            return;
        }
        await existingCommand.delete();
    }
}
//# sourceMappingURL=SlashCommands.js.map