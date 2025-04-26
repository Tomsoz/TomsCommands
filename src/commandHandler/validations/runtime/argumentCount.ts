import { createRuntimeValidation } from "../../../builders.js";

const validation = createRuntimeValidation({
	type: "all",
	callback: async (args) => {
		if (args.command.type === "slash") return true;

		// TODO: Implement argument count validation

		return true;
	}
});

export default validation;
