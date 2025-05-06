import { CommandInteractionOption } from "discord.js";
import { PrimitiveTypeMap } from "../types/options.js";
export declare function parseArgument<T extends keyof PrimitiveTypeMap>(arg: any, type: T): PrimitiveTypeMap[T];
export declare function parseSlashArgument<T extends keyof PrimitiveTypeMap>(option: CommandInteractionOption, type: T): PrimitiveTypeMap[T] | null;
//# sourceMappingURL=parseArgument.d.ts.map