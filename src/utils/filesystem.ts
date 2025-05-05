import fs from "fs";
import path from "path";

export const dirExists = (dir: string) => {
	return fs.existsSync(dir);
};

export const getAllFiles = (dir: string, foldersOnly = false) => {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	let filesFound: string[] = [];

	for (const file of files) {
		const filePath = path.join(dir, file.name);
		if (file.isDirectory()) {
			if (foldersOnly) {
				filesFound.push(filePath);
			} else {
				filesFound = [...filesFound, ...getAllFiles(filePath)];
			}
		} else {
			if (!file.name.endsWith(".js") && !file.name.endsWith(".ts"))
				continue;
			filesFound.push(filePath);
		}
	}

	return filesFound;
};

export const createDir = (dir: string) => {
	fs.mkdirSync(dir, { recursive: true });
};
