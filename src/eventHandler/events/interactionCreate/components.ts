import { Interaction, InteractionType } from "discord.js";
import { event } from "../../../index.js";
import { Component, Components } from "../../../types/components.js";
import { CommandObject } from "../../../commandHandler/Command.js";

export const componentFunctions = new Map<CommandObject, Components>();

const getType = (interaction: Interaction) => {
	let type = "";

	if (interaction.isButton()) type = "button";
	else if (interaction.isStringSelectMenu()) type = "stringSelectMenu";
	else if (interaction.isMentionableSelectMenu())
		type = "mentionableSelectMenu";
	else if (interaction.isUserSelectMenu()) type = "userSelectMenu";
	else if (interaction.isChannelSelectMenu()) type = "channelSelectMenu";
	else if (interaction.isRoleSelectMenu()) type = "roleSelectMenu";
	else if (interaction.isModalSubmit()) type = "modal";

	if (type === "") return;

	return type;
};

const isComponentInteraction = (interaction: Interaction) =>
	interaction.isButton() ||
	interaction.isStringSelectMenu() ||
	interaction.isMentionableSelectMenu() ||
	interaction.isUserSelectMenu() ||
	interaction.isChannelSelectMenu() ||
	interaction.isRoleSelectMenu() ||
	interaction.isModalSubmit();

export default event({
	callback: async (interaction: Interaction, instance) => {
		const type = getType(interaction);
		if (!type || !isComponentInteraction(interaction)) return;

		const componentArray = Object.values(componentFunctions.values());
		const component = componentArray.find(
			(c) => c.type === type && c.customId === interaction.customId
		);
		if (!component) return;

		const command = Array.from(componentFunctions.keys()).find((cmd) =>
			Object.values(componentFunctions.get(cmd) ?? {})?.includes(
				component
			)
		);
		if (!command) return;

		await component.execute({
			guild: interaction.guild,
			// @ts-ignore
			user: interaction.member ?? interaction.user,
			// @ts-ignore
			interaction,
		});
	},
});
