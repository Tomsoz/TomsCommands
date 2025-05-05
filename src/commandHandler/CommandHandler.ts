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
import { Options, TransformOptions } from "../types/options.js";
import {
	GetValidation,
	RuntimeValidation,
	ValidationType
} from "../types/validations.js";
import { createDir, dirExists, getAllFiles } from "../utils/filesystem.js";
import { parseArgument } from "../utils/parseArgument.js";
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
		if (this._prefix) {
			this.messageListener(client);
		}
		this.interactionListener(client);
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
				command.name ?? file.split(/[/\\]/).pop()?.split(".")[0];
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

			if (command.type === "text" || command.type === "hybrid") {
				if (this._prefix)
					this._commands.set(
						commandObject.commandName,
						commandObject
					);
			}

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
			message
		} as CallbackArgs<typeof options>;

		await this.processCommand(
			command.commandObject,
			await this._validations,
			callbackArgs
		);
	}

	messageListener(client: Client) {
		client.on("messageCreate", async (message) => {
			if (message.author.bot || !this._prefix) return;

			const { content } = message;
			if (!content.startsWith(this._prefix)) return;

			const args = content.split(/\s+/);
			const commandName = args
				.shift()
				?.substring(this._prefix.length)
				?.trim();
			if (!commandName || commandName.length === 0) return;

			const command = this._commands.get(commandName.toLowerCase());
			if (!command) return;

			const options = command.commandObject.options ?? {};
			const typedOptions: TransformOptions<typeof options> = options;

			let i = 0;
			const newOptions = Object.fromEntries(
				Object.entries(typedOptions).map(([key, value]) => {
					if (i >= args.length) {
						if (value.required) {
							throw new Error(`Missing required option: ${key}`);
						}
						value.value = value.default;
					} else {
						value.value = parseArgument(args[i], value.type);
					}
					i++;
					return [key, value];
				})
			);

			await this.runCommand(command, newOptions, message);
		});
	}

	interactionListener(client: Client) {
		client.on("interactionCreate", async (interaction) => {
			if (!interaction.isCommand()) return;

			const command = this._commands.get(interaction.commandName);
			if (!command) return;

			const options = command.commandObject.options ?? {};
			const typedOptions: TransformOptions<typeof options> = options;
			const finalOptions: Options = {};
			interaction.options.data.map((option) => {
				const typedOption = typedOptions[option.name];
				if (!typedOption) return;
				if (!option.value && typedOption.required) {
					throw new Error(`Missing required option: ${option.name}`);
				} else if (!option.value) {
					typedOption.value = typedOption.default;
				} else {
					typedOption.value = parseArgument(
						option.value,
						typedOption.type
					);
				}
				finalOptions[option.name] = typedOption;
			});

			let ephemeral = true;
			if (
				"ephemeral" in command.commandObject &&
				command.commandObject.ephemeral !== undefined
			) {
				if (typeof command.commandObject.ephemeral === "boolean") {
					ephemeral = command.commandObject.ephemeral;
				} else {
					const ephemeralOption = command.commandObject
						.ephemeral as keyof Options;

					// @ts-ignore
					ephemeral = finalOptions[ephemeralOption].value;
				}
			}

			if (
				"defer" in command.commandObject &&
				command.commandObject.defer
			) {
				await interaction.deferReply({ ephemeral });
			}

			await this.runCommand(
				command,
				finalOptions,
				undefined,
				interaction
			);
		});
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
				if (dataArgs.interaction.replied) {
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
			if (dataArgs.interaction.replied) {
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
