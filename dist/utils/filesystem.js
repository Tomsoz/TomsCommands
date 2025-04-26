import fs from "fs";
import path from "path";
export const dirExists = (dir) => {
    return fs.existsSync(dir);
};
export const getAllFiles = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let commandFiles = [];
    for (const file of files) {
        if (!file.name.endsWith(".js") && !file.name.endsWith(".ts"))
            continue;
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            commandFiles = commandFiles.concat(getAllFiles(filePath));
        }
        else {
            commandFiles.push(filePath);
        }
    }
    return commandFiles;
};
export const createDir = (dir) => {
    fs.mkdirSync(dir, { recursive: true });
};
//# sourceMappingURL=filesystem.js.map