import { CommandInteraction, MessageFlags } from "discord.js";
import { event } from "../../../../builders.js";
import { Options, TransformOptions } from "../../../../types/options.js";
import { parseSlashArgument } from "../../../../utils/parseArgument.js";

export default event({
	callback: async (interaction: CommandInteraction, instance) => {
		const { commandHandler } = instance;

		const command = commandHandler.commands.get(interaction.commandName);
		if (!command) return;

		const options = command.commandObject.options ?? {};
		const typedOptions: TransformOptions<typeof options> = options;
		const finalOptions: Options = {};
		Object.keys(typedOptions).forEach((key) => {
			const option = typedOptions[key]
			if (!option) return;

			let value = parseSlashArgument(interaction.options.get(key, option.required), option.type)
			if (!value && option.required) {
				throw new Error(`Missing required option: ${option.name}`);
			} else if (!value) {
				value = option.default
			}

			option.value = value
			finalOptions[key] = option
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

				if (finalOptions[ephemeralOption]) {
					// @ts-ignore
					ephemeral = finalOptions[ephemeralOption].value;
				}
			}
		}

		if ("defer" in command.commandObject && command.commandObject.defer) {
			if (ephemeral) {
				await interaction.deferReply({
					flags: MessageFlags.Ephemeral
				});
			} else {
				await interaction.deferReply();
			}
		}

		await commandHandler.runCommand(
			command,
			finalOptions,
			undefined,
			interaction
		);
	}
});
