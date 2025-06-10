import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ChannelSelectMenuBuilder, ChannelSelectMenuInteraction, Interaction, MentionableSelectMenuBuilder, MentionableSelectMenuInteraction, ModalBuilder, ModalSubmitInteraction, RoleSelectMenuBuilder, RoleSelectMenuInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, UserSelectMenuBuilder, UserSelectMenuInteraction } from "discord.js";
import { GuildTypeFor, UserTypeFor } from "./command.js";
export type Components<G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    [key: string]: Component<G, D>;
};
export type Component<G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = ButtonComponent<G, D> | StringSelectMenuComponent<G, D> | MentionableSelectMenuComponent<G, D> | ChannelSelectMenuComponent<G, D> | UserSelectMenuComponent<G, D> | ModalComponent<G, D>;
export type BaseComponent = {};
export type BaseComponentExecuteArgs<I extends Interaction, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    interaction: I;
    guild: GuildTypeFor<G, D>;
    user: UserTypeFor<G, D>;
};
export type ButtonComponent<G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseComponent & {
    type: "button";
    builder: (...args: any) => ButtonBuilder;
    execute: (args: BaseComponentExecuteArgs<ButtonInteraction, G, D>) => Promise<void>;
};
export type StringSelectMenuComponent<G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseComponent & {
    type: "stringSelectMenu";
    builder: (...args: any) => ActionRowBuilder<StringSelectMenuBuilder>;
    execute: (args: BaseComponentExecuteArgs<StringSelectMenuInteraction, G, D>) => Promise<void>;
};
export type MentionableSelectMenuComponent<G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseComponent & {
    type: "mentionableSelectMenu";
    builder: (...args: any) => ActionRowBuilder<MentionableSelectMenuBuilder>;
    execute: (args: BaseComponentExecuteArgs<MentionableSelectMenuInteraction, G, D>) => Promise<void>;
};
export type ChannelSelectMenuComponent<G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseComponent & {
    type: "channelSelectMenu";
    builder: (...args: any) => ActionRowBuilder<ChannelSelectMenuBuilder>;
    execute: (args: BaseComponentExecuteArgs<ChannelSelectMenuInteraction, G, D>) => Promise<void>;
};
export type UserSelectMenuComponent<G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseComponent & {
    type: "userSelectMenu";
    builder: (...args: any) => ActionRowBuilder<UserSelectMenuBuilder>;
    execute: (args: BaseComponentExecuteArgs<UserSelectMenuInteraction, G, D>) => Promise<void>;
};
export type RoleSelectMenuComponent<G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseComponent & {
    type: "roleSelectMenu";
    builder: (...args: any) => ActionRowBuilder<RoleSelectMenuBuilder>;
    execute: (args: BaseComponentExecuteArgs<RoleSelectMenuInteraction, G, D>) => Promise<void>;
};
export type ModalComponent<G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseComponent & {
    type: "modal";
    builder: (...args: any) => ModalBuilder;
    execute: (args: BaseComponentExecuteArgs<ModalSubmitInteraction, G, D>) => Promise<void>;
};
//# sourceMappingURL=components.d.ts.map