import { runtimeValidation } from "../../../builders.js";
const validation = runtimeValidation({
    type: "all",
    callback: async (args, instance) => {
        const { guild, command } = args;
        if (guild && command.dmOnly) {
            await command.onError?.({
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
//# sourceMappingURL=dmOnly.js.map