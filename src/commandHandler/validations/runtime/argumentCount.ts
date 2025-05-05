import { runtimeValidation } from "../../../builders.js";
import { TextCommand, TextOnErrorArgs } from "../../../types/command.js";

const validation = runtimeValidation({
	type: "text",
	callback: async (args, instance) => {
		if (!instance.prefix) return false;

		const { command, message } = args;
		const { options } = command;
		const to = options || {};
		const textCommand = command as TextCommand<typeof to>;
		const providedArgs = message.content.split(/\s+/);
		const commandName = providedArgs
			.shift()
			?.substring(instance.prefix.length)
			?.trim();

		const requiredArgs = Object.entries(to).filter(
			([_, option]) => option.required
		);

		const onErrorArgs: TextOnErrorArgs<typeof to> = {
			...args,
			command: textCommand,
			error:
				providedArgs.length < requiredArgs.length
					? "tooLittleArgs"
					: "tooManyArgs"
		};
		await textCommand.onError?.(onErrorArgs);

		return providedArgs.length >= requiredArgs.length;
	}
});

export default validation;
