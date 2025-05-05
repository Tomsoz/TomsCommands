import { GuildMember } from "discord.js";
import { runtimeValidation } from "../../../builders.js";

const validation = runtimeValidation({
	type: "all",
	callback: async (args, instance) => {
		const { command } = args;
		const { permissions } = command;
		if (!permissions || permissions.length === 0) return true;

		let member: GuildMember | null | undefined;
		if ("message" in args && args.message) {
			member = args.message.member;
		} else if ("interaction" in args && args.interaction) {
			member = args.interaction.member as GuildMember | null;
		}
		if (!member) {
			await (command as any).onError?.({
				...args,
				command: command,
				error: "invalidPermissions"
			});
			return false;
		}

		const hasPermissions = permissions.some((permission) =>
			member.permissions.has(permission, true)
		);
		if (!hasPermissions) {
			await (command as any).onError?.({
				...args,
				command: command,
				error: "invalidPermissions"
			});
			return false;
		}

		return true;
	}
});

export default validation;
