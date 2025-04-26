import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createDir, dirExists, getAllFiles } from "../utils/filesystem.js";
import { parseArgument } from "../utils/parseArgument.js";
import { CommandObject } from "./Command.js";
import SlashCommands from "./SlashCommands.js";
class CommandHandler {
    _instance;
    _commandsDir;
    _slashCommands;
    _commands = new Map();
    _validations = this.getValidations("runtime");
    _prefix = "!";
    constructor({ instance, commandsDir, client }) {
        this._instance = instance;
        this._commandsDir = commandsDir;
        this._slashCommands = new SlashCommands(client);
        this.readFiles();
        this.messageListener(client);
        this.interactionListener(client);
    }
    async readFiles() {
        if (!dirExists(this._commandsDir)) {
            createDir(this._commandsDir);
        }
        const files = getAllFiles(this._commandsDir);
        const validations = this.getValidations("syntax");
        for (const file of files) {
            const fileUrl = pathToFileURL(file).href;
            const commandObj = await import(fileUrl);
            const command = commandObj.default;
            const commandName = command.name ?? file.split(/[/\\]/).pop()?.split(".")[0];
            if (!commandName) {
                throw new Error(`Command name not found in file name ${file}`);
            }
            // const validatedCommand = validateCommand(command);
            // if (!validatedCommand) {
            // 	throw new Error(`Command ${commandName} is not valid`);
            // }
            const commandObject = new CommandObject(this._instance, commandName, command);
            const { devOnly } = command;
            if (command.type !== "text" && command.delete) {
                if (devOnly) {
                    for (const guildId of this._instance.devGuilds) {
                        await this._slashCommands.delete(commandName, guildId);
                    }
                }
                else {
                    await this._slashCommands.delete(commandName);
                }
                continue;
            }
            for (const validation of await validations) {
                if (validation.type === "all" ||
                    validation.type === command.type) {
                    await validation.callback(commandObject.commandObject, this._instance);
                }
            }
            if (command.type === "text" || command.type === "hybrid") {
                this._commands.set(commandObject.commandName, commandObject);
            }
            if (command.type === "slash" || command.type === "hybrid") {
                const options = command.options ?? {};
                if (devOnly) {
                    for (const guild of this._instance.devGuilds) {
                        await this._slashCommands.create(command.name ?? commandObject.commandName, command.description, options, guild);
                    }
                }
                else {
                    await this._slashCommands.create(command.name ?? commandObject.commandName, command.description, options);
                }
            }
        }
    }
    async runCommand(commandName, args, message, interaction) {
        if (!message && !interaction) {
            throw new Error("Either 'message' or 'interaction' must be provided.");
        }
        const command = this._commands.get(commandName.toLowerCase());
        if (!command)
            return;
        if (message && command.commandObject.type === "slash")
            return;
        const commandType = command.commandObject.type;
        const options = command.commandObject.options ?? {};
        const typedOptions = options;
        let i = 0;
        const newOptions = Object.fromEntries(Object.entries(typedOptions).map(([key, value]) => {
            if (i >= args.length) {
                if (value.required) {
                    throw new Error(`Missing required option: ${key}`);
                }
                value.value = value.default;
            }
            else {
                value.value = parseArgument(args[i], value.type);
            }
            i++;
            return [key, value];
        }));
        const callbackArgs = {
            guild: message?.guild ?? interaction?.guild ?? null,
            args: newOptions,
            command: command.commandObject,
            interaction,
            message
        };
        await this.processCommand(command.commandObject, await this._validations, callbackArgs);
    }
    messageListener(client) {
        client.on("messageCreate", async (message) => {
            if (message.author.bot)
                return;
            const { content } = message;
            if (!content.startsWith(this._prefix))
                return;
            const args = content.split(/\s+/);
            const commandName = args
                .shift()
                ?.substring(this._prefix.length)
                ?.trim();
            if (!commandName || commandName.length === 0)
                return;
            await this.runCommand(commandName, args, message);
        });
    }
    interactionListener(client) {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand())
                return;
            const args = ["2", "4"];
            await this.runCommand(interaction.commandName, args, undefined, interaction);
        });
    }
    async processCommand(command, validations, data) {
        for (const validation of await validations) {
            if (validation.type === "all" || validation.type === command.type) {
                const result = await validation.callback(data, this._instance);
                if (!result)
                    return;
            }
        }
        if (command.type === "text") {
            const dataArgs = data;
            const message = await command.callback(dataArgs);
            if (!message)
                return;
            dataArgs.message.reply(message);
        }
        else if (command.type === "hybrid") {
            const dataArgs = data;
            const message = await command.callback(dataArgs);
            if (!message)
                return;
            if (dataArgs.message) {
                dataArgs.message.reply(message);
            }
            else if (dataArgs.interaction) {
                if (dataArgs.interaction.replied) {
                    dataArgs.interaction.editReply(message);
                }
                else {
                    dataArgs.interaction.reply(message);
                }
            }
        }
        else if (command.type === "slash") {
            const dataArgs = data;
            const message = await command.callback(dataArgs);
            if (!message)
                return;
            if (dataArgs.interaction.replied) {
                dataArgs.interaction.editReply(message);
            }
            else {
                dataArgs.interaction.reply(message);
            }
        }
    }
    getValidations(type) {
        const __filename = fileURLToPath(import.meta.url);
        const dirname = path.dirname(__filename);
        return (async () => await Promise.all(getAllFiles(path.join(dirname, "validations", type)).map(async (filePath) => (await import(pathToFileURL(filePath).href)).default)))();
    }
}
export default CommandHandler;
//# sourceMappingURL=CommandHandler.js.map