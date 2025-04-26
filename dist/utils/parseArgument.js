export function parseArgument(arg, type) {
    switch (type) {
        case "string":
            return arg;
        case "number":
            return Number(arg);
        case "boolean":
            return (arg === "true");
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
//# sourceMappingURL=parseArgument.js.map