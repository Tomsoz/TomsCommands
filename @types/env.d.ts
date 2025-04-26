import { z } from "zod";
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
export declare function createEnv<T extends SchemaDefinition>(options: EnvOptions<T>): z.infer<z.ZodObject<T>>;
export {};
//# sourceMappingURL=env.d.ts.map