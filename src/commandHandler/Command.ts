import { Handlers } from "../index.js";
import { Command } from "../types/command.js";

export class CommandObject {
	private _commandName: string;
	private _commandObject: Command;
	private _instance: Handlers;

	constructor(
		instance: Handlers,
		commandName: string,
		commandObject: Command
	) {
		this._instance = instance;
		this._commandName = commandName.toLowerCase();
		this._commandObject = commandObject;
	}

	get instance() {
		return this._instance;
	}

	get commandName() {
		return this._commandName;
	}

	get commandObject() {
		return this._commandObject;
	}
}
