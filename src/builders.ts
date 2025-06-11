import { Command } from "./types/command.js";
import { Components } from "./types/components.js";
import { Event } from "./types/event.js";
import { Choice, Option, OptionalOption, Options } from "./types/options.js";
import { RuntimeValidation, SyntaxValidation } from "./types/validations.js";

export function command<
	O extends Options,
	C extends Components,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
>(cmd: Command<O, C, G, D>): Command<O, C, G, D> {
	return cmd;
}

export function option<Opt extends Option>(
	option: Opt &
		(Opt extends OptionalOption<"string"> & {
			choices: infer C extends ReadonlyArray<Choice<"string">>;
		}
			? { default?: C[number]["value"] }
			: unknown)
): Opt {
	return option;
}

export function choices<
	const C extends ReadonlyArray<Choice<"string"> | Choice<"number">>
>(...choices: C): C {
	return choices;
}

export function runtimeValidation(validation: RuntimeValidation) {
	return validation;
}

export function syntaxValidation(validation: SyntaxValidation) {
	return validation;
}

export function event(event: Event) {
	return event;
}
