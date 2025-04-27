import { Attachment, Channel, Role, User } from "discord.js";
export type PrimitiveTypeMap = {
    string: string;
    number: number;
    boolean: boolean;
    user: User;
    channel: Channel;
    role: Role;
    mentionable: User | Channel | Role;
    attachment: Attachment;
};
export type OptionCore<T extends keyof PrimitiveTypeMap> = {
    name?: string;
    description: string;
    type: T;
};
export type RequiredOption<T extends keyof PrimitiveTypeMap> = OptionCore<T> & {
    required: true;
    default?: never;
};
export type OptionalOption<T extends keyof PrimitiveTypeMap> = OptionCore<T> & {
    required?: false;
    default?: PrimitiveTypeMap[T];
};
export type BaseOption<T extends keyof PrimitiveTypeMap = keyof PrimitiveTypeMap> = RequiredOption<T> | OptionalOption<T>;
export type Choice<T extends keyof PrimitiveTypeMap> = {
    name: string;
    value: PrimitiveTypeMap[T];
};
export type StringOption = BaseOption<"string"> & {
    choices?: ReadonlyArray<Choice<"string">>;
};
export type NumberOption = BaseOption<"number"> & {
    choices?: ReadonlyArray<Choice<"number">>;
};
export type BooleanOption = BaseOption<"boolean">;
export type UserOption = BaseOption<"user">;
export type ChannelOption = BaseOption<"channel">;
export type RoleOption = BaseOption<"role">;
export type MentionableOption = BaseOption<"mentionable">;
export type AttachmentOption = BaseOption<"attachment">;
export type Option = StringOption | NumberOption | BooleanOption | UserOption | ChannelOption | RoleOption | MentionableOption | AttachmentOption;
export type Options = {
    [name: string]: Option;
};
export type TransformOptions<O extends Options> = {
    [K in keyof O]: O[K] & (O[K] extends {
        type: infer T extends keyof PrimitiveTypeMap;
    } ? O[K] extends {
        choices: ReadonlyArray<{
            value: infer V;
        }>;
    } ? O[K] extends {
        required: true;
    } ? {
        value: O[K]["choices"][number]["value"];
    } : O[K] extends {
        default: any;
    } ? {
        value: O[K]["choices"][number]["value"];
    } : {
        value?: O[K]["choices"][number]["value"];
    } : O[K] extends {
        required: true;
    } ? {
        value: PrimitiveTypeMap[T];
    } : O[K] extends {
        default: any;
    } ? {
        value: PrimitiveTypeMap[T];
    } : {
        value?: PrimitiveTypeMap[T];
    } : {});
};
//# sourceMappingURL=options.d.ts.map