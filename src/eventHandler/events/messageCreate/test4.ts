import { event } from "../../../builders.js";

export default event({
	callback: (message, instance) => {
		console.log(message);
	}
});
