import { Attachment, Channel, Role, User } from "discord.js";
type StringOption = BaseOption<"string">;
type NumberOption = BaseOption<"number">;
type BooleanOption = BaseOption<"boolean">;
type UserOption = BaseOption<"user">;
type ChannelOption = BaseOption<"channel">;
type RoleOption = BaseOption<"role">;
type MentionableOption = BaseOption<"mentionable">;
type AttachmentOption = BaseOption<"attachment">;
type Choice = {
    name: string;
    value: string;
};
type Option = StringOption | NumberOption | BooleanOption | UserOption | ChannelOption | RoleOption | MentionableOption | AttachmentOption;
type PrimitiveTypeMap = {
    string: string;
    number: number;
    boolean: boolean;
    user: User;
    channel: Channel;
    role: Role;
    mentionable: User | Channel | Role;
    attachment: Attachment;
};
type OptionCore<T extends keyof PrimitiveTypeMap> = {
    name?: string;
    description: string;
    type: T;
};
type RequiredOption<T extends keyof PrimitiveTypeMap> = OptionCore<T> & {
    required: true;
    default?: never;
    choices?: T extends "string" ? Choice[] : never;
};
type OptionalOption<T extends keyof PrimitiveTypeMap> = OptionCore<T> & {
    required?: false;
    default?: PrimitiveTypeMap[T];
    choices?: T extends "string" ? Choice[] : never;
};
type BaseOption<T extends keyof PrimitiveTypeMap = keyof PrimitiveTypeMap> = RequiredOption<T> | OptionalOption<T>;
type Options = {
    [name: string]: Option;
};
type TransformOptions<O extends Options> = {
    [K in keyof O]: O[K] & (O[K] extends BaseOption<infer T> ? O[K] extends {
        required: true;
    } ? {
        value: PrimitiveTypeMap[T];
    } : O[K]["default"] extends PrimitiveTypeMap[T] ? {
        value: PrimitiveTypeMap[T];
    } : {
        value?: PrimitiveTypeMap[T];
    } : {});
};
export type { AttachmentOption, BaseOption, BooleanOption, ChannelOption, MentionableOption, NumberOption, Option, Options, PrimitiveTypeMap, RoleOption, StringOption, TransformOptions, UserOption };
//# sourceMappingURL=options.d.ts.map