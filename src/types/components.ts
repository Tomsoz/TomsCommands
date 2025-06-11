import {
	ActionRowBuilder,
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

export interface Components<
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> {
	[key: string]: Component<this, G, D>;
}

export type Component<
	C extends Components<G, D>,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> =
	| ButtonComponent<C, G, D>
	| StringSelectMenuComponent<C, G, D>
	| MentionableSelectMenuComponent<C, G, D>
	| ChannelSelectMenuComponent<C, G, D>
	| UserSelectMenuComponent<C, G, D>
	| RoleSelectMenuComponent<C, G, D>
	| ModalComponent<C, G, D>;

export type BaseComponent = {};

export type BaseComponentExecuteArgs<
	I extends Interaction,
	C extends Components<G, D>,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = {
	interaction: I;
	guild: GuildTypeFor<G, D>;
	user: UserTypeFor<G, D>;
	components: C;
};

export type ButtonComponent<
	C extends Components<G, D>,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "button";
	builder: (...args: any) => ButtonBuilder;
	execute: (
		args: BaseComponentExecuteArgs<ButtonInteraction, C, G, D>
	) => Promise<void>;
};

export type StringSelectMenuComponent<
	C extends Components<G, D>,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "stringSelectMenu";
	builder: (...args: any) => ActionRowBuilder<StringSelectMenuBuilder>;
	execute: (
		args: BaseComponentExecuteArgs<StringSelectMenuInteraction, C, G, D>
	) => Promise<void>;
};

export type MentionableSelectMenuComponent<
	C extends Components<G, D>,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "mentionableSelectMenu";
	builder: (...args: any) => ActionRowBuilder<MentionableSelectMenuBuilder>;
	execute: (
		args: BaseComponentExecuteArgs<
			MentionableSelectMenuInteraction,
			C,
			G,
			D
		>
	) => Promise<void>;
};

export type ChannelSelectMenuComponent<
	C extends Components<G, D>,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "channelSelectMenu";
	builder: (...args: any) => ActionRowBuilder<ChannelSelectMenuBuilder>;
	execute: (
		args: BaseComponentExecuteArgs<ChannelSelectMenuInteraction, C, G, D>
	) => Promise<void>;
};

export type UserSelectMenuComponent<
	C extends Components<G, D>,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "userSelectMenu";
	builder: (...args: any) => ActionRowBuilder<UserSelectMenuBuilder>;
	execute: (
		args: BaseComponentExecuteArgs<UserSelectMenuInteraction, C, G, D>
	) => Promise<void>;
};

export type RoleSelectMenuComponent<
	C extends Components<G, D>,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "roleSelectMenu";
	builder: (...args: any) => ActionRowBuilder<RoleSelectMenuBuilder>;
	execute: (
		args: BaseComponentExecuteArgs<RoleSelectMenuInteraction, C, G, D>
	) => Promise<void>;
};

export type ModalComponent<
	C extends Components<G, D>,
	G extends boolean | undefined = undefined,
	D extends boolean | undefined = undefined
> = BaseComponent & {
	type: "modal";
	builder: (...args: any) => ModalBuilder;
	execute: (
		args: BaseComponentExecuteArgs<ModalSubmitInteraction, C, G, D>
	) => Promise<void>;
};
