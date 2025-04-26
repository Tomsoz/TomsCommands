import { getApplicationCommandOptionType } from "../utils/typing.js";
export default class SlashCommands {
    _client;
    constructor(client) {
        this._client = client;
    }
    async getCommands(guildId) {
        let commands;
        if (guildId) {
            const guild = await this._client.guilds.fetch(guildId);
            commands = guild.commands;
        }
        else {
            commands = await this._client.application?.commands;
        }
        await commands?.fetch({});
        return commands;
    }
    async create(name, description, options, guildId) {
        const commands = await this.getCommands(guildId);
        if (!commands) {
            throw new Error("Commands object is not set, aborting command creation!");
        }
        const existingCommand = commands.cache.find((command) => command.name === name);
        if (existingCommand) {
            // TODO: Update command
            console.log("Command already exists " + name);
            return;
        }
        const discordOptions = Object.entries(options).map(([key, value]) => {
            const optionType = getApplicationCommandOptionType(value.type);
            return {
                name: value.name ?? key,
                description: value.description,
                type: optionType,
                required: value.required ?? false
            };
        });
        await commands.create({ name, description, options: discordOptions });
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