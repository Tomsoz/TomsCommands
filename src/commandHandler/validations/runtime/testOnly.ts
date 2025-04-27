import { runtimeValidation } from "../../../builders.js";
import { TextCallbackArgs } from "../../../types/command.js";
import { Options } from "../../../types/options.js";

const validation = runtimeValidation({
	type: "all",
	callback: async (args, instance) => {
		const { command, guild } = args;

		if (
			command.devOnly &&
			(!guild || !instance.devGuilds.includes(guild.id))
		) {
			const errorArgs = {
				...(args as TextCallbackArgs<Options>),
				error: "devOnly"
			};
			await command.onError?.(errorArgs as any);

			return false;
		}

		return true;
	}
});

export default validation;
