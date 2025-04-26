import { ApplicationCommandOptionType } from "discord.js";
import { PrimitiveTypeMap } from "../types/options.js";

export const getApplicationCommandOptionType = (
	type: keyof PrimitiveTypeMap
): ApplicationCommandOptionType => {
	switch (type) {
		case "string":
			return ApplicationCommandOptionType.String;
		case "number":
			return ApplicationCommandOptionType.Number;
		case "boolean":
			return ApplicationCommandOptionType.Boolean;
		case "user":
			return ApplicationCommandOptionType.User;
		case "channel":
			return ApplicationCommandOptionType.Channel;
		case "role":
			return ApplicationCommandOptionType.Role;
		case "mentionable":
			return ApplicationCommandOptionType.Mentionable;
		case "attachment":
			return ApplicationCommandOptionType.Attachment;
		default:
			return ApplicationCommandOptionType.String;
	}
};
