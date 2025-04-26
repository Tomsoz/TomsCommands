import { Attachment, Channel, Role, User } from "discord.js";

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
};

type OptionalOption<T extends keyof PrimitiveTypeMap> = OptionCore<T> & {
	required?: false;
	default?: PrimitiveTypeMap[T];
};

type BaseOption<T extends keyof PrimitiveTypeMap = keyof PrimitiveTypeMap> =
	| RequiredOption<T>
	| OptionalOption<T>;

type StringOption = BaseOption<"string">;
type NumberOption = BaseOption<"number">;
type BooleanOption = BaseOption<"boolean">;
type UserOption = BaseOption<"user">;
type ChannelOption = BaseOption<"channel">;
type RoleOption = BaseOption<"role">;
type MentionableOption = BaseOption<"mentionable">;
type AttachmentOption = BaseOption<"attachment">;
type Option =
	| StringOption
	| NumberOption
	| BooleanOption
	| UserOption
	| ChannelOption
	| RoleOption
	| MentionableOption
	| AttachmentOption;
type Options = {
	[name: string]: Option;
};

type TransformOptions<O extends Options> = {
	[K in keyof O]: O[K] &
		(O[K] extends BaseOption<infer T>
			? O[K] extends { required: true }
				? {
						value: PrimitiveTypeMap[T];
				  }
				: O[K]["default"] extends PrimitiveTypeMap[T]
				? {
						value: PrimitiveTypeMap[T];
				  }
				: {
						value?: PrimitiveTypeMap[T];
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
