import { syntaxValidation } from "../../../builders.js";

const validation = syntaxValidation({
	type: "all",
	callback: async (command) => {
		if (!command.callback) {
			throw new Error("Callback not found");
		}
	}
});

export default validation;
