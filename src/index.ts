import { Client, ClientEvents } from "discord.js";
import CommandHandler from "./commandHandler/CommandHandler.js";
import { EventHandler } from "./eventHandler/EventHandler.js";

export type EventHandlerOptions = {
	dir?: string;
} & {
	[K in keyof ClientEvents]?: {
		[key: string]: (...args: any[]) => Promise<boolean>;
	};
};

export class Handlers {
	private _client: Client<boolean>;
	private _devGuilds: string[];
	private _prefix: string | undefined;
	private _commandHandler: CommandHandler | undefined;
	private _eventHandler: EventHandler | undefined;
	private _isAlwaysComponentsV2: boolean;

	constructor({
		client,
		commandsDir,
		prefix,
		devGuilds = [],
		events = {},
		isAlwaysComponentsV2 = false
	}: {
		client: Client<boolean>;
		commandsDir?: string;
		prefix?: string;
		devGuilds?: string[];
		events?: EventHandlerOptions;
		isAlwaysComponentsV2?: boolean;
	}) {
		this._client = client;
		this._devGuilds = devGuilds;
		this._prefix = prefix;
		this._isAlwaysComponentsV2 = isAlwaysComponentsV2;

		if (commandsDir) {
			this._commandHandler = new CommandHandler({
				instance: this,
				commandsDir,
				client
			});
		}

		this._eventHandler = new EventHandler({
			instance: this,
			events,
			client
		});
	}

	get client() {
		return this._client;
	}

	get prefix() {
		return this._prefix;
	}

	get devGuilds() {
		return this._devGuilds;
	}

	get commandHandler() {
		return this._commandHandler;
	}

	get eventHandler() {
		return this._eventHandler;
	}

	get isAlwaysComponentsV2() {
		return this._isAlwaysComponentsV2;
	}
}

export * from "./builders.js";
export type * from "./types/command.js";
export type * from "./types/options.js";
export type * from "./types/validations.js";
