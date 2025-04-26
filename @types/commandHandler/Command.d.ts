import { Handlers } from "../index.js";
import { Command } from "../types/command.js";
export declare class CommandObject {
    private _commandName;
    private _commandObject;
    private _instance;
    constructor(instance: Handlers, commandName: string, commandObject: Command);
    get instance(): Handlers;
    get commandName(): string;
    get commandObject(): Command;
}
//# sourceMappingURL=Command.d.ts.map