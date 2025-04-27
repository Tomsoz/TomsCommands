import { runtimeValidation } from "../../../builders.js";

const validation = runtimeValidation({
	type: "all",
	callback: async (args) => {
		if (args.command.type === "slash") return true;

		// TODO: Implement argument count validation

		return true;
	}
});

export default validation;
