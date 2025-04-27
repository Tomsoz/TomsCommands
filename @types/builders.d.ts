import { Command } from "./types/command.js";
import { Choice, Option, OptionalOption, Options } from "./types/options.js";
import { RuntimeValidation, SyntaxValidation } from "./types/validations.js";
export declare function command<O extends Options>(cmd: Command<O>): Command<O>;
export declare function option<Opt extends Option>(option: Opt & (Opt extends OptionalOption<"string"> & {
    choices: infer C extends ReadonlyArray<Choice<"string">>;
} ? {
    default?: C[number]["value"];
} : unknown)): Opt;
export declare function choices<const C extends ReadonlyArray<Choice<"string"> | Choice<"number">>>(...choices: C): C;
export declare function runtimeValidation(validation: RuntimeValidation): RuntimeValidation;
export declare function syntaxValidation(validation: SyntaxValidation): SyntaxValidation;
//# sourceMappingURL=builders.d.ts.map