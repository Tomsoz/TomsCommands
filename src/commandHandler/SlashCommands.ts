import { ApplicationCommandOptionData, Client } from "discord.js";
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

		const existingCommand = commands.cache.find(
			(command) => command.name === name
		);
		if (existingCommand) {
			// TODO: Update command
			console.log("Command already exists " + name);
			return;
		}

		const discordOptions: ApplicationCommandOptionData[] = Object.entries(
			options
		).map(([key, value]) => {
			const optionType = getApplicationCommandOptionType(value.type);
			return {
				name: value.name ?? key,
				description: value.description,
				type: optionType,
				required: value.required ?? false
			} as ApplicationCommandOptionData;
		});

		await commands.create({ name, description, options: discordOptions });
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
