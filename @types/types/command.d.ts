import { Client, CommandInteraction, Guild, GuildMember, Interaction, InteractionEditReplyOptions, InteractionReplyOptions, Message, MessagePayload, MessageReplyOptions, PermissionFlagsBits, User } from "discord.js";
import { BooleanOption, Options, TransformOptions } from "./options.js";
import { Component } from "./components.js";
export type GuildInteraction<I extends Interaction> = I & {
    guild: Guild;
    guildId: string;
};
export type ValidationError = "tooManyArgs" | "tooLittleArgs" | "devOnly" | "noGuild" | "noDm" | "invalidPermissions";
export type GuildTypeFor<G extends boolean | undefined, D extends boolean | undefined> = G extends true ? Guild : D extends true ? null : Guild | null;
export type UserTypeFor<G extends boolean | undefined, D extends boolean | undefined> = G extends true ? GuildMember : D extends true ? User : User | GuildMember;
export type BaseCallbackArgs<O extends Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    command: BaseCommand<O, G, D>;
    args: TransformOptions<O>;
    guild: GuildTypeFor<G, D>;
    user: UserTypeFor<G, D>;
    client: Client;
};
export type InvocationContext = {
    invocationType: "text";
    message: Message;
    interaction?: undefined;
} | {
    invocationType: "slash";
    interaction: CommandInteraction;
    message?: undefined;
};
export type Permission = keyof typeof PermissionFlagsBits;
export type BaseCommand<O extends Options = Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    name: string;
    description: string;
    options?: O;
    devOnly?: boolean;
    guildOnly?: G;
    dmOnly?: D;
    permissions?: Permission[];
    components?: Component<G, D>[];
};
export type TextCommand<O extends Options = Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCommand<O, G, D> & {
    type: "text";
    callback: (args: TextCallbackArgs<O, G, D>) => Promise<MessageReplyOptions | MessagePayload | string | null | undefined | void>;
    onError?: (args: TextOnErrorArgs<O, G, D>) => void;
};
export type TextCallbackArgs<O extends Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCallbackArgs<O, G, D> & {
    message: Message;
};
export type TextOnErrorArgs<O extends Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    command: TextCommand<O, G, D>;
    guild: Guild | null;
    args: O;
    error: ValidationError;
};
export type SlashCommand<O extends Options = Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCommand<O, G, D> & {
    type: "slash";
    delete?: boolean;
    defer?: boolean;
    ephemeral?: boolean | keyof O;
    callback: (args: SlashCallbackArgs<O, G, D>) => Promise<InteractionReplyOptions | InteractionEditReplyOptions | string | null | undefined | void>;
    onError?: (args: SlashOnErrorArgs<O, G, D>) => void;
};
export type SlashCallbackArgs<O extends Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCallbackArgs<O, G, D> & {
    interaction: CommandInteraction;
};
export type SlashOnErrorArgs<O extends Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    command: SlashCommand<O, G, D>;
    guild: Guild | null;
    args: O;
    error: ValidationError;
};
export type HybridCommand<O extends Options = Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCommand<O, G, D> & {
    type: "hybrid";
    delete?: boolean;
    defer?: boolean;
    ephemeral?: boolean | keyof {
        [K in keyof O as O[K] extends BooleanOption ? K : never]: O[K];
    };
    callback: (args: HybridCallbackArgs<O, G, D>) => Promise<MessageReplyOptions | MessagePayload | InteractionReplyOptions | InteractionEditReplyOptions | string | null | undefined | void>;
    onError?: (args: HybridOnErrorArgs<O, G, D>) => void;
};
export type HybridCallbackArgs<O extends Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCallbackArgs<O, G, D> & InvocationContext;
export type HybridOnErrorArgs<O extends Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    command: HybridCommand<O, G, D>;
    guild: Guild | null;
    args: O;
    error: ValidationError;
} & InvocationContext;
export type Command<O extends Options = Options, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = TextCommand<O, G, D> | SlashCommand<O, G, D> | HybridCommand<O, G, D>;
export type CallbackArgs<O extends Options> = TextCallbackArgs<O> | SlashCallbackArgs<O> | HybridCallbackArgs<O>;
//# sourceMappingURL=command.d.ts.map