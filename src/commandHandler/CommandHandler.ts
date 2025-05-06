import {
	Client,
	CommandInteraction,
	InteractionEditReplyOptions,
	InteractionReplyOptions,
	Message,
	MessageFlags,
	MessagePayload,
	TextDisplayBuilder
} from "discord.js";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Handlers } from "../index.js";
import {
	CallbackArgs,
	Command,
	HybridCallbackArgs,
	SlashCallbackArgs,
	TextCallbackArgs
} from "../types/command.js";
import { Options } from "../types/options.js";
import {
	GetValidation,
	RuntimeValidation,
	ValidationType
} from "../types/validations.js";
import { createDir, dirExists, getAllFiles } from "../utils/filesystem.js";
import { CommandObject } from "./Command.js";
import SlashCommands from "./SlashCommands.js";

class CommandHandler {
	private _instance: Handlers;
	private _commandsDir: string;
	private _slashCommands: SlashCommands;
	private _commands = new Map<string, CommandObject>();
	private _validations: Promise<RuntimeValidation[]> =
		this.getValidations("runtime");
	private _prefix: string | undefined;

	constructor({
		instance,
		commandsDir,
		client
	}: {
		instance: Handlers;
		commandsDir: string;
		client: Client;
	}) {
		this._instance = instance;
		this._commandsDir = commandsDir;
		this._slashCommands = new SlashCommands(client);
		this._prefix = instance.prefix;

		this.readFiles();
	}

	get commands() {
		return this._commands;
	}

	async readFiles() {
		if (!dirExists(this._commandsDir)) {
			createDir(this._commandsDir);
		}

		const files = getAllFiles(this._commandsDir);
		const validations = this.getValidations("syntax");

		for (const file of files) {
			const fileUrl = pathToFileURL(file).href;
			const commandObj = await import(fileUrl);
			const command: Command = commandObj.default;

			const commandName =
				command.name ??
				file
					.split(/[\/\\]/g)
					.pop()
					?.split(".")[0];
			if (!commandName) {
				throw new Error(`Command name not found in file name ${file}`);
			}

			const commandObject = new CommandObject(
				this._instance,
				commandName,
				command
			);

			const { devOnly } = command;

			if (command.type !== "text" && command.delete) {
				if (devOnly) {
					for (const guildId of this._instance.devGuilds) {
						await this._slashCommands.delete(commandName, guildId);
					}
				} else {
					await this._slashCommands.delete(commandName);
				}
				continue;
			}

			for (const validation of await validations) {
				if (
					validation.type === "all" ||
					validation.type === command.type
				) {
					await validation.callback(
						commandObject.commandObject,
						this._instance
					);
				}
			}

			this._commands.set(commandObject.commandName, commandObject);

			if (command.type === "slash" || command.type === "hybrid") {
				const options = command.options ?? {};
				if (devOnly) {
					for (const guild of this._instance.devGuilds) {
						await this._slashCommands.create(
							command.name ?? commandObject.commandName,
							command.description,
							options,
							command.permissions,
							command.dmOnly,
							command.guildOnly,
							guild
						);
					}
				} else {
					await this._slashCommands.create(
						command.name ?? commandObject.commandName,
						command.description,
						options,
						command.permissions,
						command.dmOnly,
						command.guildOnly
					);
				}
			}
		}
	}

	async runCommand(
		command: CommandObject,
		options: Options,
		message?: Message,
		interaction?: CommandInteraction
	) {
		if (!message && !interaction) {
			throw new Error(
				"Either 'message' or 'interaction' must be provided."
			);
		}

		if (message && command.commandObject.type === "slash") return;

		const callbackArgs = {
			guild: message?.guild ?? interaction?.guild ?? null,
			args: options,
			command: command.commandObject,
			interaction,
			message,
			user:
				message?.member ??
				interaction?.member ??
				message?.author ??
				interaction?.user ??
				null,
			client: this._instance.client
		} as CallbackArgs<typeof options>;

		await this.processCommand(
			command.commandObject,
			await this._validations,
			callbackArgs
		);
	}

	async processCommand<O extends Options>(
		command: Command<O>,
		validations: RuntimeValidation[],
		data: CallbackArgs<O>
	) {
		for (const validation of await validations) {
			if (validation.type === "all" || validation.type === command.type) {
				const result = await validation.callback(
					data as any,
					this._instance
				);
				if (!result) return;
			}
		}

		if (command.type === "text") {
			const dataArgs = data as TextCallbackArgs<O>;
			const message = await command.callback(dataArgs);
			if (!message) return;
			if (typeof message === "string") {
				const component = new TextDisplayBuilder().setContent(message);
				dataArgs.message.reply({
					flags: MessageFlags.IsComponentsV2,
					components: [component]
				});
			} else {
				dataArgs.message.reply(message as MessagePayload);
			}
		} else if (command.type === "hybrid") {
			const dataArgs = data as HybridCallbackArgs<O>;
			const message = await command.callback(dataArgs);
			if (!message) return;
			if (dataArgs.message) {
				if (typeof message === "string") {
					const component = new TextDisplayBuilder().setContent(
						message
					);
					dataArgs.message.reply({
						flags: MessageFlags.IsComponentsV2,
						components: [component]
					});
				} else {
					dataArgs.message.reply(message as MessagePayload);
				}
			} else if (dataArgs.interaction) {
				if (
					dataArgs.interaction.replied ||
					dataArgs.interaction.deferred
				) {
					if (typeof message === "string") {
						const component = new TextDisplayBuilder().setContent(
							message
						);
						dataArgs.interaction.editReply({
							flags: MessageFlags.IsComponentsV2,
							components: [component]
						});
					} else {
						dataArgs.interaction.editReply(
							message as
								| string
								| MessagePayload
								| InteractionEditReplyOptions
						);
					}
				} else {
					if (typeof message === "string") {
						const component = new TextDisplayBuilder().setContent(
							message
						);
						dataArgs.interaction.reply({
							flags: MessageFlags.IsComponentsV2,
							components: [component]
						});
					} else {
						dataArgs.interaction.reply(
							message as
								| string
								| MessagePayload
								| InteractionReplyOptions
						);
					}
				}
			}
		} else if (command.type === "slash") {
			const dataArgs = data as SlashCallbackArgs<O>;
			const message = await command.callback(dataArgs);
			if (!message) return;
			if (dataArgs.interaction.replied || dataArgs.interaction.deferred) {
				if (typeof message === "string") {
					const component = new TextDisplayBuilder().setContent(
						message
					);
					dataArgs.interaction.editReply({
						flags: MessageFlags.IsComponentsV2,
						components: [component]
					});
				} else {
					dataArgs.interaction.editReply(
						message as
							| string
							| MessagePayload
							| InteractionEditReplyOptions
					);
				}
			} else {
				if (typeof message === "string") {
					const component = new TextDisplayBuilder().setContent(
						message
					);
					dataArgs.interaction.reply({
						flags: MessageFlags.IsComponentsV2,
						components: [component]
					});
				} else {
					dataArgs.interaction.reply(
						message as
							| string
							| MessagePayload
							| InteractionReplyOptions
					);
				}
			}
		}
	}

	getValidations<T extends ValidationType>(
		type: T
	): Promise<GetValidation<T>[]> {
		const __filename = fileURLToPath(import.meta.url);
		const dirname = path.dirname(__filename);
		return (async () =>
			await Promise.all(
				getAllFiles(path.join(dirname, "validations", type)).map(
					async (filePath) =>
						(
							await import(pathToFileURL(filePath).href)
						).default
				)
			))();
	}
}

export default CommandHandler;
