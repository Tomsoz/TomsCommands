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

		const componentArray = Array.from(componentFunctions.values());
		const components = componentArray.find(
			(c) => interaction.customId in c
		);
		if (!components) return;

		const component = components[interaction.customId];

		await component.execute({
			guild: interaction.guild,
			// @ts-ignore
			user: interaction.member ?? interaction.user,
			// @ts-ignore
			interaction,
			// @ts-ignore
			components,
		});
	},
});
