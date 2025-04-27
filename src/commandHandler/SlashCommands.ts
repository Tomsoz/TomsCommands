import {
	ApplicationCommandOption,
	ApplicationCommandOptionData,
	Client
} from "discord.js";
import { Options } from "../types/options.js";
import { getApplicationCommandOptionType } from "../utils/typing.js";

export default class SlashCommands {
	private _client: Client;

	constructor(client: Client) {
		this._client = client;
	}

	async getCommands(guildId?: string) {
		let commands;

		if (guildId) {
			const guild = await this._client.guilds.fetch(guildId);
			commands = guild.commands;
		} else {
			commands = await this._client.application?.commands;
		}

		await commands?.fetch({});
		return commands;
	}

	areOptionsDifferent(
		existingOptions: (ApplicationCommandOption & {
			nameLocalized?: string;
			descriptionLocalized?: string;
		})[],
		newOptions: ApplicationCommandOptionData[]
	) {
		return (
			existingOptions.length !== newOptions.length ||
			existingOptions.some((option, index) => {
				const newOption = newOptions[index];

				const optionHasRequired = "required" in option;
				const newOptionHasRequired = "required" in newOption;

				let requiredIsDifferent = false;
				if (optionHasRequired && newOptionHasRequired) {
					requiredIsDifferent =
						(option as any).required !==
						(newOption as any).required;
				} else if (optionHasRequired !== newOptionHasRequired) {
					requiredIsDifferent = true;
				}

				return (
					option.name !== newOption.name ||
					option.description !== newOption.description ||
					option.type !== newOption.type ||
					requiredIsDifferent
				);
			})
		);
	}

	async create(
		name: string,
		description: string,
		options: Options,
		guildId?: string
	) {
		const commands = await this.getCommands(guildId);
		if (!commands) {
			throw new Error(
				"Commands object is not set, aborting command creation!"
			);
		}

		const discordOptions: ApplicationCommandOptionData[] = Object.entries(
			options
		).map(([key, value]) => {
			const optionType = getApplicationCommandOptionType(value.type);

			return {
				name: (value.name ?? key).replace(" ", "-"),
				description: value.description,
				type: optionType,
				required: value.required ?? false,
				choices:
					value.type === "string" || value.type == "number"
						? value.choices
						: undefined
			} as ApplicationCommandOptionData;
		});

		const existingCommand = commands.cache.find(
			(command) => command.name === name
		);
		if (existingCommand) {
			const {
				description: existingDescription,
				options: existingOptions
			} = existingCommand;

			if (
				existingDescription !== description ||
				this.areOptionsDifferent(existingOptions, discordOptions)
			) {
				await existingCommand.edit({
					description,
					options: discordOptions
				});
				console.log(`Updated slash command ${name}`);
				return;
			}

			console.log(`Command ${name} already exists`);
			return;
		}

		await commands.create({ name, description, options: discordOptions });
		console.log(`Registered slash command ${name}`);
	}

	async delete(commandName: string, guildId?: string) {
		const commands = await this.getCommands(guildId);
		if (!commands) {
			throw new Error(
				"Commands object is not set, aborting command creation!"
			);
		}

		const existingCommand = commands.cache.find(
			(command) => command.name === commandName
		);
		if (!existingCommand) {
			return;
		}

		await existingCommand.delete();
	}
}
