// src/index.ts
import * as dotenv from "dotenv";
import { z } from "zod";
dotenv.config(); // Load .env file into process.env
export function createEnv(options) {
    const schema = z.object(options.types);
    const processEnv = {};
    for (const key in options.types) {
        if (Object.prototype.hasOwnProperty.call(options.types, key)) {
            processEnv[key] = options.variables[key];
        }
    }
    try {
        return schema.parse(processEnv);
    }
    catch (e) {
        if (e instanceof z.ZodError) {
            console.error("❌ Invalid environment variables:", e.flatten().fieldErrors);
            throw new Error("Invalid environment variables");
        }
        throw e;
    }
}
//# sourceMappingURL=env.js.map