import { createSyntaxValidation } from "../../../builders.js";
const validation = createSyntaxValidation({
    type: "all",
    callback: async (command) => {
        if (!command.callback) {
            throw new Error("Callback not found");
        }
    }
});
export default validation;
//# sourceMappingURL=callbackExists.js.map