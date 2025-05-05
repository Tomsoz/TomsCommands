import { runtimeValidation } from "../../../builders.js";

const validation = runtimeValidation({
	type: "all",
	callback: async (args, instance) => {
		const { guild, command } = args;

		if (!guild && command.guildOnly) {
			await (command as any).onError?.({
				...args,
				command: command,
				error: "noGuild"
			});
			return false;
		}

		return true;
	}
});

export default validation;
