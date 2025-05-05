import { TransformOptions } from "../../../../types/options.js";

import { event } from "../../../../builders.js";
import { Handlers } from "../../../../index.js";
import { parseArgument } from "../../../../utils/parseArgument.js";

export default event({
	callback: async (message, instance: Handlers) => {
		if (!instance.prefix) return;

		const { commandHandler } = instance;
		if (!commandHandler) return;

		const { content } = message;
		if (!content.startsWith(instance.prefix)) return;

		const args = content.split(/\s+/);
		const commandName = args
			.shift()
			?.substring(instance.prefix.length)
			?.trim();
		if (!commandName || commandName.length === 0) return;

		const command = commandHandler.commands.get(commandName.toLowerCase());
		if (!command) return;

		const options = command.commandObject.options ?? {};
		const typedOptions: TransformOptions<typeof options> = options;

		let i = 0;
		const newOptions = Object.fromEntries(
			Object.entries(typedOptions).map(([key, value]) => {
				if (i >= args.length) {
					if (value.required) {
						throw new Error(`Missing required option: ${key}`);
					}
					value.value = value.default;
				} else {
					value.value = parseArgument(args[i], value.type);
				}
				i++;
				return [key, value];
			})
		);

		await commandHandler.runCommand(command, newOptions, message);
	}
});
