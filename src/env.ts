// src/index.ts
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config(); // Load .env file into process.env

type SchemaDefinition = {
	[key: string]: z.ZodTypeAny;
};

type VariableMapping = {
	[key: string]: string | undefined;
};

type EnvOptions<T extends SchemaDefinition> = {
	types: T;
	variables: VariableMapping;
};

export function createEnv<T extends SchemaDefinition>(
	options: EnvOptions<T>
): z.infer<z.ZodObject<T>> {
	const schema = z.object(options.types);

	const processEnv: Record<string, string | undefined> = {};
	for (const key in options.types) {
		if (Object.prototype.hasOwnProperty.call(options.types, key)) {
			processEnv[key] = options.variables[key];
		}
	}

	try {
		return schema.parse(processEnv);
	} catch (e) {
		if (e instanceof z.ZodError) {
			console.error(
				"❌ Invalid environment variables:",
				e.flatten().fieldErrors
			);
			throw new Error("Invalid environment variables");
		}
		throw e;
	}
}
