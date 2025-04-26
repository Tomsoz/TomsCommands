import { Handlers } from "../index.js";
import { Command, HybridCommand, SlashCommand, TextCallbackArgs, TextCommand } from "./command.js";
import { HybridCallbackArgs, SlashCallbackArgs } from "./command.js";
import { Options } from "./options.js";
type AllSyntaxValidation = {
    type: "all";
    callback: (args: Command<Options>, instance: Handlers) => Promise<void>;
};
type TextSyntaxValidation = {
    type: "text";
    callback: (args: TextCommand<Options>, instance: Handlers) => Promise<void>;
};
type SlashSyntaxValidation = {
    type: "slash";
    callback: (args: SlashCommand<Options>, instance: Handlers) => Promise<void>;
};
type HybridSyntaxValidation = {
    type: "hybrid";
    callback: (args: HybridCommand<Options>, instance: Handlers) => Promise<void>;
};
type SyntaxValidation = AllSyntaxValidation | TextSyntaxValidation | SlashSyntaxValidation | HybridSyntaxValidation;
type AllRuntimeValidation = {
    type: "all";
    callback: (args: TextCallbackArgs<Options> | HybridCallbackArgs<Options> | SlashCallbackArgs<Options>, instance: Handlers) => Promise<boolean>;
};
type TextRuntimeValidation = {
    type: "text";
    callback: (args: TextCallbackArgs<Options>, instance: Handlers) => Promise<boolean>;
};
type HybridRuntimeValidation = {
    type: "hybrid";
    callback: (args: HybridCallbackArgs<Options>, instance: Handlers) => Promise<boolean>;
};
type SlashRuntimeValidation = {
    type: "slash";
    callback: (args: SlashCallbackArgs<Options>, instance: Handlers) => Promise<boolean>;
};
type RuntimeValidation = AllRuntimeValidation | TextRuntimeValidation | HybridRuntimeValidation | SlashRuntimeValidation;
type ValidationType = "syntax" | "runtime";
type GetValidation<T extends ValidationType> = T extends "syntax" ? AllSyntaxValidation : AllRuntimeValidation;
export type { AllRuntimeValidation, AllSyntaxValidation, GetValidation, HybridRuntimeValidation, HybridSyntaxValidation, RuntimeValidation, SlashRuntimeValidation, SlashSyntaxValidation, SyntaxValidation, TextRuntimeValidation, TextSyntaxValidation, ValidationType };
//# sourceMappingURL=validations.d.ts.map