import { Client, CommandInteraction, Guild, GuildMember, Interaction, InteractionEditReplyOptions, InteractionReplyOptions, Message, MessagePayload, MessageReplyOptions, PermissionFlagsBits, User } from "discord.js";
import { BooleanOption, Options, TransformOptions } from "./options.js";
import { Components } from "./components.js";
export type GuildInteraction<I extends Interaction> = I & {
    guild: Guild;
    guildId: string;
};
export type ValidationError = "tooManyArgs" | "tooLittleArgs" | "devOnly" | "noGuild" | "noDm" | "invalidPermissions";
export type GuildTypeFor<G extends boolean | undefined, D extends boolean | undefined> = G extends true ? Guild : D extends true ? null : Guild | null;
export type UserTypeFor<G extends boolean | undefined, D extends boolean | undefined> = G extends true ? GuildMember : D extends true ? User : User | GuildMember;
export type ComponentsTypeFor<C extends Components> = C extends undefined ? {
    [K in keyof C]: C[K]["builder"];
} | undefined : {
    [K in keyof C]: C[K]["builder"];
};
export type BaseCallbackArgs<O extends Options, C extends Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    command: BaseCommand<O, C, G, D>;
    args: TransformOptions<O>;
    guild: GuildTypeFor<G, D>;
    user: UserTypeFor<G, D>;
    client: Client;
    components: ComponentsTypeFor<C>;
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
export type BaseCommand<O extends Options = Options, C extends Components = Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    name: string;
    description: string;
    options?: O;
    devOnly?: boolean;
    guildOnly?: G;
    dmOnly?: D;
    permissions?: Permission[];
    components?: C;
};
export type TextCommand<O extends Options = Options, C extends Components = Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCommand<O, C, G, D> & {
    type: "text";
    callback: (args: TextCallbackArgs<O, C, G, D>) => Promise<MessageReplyOptions | MessagePayload | string | null | undefined | void>;
    onError?: (args: TextOnErrorArgs<O, C, G, D>) => void;
};
export type TextCallbackArgs<O extends Options, C extends Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCallbackArgs<O, C, G, D> & {
    message: Message;
};
export type TextOnErrorArgs<O extends Options, C extends Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    command: TextCommand<O, C, G, D>;
    guild: Guild | null;
    args: O;
    error: ValidationError;
};
export type SlashCommand<O extends Options = Options, C extends Components = Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCommand<O, C, G, D> & {
    type: "slash";
    delete?: boolean;
    defer?: boolean;
    ephemeral?: boolean | keyof O;
    callback: (args: SlashCallbackArgs<O, C, G, D>) => Promise<InteractionReplyOptions | InteractionEditReplyOptions | string | null | undefined | void>;
    onError?: (args: SlashOnErrorArgs<O, C, G, D>) => void;
};
export type SlashCallbackArgs<O extends Options, C extends Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCallbackArgs<O, C, G, D> & {
    interaction: CommandInteraction;
};
export type SlashOnErrorArgs<O extends Options, C extends Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    command: SlashCommand<O, C, G, D>;
    guild: Guild | null;
    args: O;
    error: ValidationError;
};
export type HybridCommand<O extends Options = Options, C extends Components = Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCommand<O, C, G, D> & {
    type: "hybrid";
    delete?: boolean;
    defer?: boolean;
    ephemeral?: boolean | keyof {
        [K in keyof O as O[K] extends BooleanOption ? K : never]: O[K];
    };
    callback: (args: HybridCallbackArgs<O, C, G, D>) => Promise<MessageReplyOptions | MessagePayload | InteractionReplyOptions | InteractionEditReplyOptions | string | null | undefined | void>;
    onError?: (args: HybridOnErrorArgs<O, C, G, D>) => void;
};
export type HybridCallbackArgs<O extends Options, C extends Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = BaseCallbackArgs<O, C, G, D> & InvocationContext;
export type HybridOnErrorArgs<O extends Options, C extends Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = {
    command: HybridCommand<O, C, G, D>;
    guild: Guild | null;
    args: O;
    error: ValidationError;
} & InvocationContext;
export type Command<O extends Options = Options, C extends Components = Components, G extends boolean | undefined = undefined, D extends boolean | undefined = undefined> = TextCommand<O, C, G, D> | SlashCommand<O, C, G, D> | HybridCommand<O, C, G, D>;
export type CallbackArgs<O extends Options, C extends Components = {}> = TextCallbackArgs<O, C, undefined, undefined> | SlashCallbackArgs<O, C, undefined, undefined> | HybridCallbackArgs<O, C, undefined, undefined>;
//# sourceMappingURL=command.d.ts.map