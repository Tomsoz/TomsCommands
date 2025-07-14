import CommandHandler from "./commandHandler/CommandHandler.js";
import { EventHandler } from "./eventHandler/EventHandler.js";
export class Handlers {
    _client;
    _devGuilds;
    _prefix;
    _commandHandler;
    _eventHandler;
    _isAlwaysComponentsV2;
    constructor({ client, commandsDir, prefix, devGuilds = [], events = {}, isAlwaysComponentsV2 = false }) {
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
//# sourceMappingURL=index.js.map