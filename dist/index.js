import { drizzle } from "drizzle-orm/mysql2";
import CommandHandler from "./commandHandler/CommandHandler.js";
export class Handlers {
    _devGuilds;
    constructor({ client, commandsDir, databaseUrl, devGuilds = [] }) {
        if (!client || !client.isReady())
            throw new Error("Client is required and must be ready");
        this._devGuilds = devGuilds;
        if (databaseUrl) {
            this.connectToDatabase(databaseUrl);
        }
        if (commandsDir) {
            new CommandHandler({ instance: this, commandsDir, client });
        }
    }
    get devGuilds() {
        return this._devGuilds;
    }
    connectToDatabase(databaseUrl) {
        const db = drizzle({ connection: { uri: databaseUrl } });
    }
}
export * from "./builders.js";
export { createEnv } from "./env.js";
//# sourceMappingURL=index.js.map