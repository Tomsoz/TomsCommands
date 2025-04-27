import { syntaxValidation } from "../../../builders.js";

const validation = syntaxValidation({
	type: "text",
	callback: async (command, instance) => {
		if (!instance.prefix) {
			throw new Error(
				`Command ${command.name} is a text command but no prefix was specified.`
			);
		}
	}
});

export default validation;
