import { Client, CommandInteraction, Message } from "discord.js";
import { Handlers } from "../index.js";
import { CallbackArgs, Command } from "../types/command.js";
import { Options } from "../types/options.js";
import { GetValidation, RuntimeValidation, ValidationType } from "../types/validations.js";
import { CommandObject } from "./Command.js";
declare class CommandHandler {
    private _instance;
    private _commandsDir;
    private _slashCommands;
    private _commands;
    private _validations;
    private _prefix;
    constructor({ instance, commandsDir, client }: {
        instance: Handlers;
        commandsDir: string;
        client: Client;
    });
    get commands(): Map<string, CommandObject>;
    readFiles(): Promise<void>;
    runCommand(command: CommandObject, options: Options, message?: Message, interaction?: CommandInteraction): Promise<void>;
    processCommand<O extends Options>(command: Command<O>, validations: RuntimeValidation[], data: CallbackArgs<O>): Promise<void>;
    getValidations<T extends ValidationType>(type: T): Promise<GetValidation<T>[]>;
}
export default CommandHandler;
//# sourceMappingURL=CommandHandler.d.ts.map