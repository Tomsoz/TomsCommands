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
