import { Command } from "./types/command.js";
import { BaseOption, Options, PrimitiveTypeMap } from "./types/options.js";
import { RuntimeValidation, SyntaxValidation } from "./types/validations.js";
declare function createCmd<O extends Options>(cmd: Command<O>): Command<O>;
declare function createOption<T extends keyof PrimitiveTypeMap, O extends BaseOption<T>>(option: O): O;
declare function createRuntimeValidation(validation: RuntimeValidation): RuntimeValidation;
declare function createSyntaxValidation(validation: SyntaxValidation): SyntaxValidation;
export { createCmd, createOption, createRuntimeValidation, createSyntaxValidation };
//# sourceMappingURL=builders.d.ts.map