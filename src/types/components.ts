import {
	ButtonBuilder,
	ButtonInteraction,
	ChannelSelectMenuBuilder,
	ChannelSelectMenuInteraction,
	Interaction,
	MentionableSelectMenuBuilder,
	MentionableSelectMenuInteraction,
	ModalBuilder,
	ModalSubmitInteraction,
	RoleSelectMenuBuilder,
	RoleSelectMenuInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	UserSelectMenuBuilder,
	UserSelectMenuInteraction,
} from "discord.js";
import { GuildTypeFor, UserTypeFor } from "./command.js";

export type Component<
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> =
	| ButtonComponent<G, D>
	| StringSelectMenuComponent<G, D>
	| MentionableSelectMenuComponent<G, D>
	| ChannelSelectMenuComponent<G, D>
	| UserSelectMenuComponent<G, D>
	| ModalComponent<G, D>;

export type BaseComponent = {
	customId: string;
};

export type BaseComponentExecuteArgs<
	I extends Interaction,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = {
	interaction: I;
	guild: GuildTypeFor<G, D>;
	user: UserTypeFor<G, D>;
};

export type ButtonComponent<
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "button";
	builder: (builder: ButtonBuilder, ...args: any) => ButtonBuilder;
	execute: (
		args: BaseComponentExecuteArgs<ButtonInteraction, G, D>
	) => Promise<void>;
};

export type StringSelectMenuComponent<
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "stringSelectMenu";
	builder: (
		builder: StringSelectMenuBuilder,
		...args: any
	) => StringSelectMenuBuilder;
	execute: (
		args: BaseComponentExecuteArgs<StringSelectMenuInteraction, G, D>
	) => Promise<void>;
};

export type MentionableSelectMenuComponent<
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "mentionableSelectMenu";
	builder: (
		builder: MentionableSelectMenuBuilder,
		...args: any
	) => MentionableSelectMenuBuilder;
	execute: (
		args: BaseComponentExecuteArgs<MentionableSelectMenuInteraction, G, D>
	) => Promise<void>;
};

export type ChannelSelectMenuComponent<
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "channelSelectMenu";
	builder: (
		builder: ChannelSelectMenuBuilder,
		...args: any
	) => ChannelSelectMenuBuilder;
	execute: (
		args: BaseComponentExecuteArgs<ChannelSelectMenuInteraction, G, D>
	) => Promise<void>;
};

export type UserSelectMenuComponent<
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "userSelectMenu";
	builder: (
		builder: UserSelectMenuBuilder,
		...args: any
	) => UserSelectMenuBuilder;
	execute: (
		args: BaseComponentExecuteArgs<UserSelectMenuInteraction, G, D>
	) => Promise<void>;
};

export type RoleSelectMenuComponent<
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "roleSelectMenu";
	builder: (
		builder: RoleSelectMenuBuilder,
		...args: any
	) => RoleSelectMenuBuilder;
	execute: (
		args: BaseComponentExecuteArgs<RoleSelectMenuInteraction, G, D>
	) => Promise<void>;
};

export type ModalComponent<
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "modal";
	builder: (builder: ModalBuilder, ...args: any) => ModalBuilder;
	execute: (
		args: BaseComponentExecuteArgs<ModalSubmitInteraction, G, D>
	) => Promise<void>;
};
