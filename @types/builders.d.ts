import { Command } from "./types/command.js";
import { Components } from "./types/components.js";
import { Event } from "./types/event.js";
import { Choice, Option, OptionalOption, Options } from "./types/options.js";
import { RuntimeValidation, SyntaxValidation } from "./types/validations.js";
export declare function command<O extends Options, C extends Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined>(cmd: Command<O, C, G, D>): Command<O, C, G, D>;
export declare function option<Opt extends Option>(option: Opt & (Opt extends OptionalOption<"string"> & {
    choices: infer C extends ReadonlyArray<Choice<"string">>;
} ? {
    default?: C[number]["value"];
} : unknown)): Opt;
export declare function choices<const C extends ReadonlyArray<Choice<"string"> | Choice<"number">>>(...choices: C): C;
export declare function runtimeValidation(validation: RuntimeValidation): RuntimeValidation;
export declare function syntaxValidation(validation: SyntaxValidation): SyntaxValidation;
export declare function event(event: Event): Event;
//# sourceMappingURL=builders.d.ts.map