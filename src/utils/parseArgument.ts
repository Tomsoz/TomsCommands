import { CommandInteractionOption } from "discord.js";
import { PrimitiveTypeMap } from "../types/options.js";

export function parseArgument<T extends keyof PrimitiveTypeMap>(
	arg: any,
	type: T
): PrimitiveTypeMap[T] {
	switch (type) {
		case "string":
			return String(arg) as PrimitiveTypeMap[T];
		case "number":
			return Number(arg) as PrimitiveTypeMap[T];
		case "boolean":
			return typeof arg == "boolean"
				? (arg as PrimitiveTypeMap[T])
				: String(arg).toLowerCase() == "true"
				? (true as PrimitiveTypeMap[T])
				: (false as PrimitiveTypeMap[T]);
		case "user":
			return arg as PrimitiveTypeMap[T];
		case "channel":
			return arg as PrimitiveTypeMap[T];
		case "role":
			return arg as PrimitiveTypeMap[T];
		case "mentionable":
			return arg as PrimitiveTypeMap[T];
		case "attachment":
			return arg as PrimitiveTypeMap[T];
		default:
			return arg as PrimitiveTypeMap[T];
	}
}

export function parseSlashArgument<T extends keyof PrimitiveTypeMap>(
	option: CommandInteractionOption,
	type: T
): PrimitiveTypeMap[T] {
	switch (type) {
		case "string":
			return String(option.value) as PrimitiveTypeMap[T];
		case "number":
			return Number(option.value) as PrimitiveTypeMap[T];
		case "boolean":
			return Boolean(option.value) as PrimitiveTypeMap[T];
		case "user":
			return option.user as PrimitiveTypeMap[T];
		case "channel":
			return option.channel as PrimitiveTypeMap[T];
		case "role":
			return option.role as PrimitiveTypeMap[T];
		case "mentionable":
			return (option.user ?? option.role) as PrimitiveTypeMap[T];
		case "attachment":
			return option.attachment as PrimitiveTypeMap[T];
		default:
			return option.value as PrimitiveTypeMap[T];
	}
}
