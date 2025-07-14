export function parseArgument(arg, type) {
    switch (type) {
        case "string":
            return String(arg);
        case "number":
            return Number(arg);
        case "boolean":
            return typeof arg == "boolean"
                ? arg
                : String(arg).toLowerCase() == "true"
                    ? true
                    : false;
        case "user":
            return arg;
        case "channel":
            return arg;
        case "role":
            return arg;
        case "mentionable":
            return arg;
        case "attachment":
            return arg;
        default:
            return arg;
    }
}
export function parseSlashArgument(option, type) {
    if (option?.value === null || option?.value === undefined)
        return null;
    switch (type) {
        case "string":
            return String(option.value);
        case "number":
            return Number(option.value);
        case "boolean":
            return Boolean(option.value);
        case "user":
            return (option.member ?? option.user);
        case "channel":
            return option.channel;
        case "role":
            return option.role;
        case "mentionable":
            return (option.member ??
                option.user ??
                option.role);
        case "attachment":
            return option.attachment;
        default:
            return option.value;
    }
}
//# sourceMappingURL=parseArgument.js.map