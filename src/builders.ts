import { Command } from "./types/command.js";
import { BaseOption, Options, PrimitiveTypeMap } from "./types/options.js";
import { RuntimeValidation, SyntaxValidation } from "./types/validations.js";

function createCmd<O extends Options>(cmd: Command<O>) {
	return cmd;
}
function createOption<
	T extends keyof PrimitiveTypeMap,
	O extends BaseOption<T>
>(option: O) {
	return option;
}
function createRuntimeValidation(validation: RuntimeValidation) {
	return validation;
}
function createSyntaxValidation(validation: SyntaxValidation) {
	return validation;
}

export {
	createCmd,
	createOption,
	createRuntimeValidation,
	createSyntaxValidation
};
