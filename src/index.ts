import { Client } from "discord.js";
import { drizzle } from "drizzle-orm/mysql2";
import CommandHandler from "./commandHandler/CommandHandler.js";
export class Handlers {
	private _devGuilds: string[];

	constructor({
		client,
		commandsDir,
		databaseUrl,
		devGuilds = []
	}: {
		client: Client<boolean>;
		commandsDir?: string;
		databaseUrl?: string;
		devGuilds?: string[];
	}) {
		if (!client || !(client as Client).isReady())
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

	connectToDatabase(databaseUrl: string) {
		const db = drizzle({ connection: { uri: databaseUrl } });
	}
}

export * from "./builders.js";
export { createEnv } from "./env.js";
export type * from "./types/command.js";
export type * from "./types/options.js";
export type * from "./types/validations.js";
