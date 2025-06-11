import {
	ButtonBuilder,
	ChannelSelectMenuBuilder,
	MentionableSelectMenuBuilder,
	ModalBuilder,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder,
} from "discord.js";

export const getBuilderInstance = (
	type:
		| "button"
		| "stringSelectMenu"
		| "mentionableSelectMenu"
		| "userSelectMenu"
		| "channelSelectMenu"
		| "modal"
) => {
	let builder;
	switch (type) {
		case "button":
			builder = new ButtonBuilder();
			break;
		case "channelSelectMenu":
			builder = new ChannelSelectMenuBuilder();
			break;
		case "mentionableSelectMenu":
			builder = new MentionableSelectMenuBuilder();
			break;
		case "modal":
			builder = new ModalBuilder();
			break;
		case "stringSelectMenu":
			builder = new StringSelectMenuBuilder();
			break;
		case "userSelectMenu":
			builder = new UserSelectMenuBuilder();
			break;
	}
	return builder;
};
