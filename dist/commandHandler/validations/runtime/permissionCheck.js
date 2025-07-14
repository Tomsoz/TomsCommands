import { runtimeValidation } from "../../../builders.js";
const validation = runtimeValidation({
    type: "all",
    callback: async (args, instance) => {
        const { command } = args;
        const { permissions } = command;
        if (!permissions || permissions.length === 0)
            return true;
        let member;
        if ("message" in args && args.message) {
            member = args.message.member;
        }
        else if ("interaction" in args && args.interaction) {
            member = args.interaction.member;
        }
        if (!member) {
            await command.onError?.({
                ...args,
                command: command,
                error: "invalidPermissions"
            });
            return false;
        }
        const hasPermissions = permissions.some((permission) => member.permissions.has(permission, true));
        if (!hasPermissions) {
            await command.onError?.({
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
//# sourceMappingURL=permissionCheck.js.map