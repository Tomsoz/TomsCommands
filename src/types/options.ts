import { Attachment, Channel, Role, User } from "discord.js";

type StringOption = BaseOption<undefined, "string">;
type NumberOption = BaseOption<undefined, "number">;
type BooleanOption = BaseOption<undefined, "boolean">;
type UserOption = BaseOption<undefined, "user">;
type ChannelOption = BaseOption<undefined, "channel">;
type RoleOption = BaseOption<undefined, "role">;
type MentionableOption = BaseOption<undefined, "mentionable">;
type AttachmentOption = BaseOption<undefined, "attachment">;

type Choice = {
	name: string;
	value: string;
};

type Option =
	| StringOption
	| NumberOption
	| BooleanOption
	| UserOption
	| ChannelOption
	| RoleOption
	| MentionableOption
	| AttachmentOption;

type PrimitiveTypeMap<C extends Choice[] | undefined = undefined> = {
	string: C extends Choice[] ? number : string;
	number: number;
	boolean: boolean;
	user: User;
	channel: Channel;
	role: Role;
	mentionable: User | Channel | Role;
	attachment: Attachment;
};

type OptionCore<
	C extends Choice[] | undefined = undefined,
	T extends keyof PrimitiveTypeMap<C> = keyof PrimitiveTypeMap<C>
> = {
	name?: string;
	description: string;
	type: T;
};

type RequiredOption<
	C extends Choice[] | undefined = undefined,
	T extends keyof PrimitiveTypeMap<C> = keyof PrimitiveTypeMap<C>
> = OptionCore<C, T> & {
	required: true;
	default?: never;
	choices?: T extends "string" ? C : never;
};

type OptionalOption<
	C extends Choice[] | undefined = undefined,
	T extends keyof PrimitiveTypeMap<C> = keyof PrimitiveTypeMap<C>
> = OptionCore<C, T> & {
	required?: false;
	default?: PrimitiveTypeMap<C>[T];
	choices?: T extends "string" ? C : never;
};

type BaseOption<
	C extends Choice[] | undefined = undefined,
	T extends keyof PrimitiveTypeMap<C> = keyof PrimitiveTypeMap<C>
> = RequiredOption<C, T> | OptionalOption<C, T>;

type Options = {
	[name: string]: Option;
};

type TransformOptions<O extends Options> = {
	[K in keyof O]: O[K] &
		(O[K] extends BaseOption<infer C, infer T>
			? O[K] extends { required: true }
				? {
						value: PrimitiveTypeMap<C>[T];
				  }
				: O[K]["default"] extends PrimitiveTypeMap<C>[T]
				? {
						value: PrimitiveTypeMap<C>[T];
				  }
				: {
						value?: PrimitiveTypeMap<C>[T];
				  }
			: {});
};

export type {
	AttachmentOption,
	BaseOption,
	BooleanOption,
	ChannelOption,
	MentionableOption,
	NumberOption,
	Option,
	Options,
	PrimitiveTypeMap,
	RoleOption,
	StringOption,
	TransformOptions,
	UserOption
};
