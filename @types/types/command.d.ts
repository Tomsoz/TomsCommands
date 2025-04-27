import { CommandInteraction, Guild, InteractionEditReplyOptions, InteractionReplyOptions, Message, MessagePayload, MessageReplyOptions } from "discord.js";
import { BooleanOption, Options, TransformOptions } from "./options.js";
export type ValidationError = "tooManyArgs" | "tooLittleArgs" | "devOnly";
export type BaseCallbackArgs<O extends Options, C extends Command<O>> = {
    command: C;
    guild: Guild | null;
    args: TransformOptions<O>;
};
export type BaseOnErrorArgs<O extends Options, C extends Command<O>> = {
    command: C;
    guild: Guild | null;
    args: O;
    error: ValidationError;
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
export type BaseCommand<O extends Options = Options> = {
    name: string;
    description: string;
    options: O;
    devOnly?: boolean;
};
export type TextCommand<O extends Options = Options> = BaseCommand<O> & {
    type: "text";
    callback: (args: TextCallbackArgs<O>) => Promise<MessageReplyOptions | MessagePayload | string | null | undefined | void>;
    onError?: (args: TextOnErrorArgs<O>) => void;
};
export type TextCallbackArgs<O extends Options> = BaseCallbackArgs<O, TextCommand<O>> & {
    message: Message;
};
export type TextOnErrorArgs<O extends Options> = BaseOnErrorArgs<O, TextCommand<O>>;
export type SlashCommand<O extends Options = Options> = BaseCommand<O> & {
    type: "slash";
    delete?: boolean;
    defer?: boolean | keyof O;
    callback: (args: SlashCallbackArgs<O>) => Promise<InteractionReplyOptions | InteractionEditReplyOptions | string | null | undefined | void>;
    onError?: (args: SlashOnErrorArgs<O>) => void;
};
export type SlashCallbackArgs<O extends Options> = BaseCallbackArgs<O, SlashCommand<O>> & {
    interaction: CommandInteraction;
};
export type SlashOnErrorArgs<O extends Options> = BaseOnErrorArgs<O, SlashCommand<O>>;
export type HybridCommand<O extends Options = Options> = BaseCommand<O> & {
    type: "hybrid";
    delete?: boolean;
    defer?: boolean | keyof {
        [K in keyof O as O[K] extends BooleanOption ? K : never]: O[K];
    };
    callback: (args: HybridCallbackArgs<O>) => Promise<MessageReplyOptions | MessagePayload | InteractionReplyOptions | InteractionEditReplyOptions | string | null | undefined | void>;
    onError?: (args: HybridOnErrorArgs<O>) => void;
};
export type HybridCallbackArgs<O extends Options> = BaseCallbackArgs<O, HybridCommand<O>> & InvocationContext;
export type HybridOnErrorArgs<O extends Options> = BaseOnErrorArgs<O, HybridCommand<O>> & InvocationContext;
export type Command<O extends Options = Options> = TextCommand<O> | SlashCommand<O> | HybridCommand<O>;
export type CallbackArgs<O extends Options> = TextCallbackArgs<O> | SlashCallbackArgs<O> | HybridCallbackArgs<O>;
//# sourceMappingURL=command.d.ts.map