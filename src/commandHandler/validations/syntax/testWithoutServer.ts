import { createSyntaxValidation } from "../../../builders.js";
import { isOnlyDigits } from "../../../utils/strings.js";

const validation = createSyntaxValidation({
	type: "all",
	callback: async (command, instance) => {
		const devGuilds = instance.devGuilds.filter((guild: string) =>
			isOnlyDigits(guild)
		);
		if (!command.devOnly || devGuilds.length) {
			return;
		}

		throw new Error(
			`Command ${command.name} is a dev only command but no dev guilds were specified.`
		);
	}
});

export default validation;
