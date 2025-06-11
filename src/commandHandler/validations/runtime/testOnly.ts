import { runtimeValidation } from "../../../builders.js";
import { Command, TextCallbackArgs } from "../../../types/command.js";
import { Components } from "../../../types/components.js";
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
				...(args as TextCallbackArgs<Options, Components>),
				error: "devOnly",
			};
			await (command as Command<Options>).onError?.(errorArgs as any);

			return false;
		}

		return true;
	},
});

export default validation;
