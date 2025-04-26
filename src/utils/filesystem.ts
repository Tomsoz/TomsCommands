import fs from "fs";
import path from "path";

export const dirExists = (dir: string) => {
	return fs.existsSync(dir);
};

export const getAllFiles = (dir: string) => {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	let commandFiles: string[] = [];

	for (const file of files) {
		if (!file.name.endsWith(".js") && !file.name.endsWith(".ts")) continue;

		const filePath = path.join(dir, file.name);
		if (file.isDirectory()) {
			commandFiles = commandFiles.concat(getAllFiles(filePath));
		} else {
			commandFiles.push(filePath);
		}
	}

	return commandFiles;
};

export const createDir = (dir: string) => {
	fs.mkdirSync(dir, { recursive: true });
};
