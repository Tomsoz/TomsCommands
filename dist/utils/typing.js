import { ApplicationCommandOptionType } from "discord.js";
export const getApplicationCommandOptionType = (type) => {
    switch (type) {
        case "string":
            return ApplicationCommandOptionType.String;
        case "number":
            return ApplicationCommandOptionType.Number;
        case "boolean":
            return ApplicationCommandOptionType.Boolean;
        case "user":
            return ApplicationCommandOptionType.User;
        case "channel":
            return ApplicationCommandOptionType.Channel;
        case "role":
            return ApplicationCommandOptionType.Role;
        case "mentionable":
            return ApplicationCommandOptionType.Mentionable;
        case "attachment":
            return ApplicationCommandOptionType.Attachment;
        default:
            return ApplicationCommandOptionType.String;
    }
};
//# sourceMappingURL=typing.js.map