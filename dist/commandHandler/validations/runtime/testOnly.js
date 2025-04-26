import { createRuntimeValidation } from "../../../builders.js";
const validation = createRuntimeValidation({
    type: "all",
    callback: async (args, instance) => {
        const { command, guild } = args;
        if (command.devOnly &&
            (!guild || !instance.devGuilds.includes(guild.id))) {
            const errorArgs = {
                ...args,
                error: "devOnly"
            };
            await command.onError?.(errorArgs);
            return command.type === "slash";
        }
        return true;
    }
});
export default validation;
//# sourceMappingURL=testOnly.js.map