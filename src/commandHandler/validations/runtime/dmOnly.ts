import { runtimeValidation } from "../../../builders.js";

const validation = runtimeValidation({
	type: "all",
	callback: async (args, instance) => {
		const { guild, command } = args;

		if (guild && command.dmOnly) {
			await (command as any).onError?.({
				...args,
				command: command,
				error: "noDm"
			});
			return false;
		}

		return true;
	}
});

export default validation;
