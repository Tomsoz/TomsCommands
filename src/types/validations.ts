import { Handlers } from "../index.js";
import {
	Command,
	HybridCommand,
	SlashCommand,
	TextCallbackArgs,
	TextCommand
} from "./command.js";

import { HybridCallbackArgs, SlashCallbackArgs } from "./command.js";
import { Options } from "./options.js";

export type AllSyntaxValidation = {
	type: "all";
	callback: (args: Command<Options>, instance: Handlers) => Promise<void>;
};
export type TextSyntaxValidation = {
	type: "text";
	callback: (args: TextCommand<Options>, instance: Handlers) => Promise<void>;
};
export type SlashSyntaxValidation = {
	type: "slash";
	callback: (
		args: SlashCommand<Options>,
		instance: Handlers
	) => Promise<void>;
};
export type HybridSyntaxValidation = {
	type: "hybrid";
	callback: (
		args: HybridCommand<Options>,
		instance: Handlers
	) => Promise<void>;
};
export type SyntaxValidation =
	| AllSyntaxValidation
	| TextSyntaxValidation
	| SlashSyntaxValidation
	| HybridSyntaxValidation;

export type AllRuntimeValidation = {
	type: "all";
	callback: (
		args:
			| TextCallbackArgs<Options>
			| HybridCallbackArgs<Options>
			| SlashCallbackArgs<Options>,
		instance: Handlers
	) => Promise<boolean>;
};
export type TextRuntimeValidation = {
	type: "text";
	callback: (
		args: TextCallbackArgs<Options>,
		instance: Handlers
	) => Promise<boolean>;
};
export type HybridRuntimeValidation = {
	type: "hybrid";
	callback: (
		args: HybridCallbackArgs<Options>,
		instance: Handlers
	) => Promise<boolean>;
};
export type SlashRuntimeValidation = {
	type: "slash";
	callback: (
		args: SlashCallbackArgs<Options>,
		instance: Handlers
	) => Promise<boolean>;
};
export type RuntimeValidation =
	| AllRuntimeValidation
	| TextRuntimeValidation
	| HybridRuntimeValidation
	| SlashRuntimeValidation;

export type ValidationType = "syntax" | "runtime";
export type GetValidation<T extends ValidationType> = T extends "syntax"
	? AllSyntaxValidation
	: AllRuntimeValidation;
